export type Observer<T> = {
  next: (value: T) => void
  error: (error: unknown) => void
}

export type Subscription = {
  unsubscribe: () => void
}

export type Subscribable<T> = {
  subscribe: (observer: Observer<T>) => Subscription
}
