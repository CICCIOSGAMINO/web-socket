![GitHub issues](https://img.shields.io/github/issues/CICCIOSGAMINO/web-socket)
[![npm version](https://badgen.net/npm/v/@cicciosgamino/progress-ring)](https://www.npmjs.com/package/@cicciosgamino/web-socket)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/cicciosgamino/web-socket)

# 🍔 \<web-socket\>

Simple debug WebSocket CustomElement 🍔!

<p align="center">
  <a href="#examples">examples</a> •
  <a href="#usage">usage</a> •
  <a href="#api">api</a> •
  <a href="#accessibility">accessibility</a> •
  <a href="#todo">TODO</a> •
</p>

## Examples

```html
<web-socket></web-socket>
```

## 🚀 Usage

1. Install package
```bash
npm install --save @cicciosgamino/web-socket
```

2. Import
```html
<!-- Import Js Module -->
<script type="module">
  // Importing this module registers <progress-ring> as an element that you
  // can use in this page.
  //
  // Note this import is a bare module specifier, so it must be converted
  // to a path using a server such as @web/dev-server.
  import '@cicciosgamino/web-socket'
</script>
```

3. Place in your HTML
```html
<web-socket url=""></web-socket>
```

## 🐝 API

### 📒 Properties/Attributes

| Name | Type | Default | Description
| ------------- | ------------- | ------------ | --------------
| title    | String | `''` | Brief string to place inside the progress ring component space

### Methods
*None*

### Events
*None*

### 🧁 CSS Custom Properties

| Name | Default | Description
| -------------------------- | ----------- | --------------------
| `--progress-from-bottom`   |    `10%`    | Absolute positioning the progress number from bottom

### 🤖 Write HTML and JavaScript
Import the component's JavaScript module, use the component in your HTML, and control it with JavaScript, just like you would with a built-in element such as `<button>`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My Example App</title>

    <!-- Add support for Web Components to older browsers. -->
    <script src="./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>

  </head>
  <body>
    <!-- Use Web Components in your HTML like regular built-in elements. -->
    <web-socket url=""></web-socket>

    <!-- The Material Web Components use standard JavaScript modules. -->
    <script type="module">

      // Importing this module registers <progress-ring> as an element that you
      // can use in this page.
      //
      // Note this import is a bare module specifier, so it must be converted
      // to a path using a server such as @web/dev-server.
      import '@cicciosgamino/web-socket'

      // Standard DOM APIs work with Web Components just like they do for
      // built-in elements.
      const ws = document.querySelector('web-socket')
    </script>
  </body>
</html>
```

### 🚀 Serve
Serve your HTML with any server or build process that supports bare module specifier resolution (see next section):
```bash
# use globally instelled
npm install -g @web/dev-server

# install the project dev-dependencies and npm run
npm install
npm run serve
```

## Contributing

Got **something interesting** you'd like to **share**? Learn about [contributing](https://github.com/CICCIOSGAMINO/init/blob/master/CONTRIBUTING.md).

# Accessibility
TODO

# 🔧 TODO 
- [ ] Basic Unit testing

## CSS encapsulation
The elements HTML structure is initialized in a [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), so it is impossible to apply CSS to it. If you need to change the element's default style for any reason, you should open up a new issue (or a pull request!), describing your use case, and we'll work with you on solving the problem.

## Browser support

Browsers without native [custom element support][support] require a [polyfill][]. Legacy browsers require various other polyfills. See [`examples/index.html`][example] for details.

- Chrome
- Firefox
- Safari
- Microsoft Edge

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements


## Author

| [![@cicciosgamino](https://raw.githubusercontent.com/CICCIOSGAMINO/cicciosgamino.github.io/master/images/justme%40412x412_round.png)](https://linkedin.com/in/) 	|
|:------------------------------------------------------------------------------------------:	|
|                                    **@cicciosgamino**                                      	|

## Support
Reach out to me at one of the following places:

- [Github](https://github.com/CICCIOSGAMINO)
- [Twitter](https://twitter.com/cicciosgamino)

## Donate

Donate help and contibutions!

# License
[GNU General Public License v3.0](https://github.com/CICCIOSGAMINO/init/blob/master/LICENSE)

Made 🧑‍💻 by [@cicciosgamino](https://cicciosgamino.web.app)