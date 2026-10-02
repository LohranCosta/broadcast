export const countOf = <T>(items: readonly T[], value: T) =>
  items.filter((item) => item === value).length
