import { InlineLoader } from '@/components/ui/InlineLoader'
import { PanelCard } from '@/components/ui/PanelCard'

export const LoadingScreen = ({ message = 'Cargando...' }) => (
  <div className="panel-gradient flex min-h-screen items-center justify-center px-4 py-12">
    <PanelCard className="max-w-md text-center" padding="lg" variant="form">
      <div className="mx-auto flex w-fit items-center justify-center rounded-full bg-[rgba(47,93,115,0.08)] px-4 py-3">
        <InlineLoader label={message} />
      </div>
    </PanelCard>
  </div>
)
