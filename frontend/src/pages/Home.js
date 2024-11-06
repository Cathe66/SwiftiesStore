import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"fiction"} heading={"Top's Fictions"}/>
      <HorizontalCardProduct category={"technology"} heading={"Popular's Technology"}/>

      <VerticalCardProduct category={"nonfiction"} heading={"Nonfictions"}/>
      <VerticalCardProduct category={"ebooks"} heading={"Ebooks"}/>
      <VerticalCardProduct category={"Kids"} heading={"Kids"}/>
      <VerticalCardProduct category={"Audiobooks"} heading={"Audiobooks"}/>
     
    </div>
  )
}

export default Home