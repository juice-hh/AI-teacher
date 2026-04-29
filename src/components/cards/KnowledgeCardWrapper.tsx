import { AnimatePresence, motion } from 'framer-motion'
import type { CardId } from '../../types/chat'
import { CongruentSAS } from './CongruentSAS'
import { CongruentAAS } from './CongruentAAS'
import { IsoscelesRight } from './IsoscelesRight'
import { AreaDecompose } from './AreaDecompose'

interface Props {
  cardId: CardId | null
  onDismiss: () => void
}

const CARD_MAP: Record<CardId, React.FC<{ readonly onComplete: () => void }>> = {
  congruent_sas: CongruentSAS,
  congruent_aas: CongruentAAS,
  isosceles_right: IsoscelesRight,
  area_decompose: AreaDecompose,
}

export function KnowledgeCardWrapper({ cardId, onDismiss }: Props) {
  const CardComponent = cardId ? CARD_MAP[cardId] : null

  return (
    <AnimatePresence>
      {CardComponent && (
        <motion.div
          key={cardId}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 bg-white z-10 flex flex-col"
        >
          <CardComponent onComplete={onDismiss} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
