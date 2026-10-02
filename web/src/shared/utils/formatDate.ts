const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export const formatDate = (date: Date) => dateFormatter.format(date)

export const formatDateTime = (date: Date) => `${formatDate(date)} às ${timeFormatter.format(date)}`
