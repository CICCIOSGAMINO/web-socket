import { LitElement, html, css } from 'lit'
import '../web-socket'

class AppShell extends LitElement {
  static get styles () {
    return css`
      :host {
        display: block;
      }

      web-socket {
        --ws-svg-size: 31px;
      }
    `
  }

  _handleMsg (event) {
    console.log(`@MSG >> ${event.detail.message}`)
  }

  _handleStatus (event) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
    // const CONNECTING = 0
    // const OPEN = 1
    // const CLOSING = 2
    // const CLOSED = 3
    // undefined
    console.log(`@STATUS >> ${event.detail.message}`)
  }

  _handleError (event) {
    console.log(`@ERROR >> ${event.detail.message}`)
  }

  render () {
    return html`
      <web-socket
        url="ws://127.0.0.1:8888"
        ui
        @ws-message=${this._handleMsg}
        @ws-error=${this._handleError}
        @ws-status=${this._handleStatus}>
      </web-socket>
    `
  }
}

customElements.define('app-shell', AppShell)
