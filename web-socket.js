import { LitElement, html, css } from 'lit'

// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

class WebSocket extends LitElement {
  static get styles () {
    return css`
      * {
        /*
          --text-size: 1.7rem;
          --ws-svg-size: 24px;
          --text1:
          --text2:
          --surface1:
          --surface2:
          */
      }

      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        gap: 1rem;
        font-size: var(--text-size, 1.7rem);
      }

      p {
        /* font-size: 1.7rem; */
        color: var(--text1, #333);
      }

      button {
        display: inline-block;
        line-height: calc(var(--ws-svg-size, 24px) * 0.5);

        min-width: calc(var(--ws-svg-size, 24px) * 2);
        min-height: calc(var(--ws-svg-size, 24px) * 2);

        border: 2px solid var(--text1, #333);
        border-radius: 50%;
        background-color: transparent;

        cursor: pointer;
      }

      button svg {
        width: var(--ws-svg-size, 24px);
        height: var(--ws-svg-size, 24px);
        fill: var(--text1, #333);
      }

      button:disabled {
        background-color: var(--text1, #333);
        cursor: none;
        cursor: not-allowed;
      }

      button:disabled svg {
        fill: var(--surface1, whitesmoke);
      }

      button:hover:disabled {
        border: 2px solid var(--text1, #333);
      }

      button:hover:disabled svg {
        fill: var(--surface1, whitesmoke);
      }

      button:active {
        background-color: var(--surface2, purple);
      }

      .container {
        min-width: 100%;
        max-width: 500px;
        flex-grow: 3;
        align-self: flex-start;

        font-size: calc(var(--text-size, 1.7rem) * 0.8);
        text-align: left;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .container p {
        text-overflow: ellipsis;
        /* overflow: hidden; */
        white-space: nowrap;
      }

      .input-container {
        position: relative;
      }

      input[type=text] {
        margin-top: 1rem;

        width: 100%;
        min-height: calc(var(--ws-svg-size, 24px) * 2.4);

        border: none;
        border-bottom: 2px solid var(--text1, #333);
      }

      label[for="message"] {
        /* visibility: hidden; */
      }

      #message {
        font-size: var(--text-size, 1.7rem);
      }

      #sent-btn {
        border-radius: 0;
        border-bottom: none;
        border-top: none;

        position: absolute;
        right: 0;
        bottom: 0.7rem;
      }

      #sent-btn svg {
        width: calc(var(--ws-svg-size, 24px) * 0.9);
        height: calc(var(--ws-svg-size, 24px) * 0.9);
      }

      .error {
        text-align: center;
        min-height: 2.3rem;
        color: red;
      }
    `
  }

  static get properties () {
    return {
      url: String,
      protocols: String,
      ui: {
        type: Boolean
      },
      auto: {
        type: Boolean,
        reflect: true
      },
      wsStatus: String,
      error: String
    }
  }

  constructor () {
    super()
    this.error = ''
    this.wsStatus = 'Not Connected'
  }

  connectedCallback () {
    super.connectedCallback()
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    clearInterval(this._timerInterval)
  }

  attributeChangedCallback (name, oldVal, newVal) {
    // trigger auto attribute
    if (name === 'auto' && this.hasAttribute('auto')) {
      this.connect()
      this._timerInterval = setInterval(() => {
        if (!this.ws) {
          this.connect()
        }
      }, 10000)
    }
    // removed auto attribute
    if (name === 'auto' && !this.hasAttribute('auto')) {
      this._stopLoop()
    }
    super.attributeChangedCallback(name, oldVal, newVal)
  }

  connect () {
    if (this.ws) {
      return
    }
    try {
      this.ws = new window.WebSocket(this.url, this.protocols)
      // bind WebSocket events to component events
      this.ws.addEventListener('open', this._onOpen.bind(this))
      this.ws.addEventListener('close', this._onClose.bind(this))
      this.ws.addEventListener('message', this._onMessage.bind(this))
      this.ws.addEventListener('error', this._onError.bind(this))
    } catch (error) {
      // console.log(`@ERROR >> ${error}`)
      this.error = error
      this._dispatchMsg('ws-error', error)
    }
  }

  _onOpen (event) {
    // console.log('@WS >> onOpen')
    this._updateWsStatus()
  }

  _onClose (event) {
    // console.log('@WS >> onClose')
    this._updateWsStatus()
  }

  _onMessage (event) {
    // console.log(`@MSG >> ${event.data}`)
    this.error = ''
    if (this.ui) {
      this._appendMsgToContainer(event.data)
    }
    this._dispatchMsg('ws-message', event.data)
  }

  _onError (event) {
    // console.log(`@WS >> onError ${event}`)
    this.error = `Connection to ${this.url} FAILED`
    this._updateWsStatus()
    this._dispatchMsg('ws-error', event)
  }

  openWs () {
    this.connect()
  }

  disconnect () {
    this.auto = false
    this.error = ''
    this._stopLoop()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  _toggleAuto () {
    this.auto = !this.auto
  }

  _stopLoop () {
    clearInterval(this._timerInterval)
  }

  sendMsg (msg) {
    if (this.ws) {
      this.ws.send(msg)
    }
  }

  // ship message to the WebSocket server
  _sendMsg () {
    const msg = this.shadowRoot.querySelector('#message')?.value
    if (this.ws && this.ws.readyState === OPEN) {
      // console.log(`@WS SEND >> ${msg}`)
      this.ws.send(msg)
      // clean the input box
      this.renderRoot.querySelector('#message').value = ''
    }
  }

  _updateWsStatus () {
    switch (this.ws?.readyState) {
      case CONNECTING:
        this.wsStatus = 'Connecting '
        break
      case OPEN:
        this.wsStatus = 'Connected'
        break
      case CLOSING:
        this.wsStatus = 'Closing '
        break
      case CLOSED:
        this.wsStatus = 'Close'
        break
      default:
        this.wsStatus = 'Not Connected'
    }

    this._dispatchMsg(
      'ws-status',
      this.ws?.readyState
    )
  }

  _dispatchMsg (eventName, msg) {
    const ce = new CustomEvent(
      eventName,
      {
        detail: { message: msg },
        bubbles: true,
        composed: true,
        cancelable: true
      })
    this.dispatchEvent(ce)
  }

  _appendMsgToContainer (msg) {
    const li = document.createElement('li')
    li.innerText = msg
    this.renderRoot.querySelector('#logs')
      .appendChild(li)
  }

  _clean () {
    this.error = ''
    this.wsStatus = ''
    this.ws = null

    this.renderRoot.querySelector('#message')
      .value = ''
    this.renderRoot.querySelector('#logs')
      .innerHTML = ''
  }

  _uiTemplate () {
    return html`  
        <p>${this.wsStatus} ${this.url} </p>

        <div class="buttons">
          <!-- Open the ws connection -->
          <button
            title="Connect WebSocket"
            ?disabled=${this.ws}
            @click=${this.openWs}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/>
            </svg>
          </button>
          <!-- Close the ws connection -->
          <button
            title="Close WebSocket"
            ?disabled=${!this.ws}
            @click=${this.disconnect}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </button>
          <!-- Autoconnection mode -->
          <button
            title="Autoconnect"
            ?disabled=${this.auto}
            @click=${this._toggleAuto}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
            </svg>
          </button>
          <!-- Clean -->
          <button
            title="Clean"
            @click=${this._clean}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <rect fill="none" height="24" width="24"/>
              <path d="M7.06,8.94L5,8l2.06-0.94L8,5l0.94,2.06L11,8L8.94,8.94L8,11L7.06,8.94z M8,21l0.94-2.06L11,18l-2.06-0.94L8,15l-0.94,2.06 L5,18l2.06,0.94L8,21z M4.37,12.37L3,13l1.37,0.63L5,15l0.63-1.37L7,13l-1.37-0.63L5,11L4.37,12.37z M12,12c0-3.09,1.38-5.94,3.44-8 L12,4V2h7v7h-2l0-3.72c-1.8,1.74-3,4.2-3,6.72c0,3.32,2.1,6.36,5,7.82L19,22C14.91,20.41,12,16.35,12,12z"/>
            </svg>
          </button>
        </div>

        <!-- Msg contanitor -->
        <div class="container">
          <p class="error">${this.error}</p> 
          <ul id="logs">
          </ul>
        </div>

        <div class="input-container">
          <label for="message">
            Send msg to ${this.url}
          </label>
          <input id="message" name="message" type="text"
            placeholder="Insert here ...">

          <button
            id="sent-btn"
            title="Send Message"
            @click=${this._sendMsg}
            ?disabled=${!this.ws}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/>
            </svg>
          </button>

        </div>
      
      </div>
    `
  }

  render () {
    return html`
      ${this.ui
        ? this._uiTemplate()
        : html``}
    `
  }
}

customElements.define('web-socket', WebSocket)
