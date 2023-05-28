declare interface ServerToClientEvents {
  saveable<K extends keyof Saveables>(name: K, value: Saveables[K]): void
  saveable(name: string, value: string): void
  delete(id: string): void
  edit(id: string, text: string): void
  reload(): void
  ban(banner: string, time: number, reason: string): void
  "chat message"(id: string, message: string): void
  "upload:status"(status: string): void
  "upload:done"(url: string): void
  linkout(url: string): void
  auth(to: string): void
  died(result: {
    exitCode: number,
    signal?: number
  }): void
  stdout(data: string): void
}

declare interface ClientToServerEvents {
  saveable<K extends keyof Saveables>(name: K, value: Saveables[K]): void
  saveable(name: string, value: string): void
  tty(size: { cols: number, rows: number }): void
  "chat message"
  stdin(data: string): void
  auth(uname: string, passw: string, cb: (success: boolean) => void): void
  winch(size: { cols: number, rows: number }): void
}

declare interface Saveables {
  name: string
  mode: unknown
}
