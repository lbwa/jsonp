const http = require('http')
const fs = require('fs')
const zlib = require('zlib')
const chalk = require('chalk')

const log = console.log
const PORT = 8899

const server = http.createServer((request, response) => {
  log(chalk.yellow(`Request url is ${chalk.green(request.url)}`))

  // 以运行 node samples/server.js 的路径为基路径，而不是 server.js 所在路径
  const html = fs.readFileSync('samples/test-page.html')
  const client = fs.readFileSync('samples/client.js')
  const jsonp = fs.readFileSync('lib/index.js')
  const utils = fs.readFileSync('lib/utils/index.js')

  switch (request.url) {
    case '/':
      response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Encoding': 'gzip'
      })
      response.end(zlib.gzipSync(html))
      break

    case '/client.js':
      response.writeHead(200, {
        'Content-Type': 'application/javascript',
        'Content-Encoding': 'gzip'
      })
      response.end(zlib.gzipSync(client))
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
      break
  }
})

server.listen(PORT)

log(chalk.yellow(`Server listening at port ${chalk.green(PORT)}`))
