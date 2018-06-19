import jsonp from './jsonp.js'

const body = document.body
const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

function fn (data) {
  console.log('data :', data)

  const target = document.createElement('p')
  target.innerText = JSON.stringify(data)
  body.insertBefore(target, body.lastElementChild)
}

document.getElementsByClassName('btn')[0].addEventListener('click', () => {
  jsonp({
    url,
    jsonpCallback: 'jp',
    callbackParams: 'jsonpCallback',
    urlParams: {
      platform: 'yqq',
      needNewCode: 0
    }
  }).then(data => fn(data))
    .catch(err => console.error(err))
})
