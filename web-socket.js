import { LitElement, html, css } from 'lit'

/* https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
WebSocket {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}	*/

class WS extends LitElement {
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
				display: grid;
				grid-template-rows: 1fr 5fr 1fr;
				justify-content: stretch;
				align-items: center;
				gap: 1rem;

        font-size: var(--text-size, 1.7rem);
				text-align: center;
			}

      p {
				margin: 0.3rem;
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

			#messages {
				width: 100%;
				height: 100%;

				font-size: calc(var(--text-size, 1.7rem) * 0.8);
        text-align: left;
        overflow-y: auto;
        /* overflow-x: hidden; */
			}

			#prettify {
				margin-left: 2.7rem;
			}

			#send {
				width: 100%;
			}

			#inputs {
				margin-top: 1rem;
				margin-left: 3rem;
				margin-right: 3rem;
				display: flex;
			}

      input[type=text] {
				/* width: 100%;  TODO */
        min-height: calc(var(--ws-svg-size, 24px) * 2.4);

        border: none;
        border-bottom: 2px solid var(--text1, #333);

				flex-grow: 2;
      }

      label[for="message"] {
        visibility: hidden;
      }

      #message {
        font-size: var(--text-size, 1.7rem);
      }

      #sent-btn {
        border-radius: 0;
        border-bottom: none;
				border-left: none;
        border-top: none;
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
			ws: Object,
			connected: Boolean,
			prettify: Boolean,
			wsStatus: String,
			error: String
		}
	}

	constructor () {
		super()
		this.error = ''
		this.prettify = false
		this.wsStatus = 'Not Connected'
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

	passWebSocket(ws) {
		this.ws = ws
		this._initListeners()
		this._updateWsStatus()
	}

	getWebSocket () {
		return this.ws
	}

	connect () {
		this.ws = null
		
		try {
			this.ws = new window.WebSocket(this.url, this.protocols)
			this._initListeners()
		} catch (error) {
			this.error = error
			this._dispatchMsg('ws-error', error)
		}
	}

	_initListeners () {
		if (this.ws) {
			// bind WebSocket events to component events
			this.ws.addEventListener('open', this._onOpen.bind(this))
			this.ws.addEventListener('close', this._onClose.bind(this))
			this.ws.addEventListener('message', this._onMessage.bind(this))
			this.ws.addEventListener('error', this._onError.bind(this))
		}
	}

	_onOpen () {
		this._updateWsStatus()
	}

	_onClose () {
		this._updateWsStatus()
	}

	_onMessage (event) {
		this._updateWsStatus()
		this.error = ''
		if (this.ui) {
			if (this.prettify) {
				try {
					const jsonObj = JSON.parse(event.data)
					this._appendMsgToContainer(
						JSON.stringify(jsonObj, undefined, 4))
				} catch(ex) {
					this._appendMsgToContainer(
						`@JSON-NOT-VALID >> ${event.data}`
					)
				}
				
			} else {
				this._appendMsgToContainer(event.data)
			}
		}
		this._dispatchMsg('ws-message', event.data)
	}

	_onError (event) {
		this.error = `Connection to ${this.url} FAILED`
		this._updateWsStatus()
		this._dispatchMsg('ws-error', event)
	}

	disconnect () {
		this.auto = false
		this.error = ''
		this._stopLoop()
		if (this.ws) {
			this.ws.close()
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
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(msg)
			// clean the input box
			this.renderRoot.querySelector('#message').value = ''
		}
	}

	_updateWsStatus () {
		switch (this.ws?.readyState) {
		case WebSocket.CONNECTING:
			this.wsStatus = 'Connecting'
			this.connected = false
			break
		case WebSocket.OPEN:
			this.wsStatus = 'Connected'
			this.connected = true
			break
		case WebSocket.CLOSING:
			this.wsStatus = 'Closing '
			this.connected = false
			break
		case WebSocket.CLOSED:
			this.wsStatus = 'Close'
			this.connected = false
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
		const list = this.renderRoot.querySelector('#logs')
		list.insertBefore(li, list.childNodes[0])
	}

	_clean () {
		this.error = ''
		this.wsStatus = ''

		this.renderRoot.querySelector('#message')
			.value = ''
		this.renderRoot.querySelector('#logs')
			.innerHTML = ''
	}

	_changePrettify (event) {
		this.prettify = event.target.checked
	}

	_uiTemplate () {
		return html`

        <div id="buttons">
					<!-- WebSocket status as Web/API/WebSocket state_constants -->
					<p>${this.wsStatus} ${this.ws?.url} </p>
					<p class="error">${this.error}</p> 

          <!-- Open the ws connection -->
          <button
            title="Connect WebSocket"
            ?disabled=${this.connected}
            @click=${this.connect}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/>
            </svg>
          </button>
          <!-- Close the ws connection -->
          <button
            title="Close WebSocket"
            ?disabled=${!this.connected}
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

        <!-- Error / Message container -->
        <div id="messages">

					<input type="checkbox" id="prettify" name="prettify" value="JSON Prettify"
						@change=${this._changePrettify}>
  				<label for="prettify">JSON Prettify</label><br>

          <ul id="logs">
          </ul>
        </div>

        <div id="send">
          <label for="message">
            Send msg to ${this.url}
          </label>
					<div id="inputs">
						<input id="message" name="message" type="text"
							placeholder="Send msg to ${this.url}">

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

customElements.define('web-socket', WS)
