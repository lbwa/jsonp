const http = require('http')
const fs = require('fs')
const zlib = require('zlib')
const debug = require('signale')

const PORT = 8899

const server = http.createServer((request, response) => {
  debug.debug(`Request url is ${request.url}`)

  const html = fs.readFileSync('./dist/test-page.html')
  const jsonp = fs.readFileSync('index.js')
  const js = fs.readFileSync('./dist/data.js')

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
    
    case '/data.js':
      response.writeHead(200, {
        'Content-Type': 'application/javascript',
        'Content-Encoding': 'gzip'
      })
      response.end(zlib.gzipSync(js))
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