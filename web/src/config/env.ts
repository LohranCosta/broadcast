import { parseEnv } from './env.schema'

// Falha logo na inicialização se faltar alguma variável, em vez de quebrar em runtime lá na frente
export const env = parseEnv(import.meta.env)
