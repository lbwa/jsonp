import jsonp from './jsonp.js'

const $ = document.getElementsByClassName.bind(document)
const $$ = document.getElementById.bind(document)
const c = document.createElement.bind(document)
const js = JSON.stringify.bind(JSON)

const app = $$('app')
const jsonpBtn = $('btn')[0]
const wrongRequestBtn = $('404')[0]
const wrongBtn = $('500')[0]

function logger (data, isErr) {
  const log = isErr ? console.error : console.log
  log('Response data :', data)

  const target = c('p')
  target.innerText = js(data)
  app.appendChild(target)
}

function generateInstance (url) {
  jsonp({
    url,
    jsonpCallback: 'jp',
    callbackParams: 'jsonpCallback',
    urlParams: {
      platform: 'desktop'
    }
  }).then(data => logger(data, false))
    .catch(err => logger(err, true))
}

jsonpBtn.addEventListener('click', () => {
  generateInstance($('input-box')[0].value)
})

wrongRequestBtn.addEventListener('click', () => {
  generateInstance('/wrong-request')
})

wrongBtn.addEventListener('click', () => {
  generateInstance('/wrong')
})
