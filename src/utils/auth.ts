import Taro from '@tarojs/taro'
import WXAPI from 'apifm-wxapi'

async function checkSession(){
  return new Promise((resolve, reject) => {
    Taro.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = Taro.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    Taro.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    Taro.removeStorageSync('token')
    return false
  }
  return true
}

async function login(){
  Taro.login({
    success: function (res) {
      WXAPI.login_wx(res.code).then(function (res) {
        if (res.code == 10000) {
          // 去注册
          //_this.register(page)
          return;
        }
        if (res.code != 0) {
          // 登录错误
          Taro.showModal({
            title: '无法登录',
            content: res.msg,
            showCancel: false
          })
          return;
        }
        Taro.setStorageSync('token', res.data.token)
        Taro.setStorageSync('uid', res.data.uid)
       // TODO pageonshow？
        // if ( page ) {
        //   page.onShow()
        // }
      })
    }
  })
}

async function register(page) {
  let _this = this;
  Taro.login({
    success: function (res) {
      let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
      Taro.getUserInfo({
        success: function (res) {
          let iv = res.iv;
          let encryptedData = res.encryptedData;
          let referrer = '' // 推荐人
          let referrer_storge = Taro.getStorageSync('referrer');
          if (referrer_storge) {
            referrer = referrer_storge;
          }
          // 下面开始调用注册接口
          WXAPI.register_complex({
            code: code,
            encryptedData: encryptedData,
            iv: iv,
            referrer: referrer
          }).then(function (res) {
            _this.login(page);
          })
        }
      })
    }
  })
}

function loginOut(){
  Taro.removeStorageSync('token')
  Taro.removeStorageSync('uid')
}

async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          Taro.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   Taro.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              Taro.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  Taro.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })
}


export default {
  checkHasLogined: checkHasLogined,
  login: login,
  register: register,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize
}
