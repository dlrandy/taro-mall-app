import { Config } from '@tarojs/taro'


const config: Config = {
  "pages": [
    "pages/start/start",
    "pages/index/index",
    // "pages/shop/select",
    // "pages/notice/index",
    // "pages/notice/show",
    // "pages/category/category",
    // "pages/goods/list",
    // "pages/goods-details/index",
    // "pages/shop-cart/index",
    // "pages/to-pay-order/index",
    // "pages/select-address/index",
    // "pages/address-add/index",
    // "pages/order-list/index",
    // "pages/order-details/index",
    // "pages/order/refundApply",
    // "pages/wuliu/index",
    // "pages/my/index",
    // "pages/recharge/index",
    // "pages/withdraw/index",
    // "pages/score-excharge/index",
    // "pages/score-excharge/growth",
    // "pages/asset/index",
    // "pages/score/index",
    // "pages/score/growth",
    // "pages/sign/index",
    // "pages/maidan/index",
    // "pages/fx/apply",
    // "pages/fx/apply-status",
    // "pages/fx/members",
    // "pages/fx/commisionLog",
    // "pages/coupons/index",
    // "pages/invoice/list",
    // "pages/invoice/apply",
    // "pages/deposit/pay"
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
        "iconPath": "mages/nav/home-off.png",
        "selectedIconPath": "images/nav/home-on.png",
        "text": "首页"
      },
  //     {
  //       "pagePath": "pages/category/category",
  //       "iconPath": "../images/nav/ic_catefory_normal.png",
  //       "selectedIconPath": "../images/nav/ic_catefory_pressed.png",
  //       "text": "分类"
  //     },
  //     {
  //       "pagePath": "pages/shop-cart/index",
  //       "iconPath": "../images/nav/cart-off.png",
  //       "selectedIconPath": "../images/nav/cart-on.png",
  //       "text": "购物车"
  //     },
  //     {
  //       "pagePath": "pages/my/index",
  //       "iconPath": "../images/nav/my-off.png",
  //       "selectedIconPath": "../images/nav/my-on.png",
  //       "text": "我的"
  //     }
    ]
  },
  // "permission": {
  //   "scope.userLocation": {
  //     "desc": "获取离你最近的门店"
  //   }
  // },
  // "navigateToMiniProgramAppIdList": [
  //   "wx56c8f077de74b07c"
  // ],
  // "plugins": {
  //   "wxparse": {
  //     "version": "1.0.10",
  //     "provider": "wx5d60c080635009b1"
  //   }
  // },
  // "usingComponents": {
  //   // "float-menu": "/components/float-menu/index"
  // },
}

export default config
