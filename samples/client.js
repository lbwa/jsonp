import jsonp from './jsonp.js'

const $ = document.getElementsByClassName.bind(document)
const $$ = document.getElementById.bind(document)

const app = $$('app')
const jsonpBtn = $('btn')[0]
const wrongRequestBtn = $('404')[0]
const wrongBtn = $('500')[0]
const url = $('input-box')[0].value

function fn (data) {
  console.log('Response data :', data)

  const target = document.createElement('p')
  target.innerText = JSON.stringify(data)
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
  }).then(data => fn(data))
    .catch(err => console.error(err))
}

jsonpBtn.addEventListener('click', () => {
  generateInstance(url)
})

wrongRequestBtn.addEventListener('click', () => {
  generateInstance('/wrong-request')
})

wrongBtn.addEventListener('click', () => {
  generateInstance('/wrong')
})
