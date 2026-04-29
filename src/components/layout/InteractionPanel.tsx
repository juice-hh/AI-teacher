import { ChatMessages } from '../chat/ChatMessages'
import { ChatInput } from '../chat/ChatInput'
import { KnowledgeCardWrapper } from '../cards/KnowledgeCardWrapper'
import { useChat } from '../../hooks/useChat'

export function InteractionPanel() {
  const { state, send, dismissCard } = useChat()

  const pendingToolCallId =
    state.activeCard
      ? (state.messages.find(
          m => m.toolCallId && m.content.includes(state.activeCard!)
        )?.toolCallId ?? '')
      : ''

  return (
    <div
      data-testid="interaction-panel"
      className="w-1/2 h-screen flex flex-col bg-white relative overflow-hidden"
    >
      <ChatMessages messages={state.messages} isLoading={state.isLoading} />
      <ChatInput onSend={send} disabled={state.isLoading || !!state.activeCard} />
      <KnowledgeCardWrapper
        cardId={state.activeCard}
        onDismiss={() => dismissCard(pendingToolCallId)}
      />
    </div>
  )
}
