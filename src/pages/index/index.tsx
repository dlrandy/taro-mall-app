import {ComponentType} from 'react'
import Taro, {Component, Config} from '@tarojs/taro'
import {
  View,
  Swiper,
  SwiperItem,
  Text,
  Input,
  Navigator,
  Image
} from '@tarojs/components'
import {observer, inject} from '@tarojs/mobx'
import WXAPI from 'apifm-wxapi'
import './index.scss'
import shopInfo_l_image from '../../images/order-details/icon-address.png';
import shopInfo_r_image from '../../images/icon/next.png';
import search_image from '../../images/icon/search.svg'
type PageStateProps = {
  shopInfoStore: {
    shopInfo: {
      name: string
    },
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
}

interface Index {
  props : PageStateProps;
}

@inject('shopInfoStore')
@observer
class Index extends Component {

  constructor(...props: any) {
    super(...props)
    this.state = {
      banner_data: {
        banners: [],
        adInfo:{}
      },
      inputVal: '',
    }
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config : Config = {}

  componentWillMount() {}

  componentWillReact() {
    console.log('componentWillReact')
  }

  componentDidMount() {
    this.initBanners()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  initBanners = async() => {
    const _data = {
      banners: null,
      adInfo: null
    }
    const banners = await WXAPI.banners({type: 'index'})
    if (banners.code === 700) {
      Taro.showModal({title: '提示', content: '请在后台添加 banner 轮播图片，自定义类型填写 index'})
    } else {
      _data.banners = banners.data
    }
    const adInfo = await WXAPI.banners({type: 'indexAD'})
    if (adInfo.code === 0) {
      _data.adInfo = adInfo.data[0]
    }
    this.setState(() => {
      return {banner_data: _data};
    })
  }

  bindInput(e: { detail: { value: any } }) {
    this.setState({
      inputVal: e.detail.value
    })
  }

  bindConfirm(e: { detail: { value: any } }) {
    this.setState({
      inputVal: e.detail.value
    })
    Taro.navigateTo({
      url: '/pages/goods/list?name=' + this.state.inputVal,
    })
  },
  // increment = () => {   const { counterStore } = this.props
  // counterStore.increment() } decrement = () => {   const { counterStore } =
  // this.props   counterStore.decrement() } incrementAsync = () => {   const {
  // counterStore } = this.props   counterStore.incrementAsync() }

  render() {
    const {shopInfoStore: {
        shopInfo
      }} = this.props
    const {banner_data} = this.state
    return (
      <View className='index'>
        <Navigator url="/pages/shop/select">
          {shopInfo !== null && <View className="shops-container">
            <View className="l">
              <Image src={shopInfo_l_image}></Image>
              <Text>{shopInfo.name}</Text>
            </View>
            <View className="r">
              <Text>切换门店</Text>
              <Image src={shopInfo_r_image}></Image>
            </View>
          </View>
}
        </Navigator>
        <View className="swiper-container">
        <View className="search">
        <Input type="text" placeholder="输入搜索关键词" value={this.state.inputVal} onInput={this.bindInput} onConfirm={this.bindConfirm}></Input>
        <Image src={search_image}></Image>
      </View>
          <Swiper
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay>
          {
            banner_data.banners.map((item: { id: string | number | undefined; linkUrl: any; picUrl: string })=>(
              <SwiperItem key={item.id}>
              <Image  mode="aspectFill"   data-url={item.linkUrl} src={item.picUrl} />
            </SwiperItem>
            ))
          }

          </Swiper>
        </View>
        
      </View>
    )
  }
}

export default Index as ComponentType
