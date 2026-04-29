import { ChatMessages } from '../chat/ChatMessages'
import { ChatInput } from '../chat/ChatInput'
import { useChat } from '../../hooks/useChat'

export function InteractionPanel() {
  const { state, send } = useChat()

  return (
    <div
      data-testid="interaction-panel"
      className="w-1/2 h-screen flex flex-col bg-white"
    >
      <ChatMessages messages={state.messages} isLoading={state.isLoading} />
      <ChatInput onSend={send} disabled={state.isLoading} />
    </div>
  )
}
