import { LitElement, html, css } from 'lit'
import '../web-socket'

const WS_STATUS_MSG = [
	'CONNECTING',
	'OPEN',
	'CLOSING',
	'CLOSED'
]

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

	connectedCallback () {
		super.connectedCallback()

		// scenario - get active ws from ws-one and pass to ws-two
		setTimeout(() => {
			this.#initSocket()
			console.log(`ws-two >> @INIT`)
		}, 7000)

		// scenario - update the url of ws-one
		// setTimeout(() => {
			
		// 	const wsUrl = 'ws://127.0.0.1:9999'
		// 	this.renderRoot.getElementById('ws-one')
		// 		.setAttribute('url', wsUrl)

		// 	console.log(`ws-one >> @URL-UPDATED ${wsUrl}`)
			
		// }, 11000)

		// console the ws object & set a global variable window.websocket
		// setTimeout(() => {
		// 	const ws = this.renderRoot.querySelector('web-socket').getWebSocket()
		// 	console.log('@SOCKET1 >>')
		// 	console.log(ws)
		// }, 15000)

		// console the global window.websocket
		// setTimeout(() => {
		// 	console.log('@WINDOW.websocket')
		// 	console.log(window.websocket)
		// }, 12000)
		
	}

	handleMessage (e) {
		console.log(
			`${e.target.id} @MSG >> ${e.detail.message}`)
	}

	handleStatus (e) {
		// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
		console.log(
			`${e.target.id} @STATUS >> ${WS_STATUS_MSG[parseInt(e.detail.message)]}`)
	}

	handleError (e) {
		console.log(
			`${e.target.id} @ERROR >> ${JSON.stringify(e.detail.message)}`)
	}

	#updateUrl () {
		const wsUrl = 'ws://127.0.0.1:9999'
		this.renderRoot.getElementById('ws-one')
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
		// this.renderRoot.querySelector('#ws-two')
		// 	.setAttribute('url','ws://127.0.0.1:8888')
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
