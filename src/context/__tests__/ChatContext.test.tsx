import { describe, it, expect } from 'vitest'
import { chatReducer } from '../ChatContext'
import type { ChatState, ChatAction } from '../../types/chat'

const initial: ChatState = { messages: [], activeCard: null, isLoading: false }

describe('chatReducer', () => {
  it('adds a message', () => {
    const action: ChatAction = {
      type: 'ADD_MESSAGE',
      payload: { id: '1', role: 'user', content: 'hello' },
    }
    const next = chatReducer(initial, action)
    expect(next.messages).toHaveLength(1)
    expect(next.messages[0].content).toBe('hello')
  })

  it('sets loading state', () => {
    const next = chatReducer(initial, { type: 'SET_LOADING', payload: true })
    expect(next.isLoading).toBe(true)
  })

  it('shows a card', () => {
    const action: ChatAction = { type: 'SHOW_CARD', payload: 'congruent_sas' }
    const next = chatReducer(initial, action)
    expect(next.activeCard).toBe('congruent_sas')
  })

  it('dismisses a card and adds tool result message', () => {
    const withCard: ChatState = { ...initial, activeCard: 'congruent_sas' }
    const action: ChatAction = {
      type: 'DISMISS_CARD',
      payload: { toolCallId: 'call_abc' },
    }
    const next = chatReducer(withCard, action)
    expect(next.activeCard).toBeNull()
    expect(next.messages.some(m => m.role === 'tool')).toBe(true)
    expect(next.messages[0].toolCallId).toBe('call_abc')
  })

  it('does not mutate original state', () => {
    const action: ChatAction = {
      type: 'ADD_MESSAGE',
      payload: { id: '1', role: 'user', content: 'hi' },
    }
    chatReducer(initial, action)
    expect(initial.messages).toHaveLength(0)
  })
})
