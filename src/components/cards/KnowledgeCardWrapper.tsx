import type { CardId } from '../../types/chat'

interface Props {
  cardId: CardId | null
  onDismiss: () => void
}

export function KnowledgeCardWrapper({ cardId }: Props) {
  if (!cardId) return null
  return (
    <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
      <p className="text-slate-500">知识卡片: {cardId}</p>
    </div>
  )
}
