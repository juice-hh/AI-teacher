import { ProblemPanel } from './components/layout/ProblemPanel'
import { InteractionPanel } from './components/layout/InteractionPanel'

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <ProblemPanel />
      <InteractionPanel />
    </div>
  )
}
