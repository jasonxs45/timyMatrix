const ARR_TEXT = [
  {
    tag: 'dt',
    html: '1.目的'
  },
  {
    tag: 'dd',
    html: '为了加强公司安全管理，规范公司钥匙使用，特制定本制度。'
  },
  {
    tag: 'dt',
    html: '2.适用范围'
  },
  {
    tag: 'dd',
    html: '花园道写字楼5楼及11楼办公室。'
  },
  {
    tag: 'dt',
    html: '3.实施细则'
  },
  {
    tag: 'dd',
    html: `（1）公司钥匙管理本着“谁主管、谁负责”的原则，责任到人；|
（2）行政人事部负责公司钥匙的备存、登记、领发；|
（3）每天下班前行政会以群通知形式确认领用钥匙员工，员工找行政领取钥匙并点击页面【领取钥匙】按钮，确认领取；|
（4）员工领用钥匙后必须第一时间点击【领取钥匙】按钮，以做领取登记；|
（5）每日最后一位离开公司锁门的同事，于次日上班时将钥匙归还行政；|
（6）周末加班的同事请提前领取钥匙，并于工作日将钥匙归还行政；|
（7）未及时进行报备和归还钥匙，造成加班同事无法锁门的，将处50元现金罚款一次；|
（8）钥匙责任人以小程序中最新登记信息为主。`,
    multiple: true
  },
  {
    tag: 'dt',
    html: '4.办公室钥匙具体责任人：'
  },
  {
    tag: 'dd',
    html: `（1）5楼办公室|
   公共钥匙2把：供加班同事锁门用，每日必须及时做领取登记和归还|
   肖智元：1把（周末经常加班）|
   行政人事部：2把|
   多媒体办公室：1把（仅供每天早上开门使用，用完即还）|
   公司宿舍：2把（即食堂，紧急情况可以找石可可、肖修政领取）|
（2）11楼办公室|
   公共钥匙1把：供加班同事锁门用，每日必须及时做领取登记和归还|
   胡少阳：1把（长期加班）|
   公司宿舍：2把（即食堂，紧急情况可以找石可可、肖修政领取）|
   行政人事部：3把`,
    multiple: true
  },
  {
    tag: 'dt',
    html: '5.温馨提示'
  },
  {
    tag: 'dd',
    html: `（1）请领取钥匙的同时务必在第一时间进行登记和钥匙归还，以免造成加班同事无法锁门或第二天无法开门的现象；|
（2）每日最后一位离开公司的同事请关好办公室的门窗、空调、电扇；|
（3）钥匙责任人以小程序中最新登记信息为主，员工在交接钥匙时请在小程序上做好登记。`,
    multiple: true
  },
  {
    tag: 'dt',
    html: '6.本管理规定自发布之日起实施。'
  },
]
let node12 = []
for (let i = 0; i < ARR_TEXT.length; i++) {
  let child
  if (!ARR_TEXT[i].multiple) {
    child =
      {
        name: ARR_TEXT[i].tag,
        attrs: {
          class: ARR_TEXT[i].tag=='dt'?'sub-item-dt':'sub-item-dd'
        },
        children: [{
          type: 'text',
          text: ARR_TEXT[i].html
        }]
      }
    node12.push(child)
  } else {
    let subChild = []
    for (let j = 0; j < ARR_TEXT[i].html.split('|').length; j++) {
      let html = {
        name: 'p',
        children: [{
          type: 'text',
          text: `${ARR_TEXT[i].html.split('|')[j]}`
        }
        ]
      }
      subChild.push(html)
    }
    child =
      {
        name: ARR_TEXT[i].tag,
        attrs: {
          class: ARR_TEXT[i].tag == 'dt' ? 'sub-item-dt' : 'sub-item-dd'
        },
        children: subChild
      }
    node12.push(child)
  }
}
const nodes = [{
  name: 'div',
  attrs: {
    class: 'rule-wrapper'
  },
  children: [
    {
      name: 'h2',
      attrs: {
        class: 'rule-title'
      },
      children: [{
        type: 'text',
        text: '规则说明'
      }]
    },
    ...node12
  ]
}]
export {
  nodes
}