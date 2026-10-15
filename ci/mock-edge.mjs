// CI transport fixture only: synthesis stays offline; RVC uses its existing HTTP mock.
import assert from 'node:assert/strict'

globalThis.WebSocket = class MockEdgeWebSocket {
  constructor(url) {
    assert.equal(new URL(url).hostname, 'speech.platform.bing.com')
    queueMicrotask(() => this.onopen?.())
  }
  send(message) {
    if (!message.includes('Path:ssml')) return
    queueMicrotask(() => {
      const mp3 = Buffer.alloc(2048, 1)
      mp3[0] = 0xff
      mp3[1] = 0xfb
      this.onmessage?.({ data: Buffer.concat([Buffer.from('Path:audio\r\n'), mp3]) })
      this.onmessage?.({ data: 'Path:turn.end' })
    })
  }
  close() {}
}
