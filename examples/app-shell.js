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

		// test - pass pass ws to other component
		setTimeout(() => {
			this.#initSocket()
			console.log('@TIMING CONNECTION >> ...')
		}, 5000)

		// update the url
		setTimeout(() => {
			this.#updateUrl()
			console.log('@UPDATE URL >> ...')
		}, 7000)

		// console the ws object & set a global variable window.websocket
		setTimeout(() => {
			const ws = this.renderRoot.querySelector('web-socket').getWebSocket()
			console.log('@WEB-SOCKET >> ...')
			console.log(ws)

			window.websocket = ws
		}, 10000)

		// console the global window.websocket
		setTimeout(() => {
			console.log('@WINDOW.websocket')
			console.log(window.websocket)
		}, 12000)
		
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

	#updateUrl () {
		const wsUrl = 'ws://127.0.0.1:9999'
		this.renderRoot.querySelector('web-socket')
			.setAttribute('url', wsUrl)
	}

	#initSocket () {
		// create your WebSocket object with Javascript
		// const ws = new WebSocket('ws://127.0.0.1:8888')

		// Or get the WebSocket from the WebComponent
		const ws = this.renderRoot.querySelector('#ws-one')
			.getWebSocket()
		// share the same WebSocket on both web-socket components
		this.renderRoot.querySelector('#ws-two')
			.passWebSocket(ws)

		// set the url too for future connections by button
		// reminder to set the url on the component if you want use the buttons
		this.renderRoot.querySelector('#ws-two')
			.setAttribute('url','ws://127.0.0.1:8888')
	}

	render () {
		return html`

			<!-- Create WebSocket with the url -->
      <web-socket
				id="ws-one"
        url="ws://127.0.0.1:8888"
        ui
				auto
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
