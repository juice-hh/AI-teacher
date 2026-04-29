import type { CardId } from '../../types/chat'
import { CongruentSAS } from './CongruentSAS'
import { CongruentAAS } from './CongruentAAS'
import { IsoscelesRight } from './IsoscelesRight'
import { AreaDecompose } from './AreaDecompose'

interface Props {
  readonly cardId: CardId | null
  readonly onDismiss: () => void
}

const CARD_MAP: Record<CardId, React.FC<{ readonly onComplete: () => void }>> = {
  congruent_sas: CongruentSAS,
  congruent_aas: CongruentAAS,
  isosceles_right: IsoscelesRight,
  area_decompose: AreaDecompose,
}

export function KnowledgeCardWrapper({ cardId, onDismiss }: Props) {
  if (!cardId) return null
  const CardComponent = CARD_MAP[cardId]
  return <CardComponent onComplete={onDismiss} />
}
