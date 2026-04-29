import { SYSTEM_PROMPT } from '../prompts/systemPrompt'
import type { Message, CardId } from '../types/chat'

type OAIMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: unknown[] }
  | { role: 'tool'; content: string; tool_call_id: string }

export const TOOL_DEFINITION = {
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

export function buildMessages(messages: Message[]): OAIMessage[] {
  const system: OAIMessage = { role: 'system', content: SYSTEM_PROMPT }

  const rest: OAIMessage[] = messages.map(m => {
    if (m.role === 'tool') {
      return { role: 'tool', content: m.content, tool_call_id: m.toolCallId ?? '' }
    }
    if (m.role === 'assistant' && m.toolCallId) {
      return {
        role: 'assistant',
        content: m.content.startsWith('[tool_call:') ? null : m.content,
        tool_calls: [{
          id: m.toolCallId,
          type: 'function',
          function: {
            name: 'show_knowledge_card',
            arguments: JSON.stringify({
              card_id: m.content.replace('[tool_call:', '').replace(']', ''),
              reason: '',
            }),
          },
        }],
      }
    }
    return { role: m.role as 'user' | 'assistant', content: m.content }
  })

  return [system, ...rest]
}

export interface AIResponse {
  text: string
  cardId?: CardId
  toolCallId?: string
}

export async function sendMessage(messages: Message[]): Promise<AIResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'MiniMax-M2.5',
      messages: buildMessages(messages),
      tools: [TOOL_DEFINITION],
      tool_choice: 'auto',
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { message?: string; error?: { message?: string } }
    throw new Error(`${response.status} ${err.error?.message ?? err.message ?? response.statusText}`)
  }

  const data = await response.json() as {
    choices: Array<{
      message: {
        content?: string
        tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>
      }
    }>
  }

  const choice = data.choices[0]
  const raw = choice.message.content ?? ''
  const text = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  const toolCall = choice.message.tool_calls?.[0]

  if (toolCall?.function.name === 'show_knowledge_card') {
    const args = JSON.parse(toolCall.function.arguments) as { card_id: CardId; reason: string }
    return { text, cardId: args.card_id, toolCallId: toolCall.id }
  }

  return { text }
}
