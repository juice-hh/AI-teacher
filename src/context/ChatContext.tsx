import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { ChatState, ChatAction, Message } from '../types/chat'

const initial: ChatState = { messages: [], activeCard: null, isLoading: false }

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SHOW_CARD':
      return { ...state, activeCard: action.payload }
    case 'DISMISS_CARD': {
      const toolMsg: Message = {
        id: crypto.randomUUID(),
        role: 'tool',
        content: '学生已完成知识点互动练习',
        toolCallId: action.payload.toolCallId,
      }
      return {
        ...state,
        activeCard: null,
        messages: [...state.messages, toolMsg],
      }
    }
    default:
      return state
  }
}

const ChatContext = createContext<{
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
} | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initial)
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be inside ChatProvider')
  return ctx
}
