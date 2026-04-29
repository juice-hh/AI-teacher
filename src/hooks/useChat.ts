import { useCallback } from 'react'
import { useChatContext } from '../context/ChatContext'
import { sendMessage } from '../services/minimaxApi'
import type { Message } from '../types/chat'

export function useChat() {
  const { state, dispatch } = useChatContext()

  const send = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
      }
      dispatch({ type: 'ADD_MESSAGE', payload: userMsg })
      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        const allMessages = [...state.messages, userMsg]
        const result = await sendMessage(allMessages)

        if (result.text) {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: { id: crypto.randomUUID(), role: 'assistant', content: result.text },
          })
        }

        if (result.cardId) {
          dispatch({ type: 'SHOW_CARD', payload: result.cardId })
          if (result.toolCallId) {
            dispatch({
              type: 'ADD_MESSAGE',
              payload: {
                id: result.toolCallId,
                role: 'assistant',
                content: `[tool_call:${result.cardId}]`,
                toolCallId: result.toolCallId,
              },
            })
          }
        }
      } catch (err) {
        console.error('[useChat] API error:', err)
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `抱歉，我遇到了一点问题，请稍后再试。（${err instanceof Error ? err.message : String(err)}）`,
          },
        })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [state.messages, dispatch]
  )

  const dismissCard = useCallback(
    (toolCallId: string) => {
      dispatch({ type: 'DISMISS_CARD', payload: { toolCallId } })
    },
    [dispatch]
  )

  return { state, send, dismissCard }
}
