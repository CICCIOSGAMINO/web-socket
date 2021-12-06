import { LitElement, html, css } from 'lit'
import '../web-socket'

class AppShell extends LitElement {
	static get styles () {
		return css`
      :host {
        display: grid;
				grid-template-columns: 1fr 1fr;
      }

      web-socket {
        --ws-svg-size: 21px;
        --text-size: 1.7rem;
        /*
        --text1: 
        --text2:
        --surface1:
        --surface2:
        */
        height: 95vh;
      }
    `
	}

	/*
	static get properties () {
		return {
			ws: Object
		}
	} */

	connectedCallback () {
		super.connectedCallback()
		setTimeout(() => {
			this.#initSocket()
			console.log('@TIMING CONNECTION >> ....')
		}, 5000)
	}

	handleMessage (e) {
		console.log(
			`@MSG ${e.target}>> ${e.detail.message}`)
	}

	handleStatus (e) {
		// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
		console.log(
			`@STATUS ${e.target}>> ${e.detail.message}`)
	}

	handleError (e) {
		console.log(
			`@ERROR ${e.target}>> ${e.detail.message}`)
	}

	#initSocket () {
		// create your WebSocket object with Javascript
		// const ws = new WebSocket('ws://127.0.0.1:8888')

		// Or get the WebSocket from the WebComponent
		const ws = this.renderRoot.querySelector('#ws-one')
			.getWebSocket()
		this.renderRoot.querySelector('#ws-two')
			.passWebSocket(ws)
	}

	render () {
		return html`

			<!-- Create WebSocket with the url -->
      <web-socket
				id="ws-one"
        url="ws://127.0.0.1:8888"
        ui
        @ws-message=${this.handleMessage}
        @ws-status=${this.handleStatus}
				@ws-error=${this.handleError}>
      </web-socket>


			<!-- Pass the WebSocket object with javascript -->
			<web-socket
				id="ws-two"
				ui
        @ws-message=${this.handleMessage}
        @ws-status=${this.handleStatus}
				@ws-error=${this.handleError}>
			</web-socket>
    `
	}
}

customElements.define('app-shell', AppShell)
