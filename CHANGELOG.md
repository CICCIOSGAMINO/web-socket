# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [7.0.0] - 10-08-2023

### Changed
  - improve stability
  - auto - willUpdate
  - major / minor updates
  - update the getWebSocket / passWebSocket methods

### Add
  - debug flag to trigger all console.log messages
  - this.error with more error messages

## [6.3.0] - 23-06-2022

### Changed
  - Minor fix in the examples, README.md

## [6.2.0] - 22-04-2022

### Changed
  - TODO this.ws = null when a bad url value is received


## [6.1.0] - 22-04-2022

### Changed
  - Fix auto connect functionality when the url attribute changes

## [6.0.0] - 21-04-2022

### Changed
  - web-socket check the url presence before try to create a new WebSockets

## [5.3.0] - 11-04-2022

### Changed
  - web-socket.js connection (null always set before create new connection)

## [5.2.0] - 06-12-2021

### Changed
	- Url in UI retrieved from WebSocket
	- Update the wsStatus when passWebSocket() is called
	- UI is controlled with this.connected Boolean

### Add
	- Handle not valid JSON When JSON checkbox is true

## [5.0.1] - 06-12-2021

### Add
	- getWebSocket () method to get back the WebSocket object from WebComponent

## [5.0.0] - 06-12-2021

### Add
	- Now you can pass the WebSocket object when creating the WebComponent
		Check the examples

## [4.1.0] - 03-12-2021

### Changed
	- Fix the layout grid bug into the web-socket

## [4.0.0] - 02-12-2021
### Changed
	- New responsive layout based on grid
	- Fix message box vertical scroll
	- Clear button only clean error / messages box

### Add
	- JSON prettify checkbox

## [3.3.1] - 16-11-2021
### Changed
  - CSS overflow property of message content

## [3.3.0] - 15-11-2021
### Changed
  - More flexibility on height size of all widget

## [3.2.1] - 08-11-2021
  - Minor fix
  - CSS svg fill

## [3.2.0] - 05-11-2021
### Changed
  - Better responsive
  - Minor Fix

### Add
  - Color scheme light / dark compatible with custom var
  - Clean input box when message sent
  - button:active style for sent button

## [3.1.0] - 05-11-2021
### Changed
  - Responsive screen height CSS property to do not grow bigger than screen

## [3.0.0] - 05-11-2021
### Changed
  - attribute noui become ui
  - Code refactoring, properties, attributes, methods
  - clearTimeout bug fixed

### Remove
  - attribute noui

### Add
  - dispatch a CustomEvent 'ws-message' with message received from ws
  - dispatch a CustomEvent 'ws-status'  when the status of ws changes
  - dispatch a CustomEvent 'ws-error' when an error is collected
  - connect() method to connect the ws to url defined into attribute
  - disconnect() method to disconnect the ws
  - sendMsg(msg) method to send message down the ws

## [2.1.0] - 04-08-2021
### Changed
  - auto setInterval / clearInterval bug fix

## [2.0.0] - 02-08-2021
### Added
  - noui attribute - No User interface
  - auto attribute - Automatic connection every 10s

### Changed
  - New User Interface

## [1.0.0] - 07-07-2021
### Added
  - Init the Element  [@cicciosgamino](https://github.com/CICCIOSGAMINO).