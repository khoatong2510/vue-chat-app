export type ID = string

export type CursorPaged<T> = {
  items: T[],
  cursor?: string | null
}