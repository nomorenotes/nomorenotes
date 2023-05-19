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
	eval(code: string, callback: ((status: true, awaited: boolean, value: any) => void) | ((status: false, awaited: boolean, stack: string) => void) | (status: null, awaited: undefined, stack: string)): void
}

declare interface ClientToServerEvents {
	saveable<K extends keyof Saveables>(name: K, value: Saveables[K]): void
	saveable(name: string, value: string): void
	"chat message"
}

declare interface Saveables {
	name: string
	mode: unknown
}
