import OpenAI from 'openai'
import { SYSTEM_PROMPT } from '../prompts/systemPrompt'
import type { Message, CardId } from '../types/chat'

export const TOOL_DEFINITION: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'show_knowledge_card',
    description: '当检测到学生处于 L1 核心知识缺失时调用，触发前端显示对应互动知识卡片',
    parameters: {
      type: 'object',
      properties: {
        card_id: {
          type: 'string',
          enum: ['congruent_sas', 'congruent_aas', 'isosceles_right', 'area_decompose'],
        },
        reason: {
          type: 'string',
          description: 'AI 内部判断原因，不展示给学生',
        },
      },
      required: ['card_id', 'reason'],
    },
  },
}

export function buildMessages(
  messages: Message[]
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const system: OpenAI.Chat.ChatCompletionSystemMessageParam = {
    role: 'system',
    content: SYSTEM_PROMPT,
  }

  const rest = messages.map((m): OpenAI.Chat.ChatCompletionMessageParam => {
    if (m.role === 'tool') {
      return {
        role: 'tool',
        content: m.content,
        tool_call_id: m.toolCallId ?? '',
      }
    }
    if (m.role === 'assistant' && m.toolCallId) {
      // Reconstruct assistant message with tool_calls for MiniMax
      return {
        role: 'assistant',
        content: m.content.startsWith('[tool_call:') ? null : m.content,
        tool_calls: [{
          id: m.toolCallId,
          type: 'function',
          function: {
            name: 'show_knowledge_card',
            arguments: JSON.stringify({ card_id: m.content.replace('[tool_call:', '').replace(']', ''), reason: '' }),
          },
        }],
      } as OpenAI.Chat.ChatCompletionAssistantMessageParam
    }
    return { role: m.role as 'user' | 'assistant', content: m.content }
  })

  return [system, ...rest]
}

export function createClient() {
  return new OpenAI({
    apiKey: import.meta.env.VITE_MINIMAX_API_KEY,
    baseURL: `${window.location.origin}/minimax-api/v1`,
    dangerouslyAllowBrowser: true,
  })
}

export interface AIResponse {
  text: string
  cardId?: CardId
  toolCallId?: string
}

export async function sendMessage(messages: Message[]): Promise<AIResponse> {
  const client = createClient()
  const response = await client.chat.completions.create({
    model: 'MiniMax-M2.5',
    messages: buildMessages(messages),
    tools: [TOOL_DEFINITION],
    tool_choice: 'auto',
  })

  const choice = response.choices[0]
  const raw = choice.message.content ?? ''
  const text = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  const toolCall = choice.message.tool_calls?.[0]

  if (toolCall?.function.name === 'show_knowledge_card') {
    const args = JSON.parse(toolCall.function.arguments) as {
      card_id: CardId
      reason: string
    }
    return { text, cardId: args.card_id, toolCallId: toolCall.id }
  }

  return { text }
}
