import { LitElement, html, css } from 'lit'
import '../web-socket'

class AppShell extends LitElement {
	static get styles () {
		return css`
      :host {
        display: grid;
				grid-template-columns: 1fr 1fr;
      	justify-content: stretch;
				align-items: center;

				text-align: center;
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

	handleMessage (event) {
		console.log(`@MSG >> ${event.detail.message}`)
	}

	handleStatus (event) {
		// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
		console.log(`@STATUS >> ${event.detail.message}`)
	}

	handleError (event) {
		console.log(`@ERROR >> ${event.detail.message}`)
	}

	render () {
		return html`
			<h2>WebSocket - Console >> </h2>
      <web-socket
        url="ws://127.0.0.1:8888"
        ui
        @ws-message=${this.handleMessage}
        @ws-status=${this.handleStatus}
				@ws-error=${this.handleError}>
      </web-socket>
    `
	}
}

customElements.define('app-shell', AppShell)
