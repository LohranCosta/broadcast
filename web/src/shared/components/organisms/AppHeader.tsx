import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { Logo } from '../atoms/Logo'

type AppHeaderProps = {
  userName: string
  onSignOut: () => void
}

export function AppHeader({ userName, onSignOut }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Logo />

        <div className="flex items-center gap-3">
          <Avatar className="size-8 bg-primary-light text-sm font-semibold text-primary-dark">
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">{userName}</span>
          <Tooltip title="Sair">
            <IconButton aria-label="Sair" onClick={onSignOut}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
