import { LitElement, html, css } from 'lit'

class WebSocket extends LitElement {
  #strokeDashoffset
  static get styles () {
    return css`
      :host {
        display: inline-block;
      }
    `
  }

  static get properties () {
    return {
      url: String
    }
  }

  constructor () {
    super()
    this.title = ''
  }

  connectedCallback () {
    super.connectedCallback()
    this.#normalizedRadius = this.radius - this.stroke
    this.#circumference = this.#normalizedRadius * 2 * Math.PI
    this.#strokeDasharray = `${this.#circumference} ${this.#circumference}`
    this.#strokeDashoffset = 
        this.#circumference - this.progress / 100 * this.#circumference
  }

  update (changed) {
    // handle the progress updated
    if (changed.has('progress')) {
      this.#strokeDashoffset = 
        this.#circumference - this.progress / 100 * this.#circumference
    }
    super.update()
  }

  render () {
    return html`
    <div class="content">

      <p class="title">${this.title}</p>
      <p class="progress">${this.progress}%</p>

  </div>
    `
  }
}

customElements.define('web-socket', WebSocket)
