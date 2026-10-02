export const onlyDigits = (value: string) => value.replace(/\D/g, '')

const BRAZIL_COUNTRY_CODE = '55'

const nationalDigits = (value: string) => {
  const digits = onlyDigits(value)
  const hasCountryCode =
    digits.startsWith(BRAZIL_COUNTRY_CODE) && (value.trim().startsWith('+') || digits.length > 12)

  return hasCountryCode ? digits.slice(BRAZIL_COUNTRY_CODE.length) : digits
}

export function formatPhone(value: string) {
  const digits = nationalDigits(value).slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`

  const ddd = digits.slice(0, 2)
  const number = digits.slice(2)
  const split = number.length > 8 ? 5 : 4

  if (number.length <= split) return `(${ddd}) ${number}`

  return `(${ddd}) ${number.slice(0, split)}-${number.slice(split)}`
}
