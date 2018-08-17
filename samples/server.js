const http = require('http')
const fs = require('fs')
const zlib = require('zlib')
const chalk = require('chalk')
const execa = require('execa')

const log = console.log
const PORT = 8899

function sendData (statusCode, type, body, res) {
  res.writeHead(statusCode, {
    'Content-type': `${type}`,
    'Content-Encoding': 'gzip'
  })
  const response = body ? zlib.gzipSync(body) : ''
  res.end(response)
}

(async function build () {
  await execa('yarn', ['run', 'build', '--watch'], { stdio: 'inherit' })
})()

const server = http.createServer((req, res) => {
  log(chalk.yellow(`Request url is ${chalk.green(req.url)}`))

  // 以运行 node samples/server.js 的路径为基路径，而不是 server.js 所在路径
  const html = fs.readFileSync('samples/dev-page.html')
  const jsonp = fs.readFileSync('dist/better-jsonp.min.js')
  const client = fs.readFileSync('samples/client.js')
  const defaultCallback = `jsonpCallback({data: 'Yep! JSONP request Successful!'})`

  switch (true) {
    case /^\/$/.test(req.url):
      sendData(200, 'text/html', html, res)
      break

    case /better-jsonp/.test(req.url):
      sendData(200, 'application/javascript', jsonp, res)
      break

    case /\/client/.test(req.url):
      sendData(200, 'application/javascript', client, res)
      break

    case /\/normal/.test(req.url):
      sendData(200, 'application/javascript', defaultCallback, res)
      break

    case /\/500/.test(req.url):
      sendData(500, 'text/html', null, res)
      break

    default:
      sendData(404, 'text/html', null, res)
      break
  }
})

server.listen(PORT)

log(chalk.yellow(`Server listening at port http://localhost:${chalk.green(PORT)}`))
