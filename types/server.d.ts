/// <reference path="./types.d.ts" />
import type { Server as SIOServer, Socket as SIOSocket } from "socket.io"
import type { EventsMap, DefaultEventsMap } from "socket.io/dist/typed-events"
import type { FancifyLog } from "../fancify_log"

declare type ServerType = SIOServer<
  ClientToServerEvents,
  ServerToClientEvents
> &
  NMNServer
declare type ClientSocket = SIOSocket<
  ClientToServerEvents,
  ServerToClientEvents
> &
  NMNClientSocket & { [rs]: NMNClientData }
declare interface Emittable<Events extends EventsMap = DefaultEventsMap> {
  emit<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): void
}
declare type Prefix = keyof typeof import("../prefixes.js")
declare const rs: R["s"]
declare interface R {
  io: ServerType
  al: string
  dbg: FancifyLog
  readonly s: unique symbol
  USERDICT: Record<string, string>
  SYS_ID: { id: string }
  surr: typeof import("../surr.js")
  t: ReturnType<typeof import("../texts.js")>["en_us"]
  away: Record<string, string>
  rnames: Record<string, ClientSocket | undefined>
  commit: string
  nexusSyms: { here: string; noid: string; other: string }
  nexusData: NexusServer[]
  pf: typeof import("../prefixes.js")
  list: ClientSocket[]
  mail: (content: string, username?: string) => Promise<void[]>
  sendmsg: (from: ClientSocket) => (msg: string) => void
  parse_emoji: (msg: string) => string
  mes: (
    who: Emittable<ServerToClientEvents>,
    prefix: Prefix,
    msg: string,
    sender?: { id: string }
  ) => void
}
type MapRecord<K extends string | number | symbol, V> = { [prop in K]: V }
type Cat<type> = type
interface NMNClientSocket {
  _debug_command_detection?: boolean
  silentLeave?: boolean
  op?: boolean
  permDeop?: boolean
}
interface NMNClientData {
  hotboxed?: boolean
  lock?: boolean
  name: string
}
interface NMNServer {
  guestlock?: boolean
}
interface NexusServer {
  id?: string
  name: string
  description: string
  url: string
  secure: boolean
  blocked?: boolean
  gone?: boolean
}
