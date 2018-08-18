const $ = document.querySelector.bind(document)
const c = document.createElement.bind(document)
const js = JSON.stringify.bind(JSON)

const app = $('.card-body')
const form = $('.form-group')
const jsonpBtn = $('.normal')
const wrongRequestBtn = $('.not-found')

function isError (target) {
  return Object.prototype.toString.call(target) === '[object Error]'
}

function logger (data) {
  const isErr = isError(data)
  const log = isErr ? console.error : console.log
  log('[Response data]:', data)
  const dataString = isErr ? data : js(data)

  const target = c('p')

  target.classList.add('alert')
  target.setAttribute('role', 'alert')

  target.innerHTML = isErr
    ? `Handle error, <strong>"${dataString}"</strong>`
    : `Request <strong>successfully</strong>, Response is <strong>${dataString} </strong>`

  const className = isErr ? 'alert-danger' : 'alert-success'
  target.classList.add(className)

  app.appendChild(target)
}

function generateInstance (options) {
  /* eslint-disable no-undef */
  jsonp({
    ...options,
    jsonpCallback: options.jsonpCallback
  })
    .then(data => logger(data))
    .catch(err => logger(err))
}

function formatData () {
  const url = $('#request-url').value
  const timeout = $('#timeout').value
  const jsonpCallback = $('#jsonp-callback').value === 'jsonp'
    ? 'jsonpCallback'
    : $('#jsonp-callback').value
  const callbackParams = $('#callback-params').value
  return {
    url,
    timeout,
    jsonpCallback,
    callbackParams,
    urlParams: {
      urlParams1: 'value 1',
      urlParams2: 'value 2'
    }
  }
}

form.addEventListener('submit', evt => {
  form.classList.add('was-validated')
  generateInstance(formatData())
  evt.preventDefault()
})

jsonpBtn.addEventListener('click', () => {
  generateInstance(formatData())
})

wrongRequestBtn.addEventListener('click', () => {
  generateInstance({
    url: '/404'
  })
})
