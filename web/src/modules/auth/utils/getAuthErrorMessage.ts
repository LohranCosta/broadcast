const DEFAULT_MESSAGE = 'Não foi possível concluir. Tente novamente.'

const INVALID_CREDENTIALS = 'E-mail ou senha incorretos.'

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': INVALID_CREDENTIALS,
  'auth/wrong-password': INVALID_CREDENTIALS,
  'auth/user-not-found': INVALID_CREDENTIALS,
  'auth/invalid-email': 'E-mail inválido.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/email-already-in-use': 'Já existe uma conta com este e-mail.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
}

const hasCode = (error: unknown): error is { code: string } =>
  typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'

export function getAuthErrorMessage(error: unknown) {
  return (hasCode(error) && MESSAGES[error.code]) || DEFAULT_MESSAGE
}
