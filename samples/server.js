const http = require('http')
const fs = require('fs')
const zlib = require('zlib')
const debug = require('signale')

const PORT = 8899

const server = http.createServer((request, response) => {
  debug.success(`Request url is ${request.url}`)

  // 以运行 node samples/server.js 的路径为基路径，而不是 server.js 所在路径
  const html = fs.readFileSync('samples/test-page.html')
  const jsonp = fs.readFileSync('dist/better-jsonp.js')
  const utils = fs.readFileSync('lib/utils/index.js')

  switch (request.url) {
    case '/':
      response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Encoding': 'gzip'
      })
      response.end(zlib.gzipSync(html))
      break
    
    case '/index.js':
    response.writeHead(200, {
      'Content-Type': 'application/javascript',
      'Content-Encoding': 'gzip'
    })
    response.end(zlib.gzipSync(jsonp))
    break

    case '/utils/index.js':
    response.writeHead(200, {
      'Content-Type': 'application/javascript',
      'Content-Encoding': 'gzip'
    })
    response.end(zlib.gzipSync(utils))
    break

    case '/utils':
    response.writeHead(200, {
      'Content-Type': 'application/javascript',
      'Content-Encoding': 'gzip'
    })
    response.end(zlib.gzipSync(utils))
    break
    
    case '/data.js':
      response.writeHead(200, {
        'Content-Type': 'application/javascript',
        'Content-Encoding': 'gzip'
      })
      response.end(zlib.gzipSync('jsonpCallback({num: 1000})'))
      break
  
    default:
      response.writeHead(404, {
        'Content-Type': 'text/html',
        'Content-Encoding': 'gzip'
      })
      response.end()
      break;
  }
})

server.listen(PORT)

debug.watch(`Server listening at port ${PORT}`)