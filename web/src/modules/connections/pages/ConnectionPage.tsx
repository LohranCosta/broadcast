import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet, useLocation, useParams } from 'react-router'

import { ROUTES } from '@shared/constants/routes'

import { useConnection } from '../hooks/useConnection'

export function ConnectionPage() {
  const { connectionId = '' } = useParams()
  const { pathname } = useLocation()
  const { data: connection, loading, error } = useConnection(connectionId)

  const tabs = [
    { label: 'Contatos', to: ROUTES.contacts(connectionId) },
    { label: 'Broadcast', to: ROUTES.broadcast(connectionId) },
  ]
  const currentTab = tabs.find((tab) => pathname.startsWith(tab.to))?.to ?? false

  const notFound = !loading && (error || !connection)

  return (
    <>
      <Button
        component={RouterLink}
        to={ROUTES.connections}
        startIcon={<ArrowBackRoundedIcon />}
        color="inherit"
        size="small"
        className="mb-3 text-muted"
      >
        Conexões
      </Button>

      {notFound ? (
        <Alert severity="warning">Conexão não encontrada.</Alert>
      ) : (
        <>
          <Typography variant="h5" component="h1" className="font-semibold">
            {loading ? <Skeleton width={220} /> : connection?.name}
          </Typography>

          <Tabs value={currentTab} className="mt-4 mb-6 border-b border-border">
            {tabs.map((tab) => (
              <Tab
                key={tab.to}
                label={tab.label}
                value={tab.to}
                component={RouterLink}
                to={tab.to}
              />
            ))}
          </Tabs>

          <Outlet />
        </>
      )}
    </>
  )
}
