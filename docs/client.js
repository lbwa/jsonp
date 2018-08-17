const $ = document.getElementsByClassName.bind(document)
const c = document.createElement.bind(document)
const js = JSON.stringify.bind(JSON)

const app = $('card-body')[0]
const form = $('form-group')[0]
const jsonpBtn = $('normal')[0]
const wrongRequestBtn = $('404')[0]
const wrongBtn = $('500')[0]

function isError (target) {
  return Object.prototype.toString.call(target) === '[object Error]'
}

function logger (data) {
  const isErr = isError(data)
  const log = isErr ? console.error : console.log
  log('Response data :', data)
  const dataString = isErr ? data : js(data)

  const target = c('p')

  target.classList.add('alert')
  target.setAttribute('role', 'alert')
  if (isErr) {
    target.innerText = `Request unsuccessfully, Response is ==>"${dataString}"<==`
  } else {
    target.innerText = `Request successfully, Response is ==>"${dataString}" by JSON.stringify(data)<==`
  }
  const className = isErr ? 'alert-danger' : 'alert-success'
  target.classList.add(className)

  app.appendChild(target)
}

function generateInstance (options) {
  /* eslint-disable no-undef */
  jsonp({
    ...options,
    jsonpCallback: options.jsonpCallback || 'callback'
  })
    .then(data => logger(data))
    .catch(err => logger(err))
}

function formatData () {
  const url = $('request-url')[0].value
  return { url }
}

function sendForm () {
  generateInstance(formatData())
}

form.addEventListener('submit', evt => {
  form.classList.add('was-validated')
  sendForm()
  evt.preventDefault()
})

jsonpBtn.addEventListener('click', () => {
  sendForm()
})

wrongRequestBtn.addEventListener('click', () => {
  generateInstance({
    url: '/404',
    urlParams: {
      key1: 1,
      key2: 2
    }
  })
})

wrongBtn.addEventListener('click', () => {
  generateInstance({
    url: '/500',
    urlParams: {
      key3: 3,
      key4: 4
    }
  })
})
