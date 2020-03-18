import Taro, {Component, Config} from '@tarojs/taro'
import {Provider} from '@tarojs/mobx'
import WXAPI from 'apifm-wxapi'
import AUTH from './utils/auth'
import Start from './pages/start/start'
import WX_API_CONFIG from './config/wx-api-config'
import shopInfoStore from './store/shopInfo'
import {set as setGlobalData} from './utils/global_data'


import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools 取消以下注释： if (process.env.NODE_ENV !==
// 'production' && process.env.TARO_ENV === 'h5')  {   require('nerv-devtools')
// }

const store = {
  shopInfoStore
}

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config : Config = {
    "pages": [
    "pages/start/start",
    "pages/index/index",
    "pages/category/category"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "首页",
    "navigationBarTextStyle": "black",
    "onReachBottomDistance": 50
  },
  "tabBar": {
    "color": "#6e6d6b",
    "selectedColor": "#e64340",
    "borderStyle": "white",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/nav/home-off.png",
        "selectedIconPath": "images/nav/home-on.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/category/category",
        "iconPath": "images/nav/ic_catefory_normal.png",
        "selectedIconPath": "images/nav/ic_catefory_pressed.png",
        "text": "分类"
      },
    ]
  }}


  componentWillMount() {
    //onLaunch

  }

  async componentDidMount() {
    // onLaunch
    WXAPI.init(WX_API_CONFIG.subDomain)
    const updateManager = Taro.getUpdateManager()
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    Taro.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          setGlobalData('isConnected', false)
          Taro.showToast({title: '当前无网络', icon: 'loading', duration: 2000})
        } else {
          setGlobalData('isConnected', true)
        }
      }
    })

    Taro.onNetworkStatusChange((res) => {
      if (!res.isConnected) {
        setGlobalData('isConnected', false)
        Taro.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: () => {
            this.goStartStartPage()
          }
        })
      } else {
        setGlobalData('isConnected', true)
        Taro.hideToast()
      }
    })

    const {data} = await WXAPI.vipLevel()
    setGlobalData('vipLevel', data);

    const res_config = await WXAPI.queryConfigBatch('mallName,recharge_amount_min,WITHDRAW_MIN,ALLOW_SELF_COLLECTION,RECHARGE_OPEN')
    if (res_config.code == 0) {
      res_config
        .data
        .forEach(config => {
          Taro.setStorageSync(config.key, config.value);
          if (config.key === 'recharge_amount_min') {
            setGlobalData('recharge_amount_min', config.value);
          }
        })

    }

    // 读取评价赠送多少积分
    const res_scrore = await WXAPI.scoreRules({code: 'goodReputation'})

    if (res_scrore.code == 0) {
      setGlobalData('order_reputation_score', res_scrore.data[0].score);
    }

    // 拉取站点信息
    const res_site = WXAPI.siteStatistics()
    if (res_site.code == 0) {
      if (res_site.data.wxAppid) {
        Taro.setStorageSync('wxAppid', res_site.data.wxAppid);
      }
    }

  }

  goStartStartPage = () => {
    setTimeout(function () {
      Taro.redirectTo({url: "/pages/start/start"})
    }, 1000)
  }

  componentDidShow() {
    //onShow(e)
    const e = this.$router.params as {
      [key : string] : string;
    } & {
      scene?: string | number | undefined;
      query?: {
        [key : string]: string;
      } | undefined;
      shareTicket?: string | undefined;
      referrerInfo?: string | {
        [key : string]: any;
      } | undefined;
    }
    setGlobalData('launchOption', e)

    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      const query = e.query
      Taro.setStorageSync('referrer', e.query.inviter_id)
      if (e.shareTicket) {
        Taro.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            console.log(res)
            console.log({referrer: query.inviter_id, encryptedData: res.encryptedData, iv: res.iv})
            Taro.login({
              success(loginRes) {
                if (loginRes.code) {
                  WXAPI
                    .shareGroupGetScore(loginRes.code, query.inviter_id, res.encryptedData, res.iv)
                    .then(_res => {
                      console.log(_res)
                    })
                    .catch(err => {
                      console.error(err)
                    })
                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }

    AUTH.checkHasLogined()
      .then(isLogined => {
        if (!isLogined) {
          AUTH.login()
        }
      })
  }

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Start/>
      </Provider>
    )
  }
}

Taro.render(
  <App/>, document.getElementById('app'))
