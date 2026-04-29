export type Role = 'user' | 'assistant' | 'tool'

export interface Message {
  id: string
  role: Role
  content: string
  toolCallId?: string
}

export type CardId =
  | 'congruent_sas'
  | 'congruent_aas'
  | 'isosceles_right'
  | 'area_decompose'

export interface ChatState {
  messages: Message[]
  activeCard: CardId | null
  isLoading: boolean
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_CARD'; payload: CardId }
  | { type: 'DISMISS_CARD'; payload: { toolCallId: string } }
