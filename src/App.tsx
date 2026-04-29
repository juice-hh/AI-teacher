import { ProblemPanel } from './components/layout/ProblemPanel'
import { InteractionPanel } from './components/layout/InteractionPanel'
import { ChatProvider } from './context/ChatContext'

export default function App() {
  return (
    <ChatProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-white">
        <ProblemPanel />
        <InteractionPanel />
      </div>
    </ChatProvider>
  )
}
