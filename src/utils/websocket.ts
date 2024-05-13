import { isNil } from "lodash-es"
import { Time } from "./time"

type Listeners = {
  open: Array<() => void>
  error: Array<(e: Event) => void>
  message: Array<(msg: MessageEvent<any>) => void>
  retry: Array<(retry: number) => void>
  close: Array<(code: string) => void>
}

export class RetryWebSocket {
  private retryDelay: number

  private retryCount = 0

  private maxRetries = 3

  /** 指数倍乘基数 */
  private retryFactor = 2

  private listeners: Listeners = {
    open: [],
    error: [],
    message: [],
    close: [],
    retry: [],
  }

  private connection: WebSocket | null = null

  constructor(delay = Time.Second) {
    this.retryDelay = delay

    this.connect = this.connect.bind(this)
    this.close = this.close.bind(this)
    this.emit = this.emit.bind(this)
    this.off = this.off.bind(this)
    this.on = this.on.bind(this)
  }

  get connected() {
    return !isNil(this.connection)
  }

  connect(url: string) {
    this.connection = new WebSocket(url)

    this.connection.onopen = () => {
      console.log("WebSocket connection established")
      this.emit("open")
      this.retryCount = 0 // Reset retry count on successful connection
    }

    this.connection.onclose = (event) => {
      console.log(`WebSocket connection closed with code: ${event.code}`)
      if (this.retryCount < this.maxRetries) {
        const delay = this.retryDelay * this.retryFactor ** this.retryCount
        console.log(`Retrying connection in ${delay} milliseconds...`)
        window.setTimeout(() => this.connect(url), delay)
        this.retryCount++
        this.emit("retry", this.retryCount)
      } else {
        this.retryCount = 0
        this.connection = null
        this.emit("close", event.code)
        console.log("Max retries exceeded. Connection failed.")
      }
    }

    this.connection.onerror = (error) => {
      console.log("🚀 ~ RetryWebSocket ~ connect ~ error:", error)
      this.emit("error", error)
    }

    this.connection.onmessage = (message) => {
      console.log("🚀 ~ RetryWebSocket ~ connect ~ message:", message, message.data)
      this.emit("message", message)
    }
  }

  close() {
    if (this.connection) {
      this.connection.close()
      this.connection = null
      this.emit("close", "user")
      console.log("WebSocket connection closed by user")
    }
  }

  on(event: "open", callback: () => void): void
  on(event: "error", callback: (e: Event) => void): void
  on(event: "message", callback: (msg: MessageEvent<any>) => void): void
  on(event: "close", callback: (code: string) => void): void
  on(event: "retry", callback: (retry: number) => void): void
  on(event: keyof Listeners, callback: (arg?: any) => void) {
    this.listeners[event].push(callback)
  }

  off(event: "open", callback: () => void): void
  off(event: "error", callback: (e: Event) => void): void
  off(event: "message", callback: (msg: MessageEvent) => void): void
  off(event: "close", callback: (code: string) => void): void
  off(event: "retry", callback: (retry: number) => void): void
  off(event: keyof Listeners, callback: (arg?: any) => void) {
    const found = this.listeners[event].indexOf(callback)
    if (found > -1) {
      this.listeners[event].splice(found, 1)
    }
  }

  emit(event: keyof Listeners, arg?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(arg as never))
    }
  }
}
