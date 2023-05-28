/// <reference path="./types.d.ts" />
type ServerSocket = import("socket.io-client").Socket<
  ServerToClientEvents,
  ClientToServerEvents
>
