import { describe, it, expect } from 'vitest'
import { buildMessages, TOOL_DEFINITION } from '../minimaxApi'
import type { Message } from '../../types/chat'

describe('buildMessages', () => {
  it('prepends system message', () => {
    const msgs: Message[] = [
      { id: '1', role: 'user', content: '我不懂全等三角形' },
    ]
    const result = buildMessages(msgs)
    expect(result[0].role).toBe('system')
    expect(result).toHaveLength(2)
  })

  it('converts user message correctly', () => {
    const msgs: Message[] = [
      { id: '1', role: 'user', content: '帮我看这道题' },
    ]
    const result = buildMessages(msgs)
    expect(result[1].role).toBe('user')
    expect((result[1] as { content: string }).content).toBe('帮我看这道题')
  })

  it('converts tool result message with tool_call_id', () => {
    const msgs: Message[] = [
      { id: '1', role: 'tool', content: '完成', toolCallId: 'call_123' },
    ]
    const result = buildMessages(msgs)
    expect(result[1]).toMatchObject({ role: 'tool', tool_call_id: 'call_123' })
  })

  it('preserves message order', () => {
    const msgs: Message[] = [
      { id: '1', role: 'user', content: 'msg1' },
      { id: '2', role: 'assistant', content: 'msg2' },
      { id: '3', role: 'user', content: 'msg3' },
    ]
    const result = buildMessages(msgs)
    expect(result).toHaveLength(4)
    expect(result[1].role).toBe('user')
    expect(result[2].role).toBe('assistant')
    expect(result[3].role).toBe('user')
  })
})

describe('TOOL_DEFINITION', () => {
  it('has correct function name', () => {
    expect(TOOL_DEFINITION.function.name).toBe('show_knowledge_card')
  })

  it('has all 4 card_ids in enum', () => {
    const params = TOOL_DEFINITION.function.parameters as {
      properties: { card_id: { enum: string[] } }
    }
    expect(params.properties.card_id.enum).toContain('congruent_sas')
    expect(params.properties.card_id.enum).toContain('congruent_aas')
    expect(params.properties.card_id.enum).toContain('isosceles_right')
    expect(params.properties.card_id.enum).toContain('area_decompose')
  })
})
