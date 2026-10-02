// Todas as coleções ficam na raiz do Firestore (sem subcoleções).
// O isolamento entre clientes é feito pelo campo clientId + regras de segurança.
export const COLLECTIONS = {
  clients: 'clients',
  connections: 'connections',
  contacts: 'contacts',
  messages: 'messages',
} as const
