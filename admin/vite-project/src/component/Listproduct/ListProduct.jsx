import { useState } from "react"
import "./ListProduct.css"
import { useEffect } from "react";
import { AiTwotoneDelete } from "react-icons/ai";

function ListProduct(){

const [allproducts,setAllProducts]=useState([]);

const fetchInfo= async()=>{
  await fetch('http://localhost:4000/allproductsdata')
  .then((res)=>res.json())
  .then((data)=>{setAllProducts(data)})
}

useEffect(()=>{
    fetchInfo()
},[])


const Remove_Product=async (id)=>{
    await fetch("http://localhost:4000/removeproducts",{
        method:'POST',
        headers:{
            Accept:"application/json",
            'Content-Type':'application/json',    
        },
        body:JSON.stringify({id:id})

    })
     await fetchInfo(); 
}


    return(
        <>
        <div className="all-products-list">
            <h2>all product list</h2>
            {allproducts.map((products,index)=>{
                return <div key={index} className="data-product-list-details">
                    <img src={products.image} alt="image seeds" />
                    <h3>{products.name}</h3>
                    <i>${products.price}</i>
                    <h5>{products.categery}</h5>
                    <p>{products.description}</p>
                    <div className="svg-icons">
                     <AiTwotoneDelete onClick={()=>{Remove_Product(products.id)}} />
                    </div>   
                </div>
            })}
        </div>
        </>
    )
}


export default ListProduct