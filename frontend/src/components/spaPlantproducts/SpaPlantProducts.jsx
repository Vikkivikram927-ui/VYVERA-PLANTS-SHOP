import React, { useContext } from "react";
import "./SpaPlantProducts.css"
import { MdArrowForwardIos } from "react-icons/md";
import { ShopContext } from "../../context/ShopContext";
import { FaMinus, FaPlus } from "react-icons/fa";


function SpaPlantProduct({ SpaProduct }) {


    const { AddToCart, RemoveToCart, cartItem } = useContext(ShopContext);
    const priceDynamic = cartItem[SpaProduct.id] * SpaProduct.price || SpaProduct.price

    return (
        <>
            <div className="all-round-elemenyts">
                <div className="spa-plants-products">
                    home <MdArrowForwardIos /> shop <MdArrowForwardIos /> {SpaProduct.categery} <MdArrowForwardIos /> {SpaProduct.name}
                </div>
                     
                <div className="main-image-spa">
                    <img src={SpaProduct.image} alt="pinky promise" />
                </div>
                 
                 <div className="img-spa-products">
                        <img src={SpaProduct.image} alt="pinky promise" />
                        <img src={SpaProduct.image} alt="pinky promise" />
                        <img src={SpaProduct.image} alt="pinky promise" />
                        <img src={SpaProduct.image} alt="pinky promise" />
                    </div>

                
                <div className="spa-page-header">
                    <h1>{SpaProduct.name}</h1>
                    <p>"{SpaProduct.description}"</p>
                    <i>${priceDynamic}</i>
                </div><br></br>


                <div className="qty-spa-product">
                    <div className="oty-products-page">
                        <p className="operate" onClick={() => { RemoveToCart(SpaProduct.id) }} ><FaMinus /></p>
                        <p className="cart-number-item">{cartItem[SpaProduct.id] || 1}</p>
                        <p className="operate" onClick={() => { AddToCart(SpaProduct.id) }} ><FaPlus /></p>
                    </div>
                    <button className="add-cart-button" onClick={() => { AddToCart(SpaProduct.id) }}>add to cart</button>

                </div>


                <h3 className="offer-method-for">Offer for you</h3>
                <div className="offer-spa-page">
                    <div className="offer-boxes">
                        <p>🎁 Get 10% off on orders above ₹1,499</p>
                        <p>🚚 Free shipping on all orders above ₹499</p>
                    </div>
                </div>

                    

                    <div className="plant-care-tips">
                        <h3>Plant Care Tips</h3>
                        <ul>
                            <li>Quick Plant Care Checklist</li>
                            <li>Check soil moisture before watering</li>
                            <li>Give each plant suitable light</li>
                            <li>Keep leaves clean and inspect for pests</li>
                            <li>Use well-draining soil and pots</li>
                            <li>Fertilize according to the plant's needs</li>
                            <li>Observe your plants regularly for changes</li>
                        </ul>
                    </div>

                </div>
         

        </>
    )
}



export default SpaPlantProduct