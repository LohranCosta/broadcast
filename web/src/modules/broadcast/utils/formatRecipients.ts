const VISIBLE_NAMES = 3

export function formatRecipients(names: string[]) {
  if (names.length === 0) return 'Nenhum contato'

  const visible = names.slice(0, VISIBLE_NAMES)
  const hidden = names.length - visible.length

  if (hidden > 0) return `${visible.join(', ')} e mais ${hidden}`
  if (visible.length === 1) return visible[0]

  return `${visible.slice(0, -1).join(', ')} e ${visible.at(-1)}`
}
