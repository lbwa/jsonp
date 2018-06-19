import Jsonp from './index.js'

const body = document.body
const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

function fn (data) {
  console.log('data :', data)

  const target = document.createElement('p')
  target.innerText = JSON.stringify(data)
  body.insertBefore(target, body.lastElementChild)
}

document.getElementsByClassName('btn')[0].addEventListener('click', () => {
  const jsonp = new Jsonp({
    url,
    callbackName: 'jp',
    callbackParams: 'jsonpCallback',
    urlParams: {
      platform: 'yqq',
      needNewCode: 0
    },
    callback: fn
  })
  console.log('jsonp instance: ', jsonp)
})
