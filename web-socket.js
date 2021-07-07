import { LitElement, html, css } from 'lit'

// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

class WebSocket extends LitElement {
  #ws
  static get styles () {
    return css`
      :host {
        display: inline-block;
      }
      .error {
        color: red;
      }
    `
  }

  static get properties () {
    return {
      url: String,
      protocols: String,
      message: String,
      error: String,
      wsStatus: String
    }
  }

  constructor () {
    super()
    this.wsStatus = 'Not Connected'
  }

  connectedCallback () {
    super.connectedCallback()
    // this.#createWebSocket() create WebSocket at start
  }

  updated (changed) {
    if (changed.has('url') || changed.has('protocols')) {
      if (this.#ws) this.#ws.close()
    }
  }

  // Create new webSocket connection
  #createWebSocket () {
    if (this.#ws && this.#ws.readyState === OPEN) {
      console.log('@WS >> ACTIVE')
      return
    }
    try {
      this.#ws = new window.WebSocket(this.url, this.protocols)
      // bind WebSocket events to component events
      this.#ws.addEventListener('open', this.#onOpen.bind(this))
      this.#ws.addEventListener('close', this.#onClose.bind(this))
      this.#ws.addEventListener('message', this.#onMessage.bind(this))
      this.#ws.addEventListener('error', this.#onError.bind(this))
    } catch (err) {
      console.log(err)
      this.error = err
    }
  }

  #onOpen (event) {
    console.log('@WS >> Open')
    this.#helperStatus()
  }

  #onClose (event) {
    console.log('@WS >> Close')
    this.#ws.close()
    this.#helperStatus()
  }

  #onMessage (event) {
    console.log(event.data)
    this.message = event.data
  }

  #onError (event) {
    console.log(event.data)
    this.error = event.data
    this.#helperStatus()
  }

  #openWs () {
    this.#createWebSocket()
  }

  #closeWs () {
    this.#ws.close()
  }

  // ship message to the WebSocket server
  #sendMsg () {
    const msg = this.shadowRoot.querySelector('textarea')?.value
    if (this.#ws && this.#ws.readyState === OPEN) {
      console.log(`@WS SEND >> ${msg}`)
      this.#ws.send(msg)
    }
  }

  #helperStatus () {
    switch(this.#ws?.readyState) {
      case CONNECTING:
        this.wsStatus = 'Connecting '
        break
      case OPEN:
        this.wsStatus = 'Connected'
        break
      case CLOSING:
        this.wsStatus =  'Closing '
        break
      case CLOSED:
        this.wsStatus = 'Close'
        break
      default:
        this.wsStatus = 'undefined'
    }
  }

  render () {
    return html`
      <div class="content">
        <p>${this.wsStatus} to ${this.url} </p>
        <button @click=${this.#openWs}>Open WebSocket</button>
        <button @click=${this.#closeWs}>Close WebSocket</button>
        <p>${this.message}</p>
        <p class="error">${this.error}</p>
        <hr>
        <p>Send msg to ${this.url} </p>
        <textarea rows="7" cols="50"></textarea>
        <button @click=${this.#sendMsg}>Send</button>
      </div>
    `
  }
}

customElements.define('web-socket', WebSocket)
