import "./Plantspage.css"
import { useEffect, useState } from "react"
import ProductItem from "../productitem/Productitems"
import { API } from "../../config"
function PlantsPage() {

const [homepageproduct,setHomePageProduct]=useState([])

useEffect(()=>{
  fetch(`${API}/homepageproducts`)
  .then((responce)=>responce.json())
  .then((data)=>setHomePageProduct(data))
},[])


  return (
    <>
      <div className="plants-head-one">

        {homepageproduct.map((item, i) => {
          return <ProductItem key={i} id={item.id} name={item.name} image={item.image} description={item.description} price={item.price}  />

        })}

      </div>

    </>
  )
}

export default PlantsPage
