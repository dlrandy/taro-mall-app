import {ComponentType} from 'react'
import Taro, {useState, useEffect} from '@tarojs/taro'
import WXAPI from 'apifm-wxapi'
import WX_API_CONFIG from '../../config/wx-api-config'
import {View, Swiper, SwiperItem, Image, Button} from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'

import './start.scss'

function jumpToPage () {
  if (WX_API_CONFIG.shopMod) {
    Taro.redirectTo({
      url: '/pages/shop/select'
    })
  } else {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }
}
function Start() {
  const [current,
    setCurrent] = useState(0)
  const [maxNumber,
    setMaxNumber] = useState(0)
  const [banners, setBanners] = useState<Array<{picUrl:string, id: number}>>([])
    useEffect(()=>{
      async function getBanners() {
        try {
          const res = await WXAPI.banners({
            type: 'app'
          })
          if (res.code === 700) {
            jumpToPage()
          } else {
            setBanners(res.data)
            setMaxNumber(res.data.length)
          }
        } catch (error) {
          jumpToPage()
        }
      }
      getBanners()
    },[])

    function onImageClick(e:ITouchEvent) {
      if (current + 1 != maxNumber) {
        Taro.showToast({
          title: '左滑进入',
          icon: 'none',
        })
      }
    }
  return <View className="swiper">
    <Swiper
      className='swiper__box'
      indicatorColor='#999'
      indicatorActiveColor='#333'
      indicatorDots
      current={current}
      onChange={(e) => setCurrent(e.detail.current)}
      >
      {
        banners.map(banner => {
          return <SwiperItem className="swiper-item" key={banner.id}>
            <Image className="image" mode="aspectFill" onClick={onImageClick} src={banner.picUrl} />
          </SwiperItem>
        })
      }
    </Swiper>
    <View className="btn">
      {current + 1 == maxNumber && <Button size='mini' type='primary' className='mini-btn'>进入店铺</Button>}
    </View>
  </View>
}

export default Start as ComponentType
