import React from 'react'
import ImageSlider from '../common/ImageSlider/ImageSlider'

const HeroBanner = () => {
  const slider =[
    '/images/slider/Food.jpg',
    '/images/slider/Food.jpg',
    '/images/slider/Food.jpg',
    '/images/slider/Food.jpg',
  ]
  return (
    <section className='pt-10'>
      <div className="container mx-auto">
        <ImageSlider slides={slider} />
      </div>
    </section>
  )
}

export default HeroBanner