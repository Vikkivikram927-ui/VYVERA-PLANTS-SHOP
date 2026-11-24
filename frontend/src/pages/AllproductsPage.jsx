import React, { useContext} from "react";
import './AllproductsPage.css'
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/productitem/Productitems";



function AllproductsPage(props) {

    const {allproducts} = useContext(ShopContext)
    return (
        <>
            <div className="shop-cetegary-page">

                {allproducts.map((product, i) => {
                    if (props.categery === product.categery) {
                        return <ProductItem key={i} id={product.id} name={product.name} image={product.image} price={product.price} description={product.description} qty={product.qty} />
                    }else{
                        return null
                    }
                })}

            </div>
        </>
    )
}

export default AllproductsPage