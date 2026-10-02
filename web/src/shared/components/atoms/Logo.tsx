import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'

import { cn } from '@shared/utils/cn'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
        <ChatBubbleRoundedIcon fontSize="small" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Broadcast</span>
    </div>
  )
}
