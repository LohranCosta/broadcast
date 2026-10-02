export const ROUTES = {
  home: '/',
  login: '/login',
  signUp: '/cadastro',
  connections: '/conexoes',
  connection: '/conexoes/:connectionId',
  contacts: (connectionId: string) => `/conexoes/${connectionId}/contatos`,
  broadcast: (connectionId: string) => `/conexoes/${connectionId}/broadcast`,
} as const
