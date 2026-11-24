import React from "react";
import "./productitems.css"
import { Link } from "react-router-dom";


function ProductItem(props){


    return(
        <>
<div className="product-items">
                <Link to={`/SpaProduct/${props.id}`}><img onClick={()=>window.scrollTo(0,0)} src={props.image} alt="pink princess" /></Link>
                <h3>{props.name}</h3>
                <i>"{props.description}"</i>
                <p>${props.price}</p>
            </div>
        </>
    )
}


export default ProductItem