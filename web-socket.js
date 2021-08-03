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
      * {
        /* --ws-svg-size: 33px; */
      }
      :host {
        display: block;
        text-align: center;
      }
      p {
        font-size: 2rem;
        color: #333;
      }
      button {
        display: inline-block;
        padding: 1rem;

        min-width: calc(var(--ws-svg-size, 33px) * 2.5);
        min-height: calc(var(--ws-svg-size, 33px) * 2.5);

        border: 2px solid#333;
        background-color: transparent;

        cursor: pointer;
      }
      button svg {
        width: var(--ws-svg-size, 33px);
        height: var(--ws-svg-size, 33px);
      }
      button:disabled {
        background-color: #333;
      }
      button:disabled svg {
        fill: whitesmoke;
      }
      .container {
        width: 600px;
        min-width: 200px;
        height: 80px;
      }
      .error {
        color: red;
      }
    `
  }

  #autoTiming
  static get properties () {
    return {
      url: String,
      protocols: String,
      message: String,
      noui: Boolean,
      error: String,
      wsStatus: String,
      auto: Boolean
    }
  }

  constructor () {
    super()
    this.wsStatus = 'Not Connected'
    this.noui = false
    this.auto = false
  }

  connectedCallback () {
    super.connectedCallback()
    // this.#createWebSocket() create WebSocket at start
  }

  disconnectedCallback () {
    // remove the setInterval
    clearInterval(this.#autoTiming)
    super.disconnectedCallback()
  }

  updated (changed) {
    // listening changes in url and protocols
    if (changed.has('url') || changed.has('protocols')) {
      if (this.#ws) this.#ws.close()
    }
    // listen for auto attribute
    if (changed.has('auto')) {
      // auto connect to websocket forever
      if (this.hasAttribute('auto')) {
        this.#createWebSocket()
        this.#autoTiming = setInterval(() => {
          if (!this.#ws) {
            this.#createWebSocket()
          }
        }, 10000)
      }
    }
    // listent for no auto attribute
    if (!this.hasAttribute('auto')) {
      clearInterval(this.#autoTiming)
    } else {
      this.auto = true
    }
    // listening for no user interface noui
    if (this.hasAttribute('noui')) {
      this.noui = true
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
    this.#closeWs()
    this.#helperStatus()
    this.message = ''
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
    if (this.#ws) {
      this.#ws.close()
      this.#ws = null
    }
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
        this.wsStatus = 'Not Connected'
    }
  }

  #toggleAuto () {
    // if (this.classList.contains('auto')) {}
    this.auto = !this.auto
  }

  uiTemplate () {
    return html`
      <div class="content">
        <p>${this.wsStatus} to ${this.url} </p>
        <!-- Open the ws connection -->
        <button
          title="Connect WebSocket"
          ?disabled=${this.#ws}
          @click=${this.#openWs}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/>
          </svg>
        </button>
        <!-- Close the ws connection -->
        <button
          title="Disconnect WebSocket"
          ?disabled=${!this.#ws}
          @click=${this.#closeWs}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </button>
        <!-- Autoconnection mode -->
        <button
          title="Autoconnection Mode"
          ?disabled=${this.auto}
          @click=${this.#toggleAuto}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
          </svg>
        </button>
        <!-- Msg contanitor -->
        <div class="container">
          <p class="msg">${this.message}</p>
          <p class="error">${this.error}</p>
        </div>
        <hr>
        <p>Send msg to ${this.url} </p>
        <textarea rows="11" cols="50"></textarea>
        <br>
        <button
          title="Send Message"
          @click=${this.#sendMsg}
          ?disabled=${!this.#ws}
          style="margin-top: 1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/>
          </svg>
        </button>
      </div>
    `
  }

  render () {
    return html`
      ${this.noui
        ? html``
        : this.uiTemplate()
      }
    `
  }
}

customElements.define('web-socket', WebSocket)
