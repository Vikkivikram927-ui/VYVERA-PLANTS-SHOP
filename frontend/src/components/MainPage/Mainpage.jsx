import "./Mainpage.css"
import plantlogo from "../Assets/Sunlit Minimalist Plant Vignette.png"
import { GiPlantSeed } from "react-icons/gi";
import { FaSeedling, FaTools } from "react-icons/fa";
import { GiPlantWatering } from "react-icons/gi";
import { VscOpenInProduct } from "react-icons/vsc";


function MainPage() {
    return (
        <>
        <div className="the-full-page">
            <div className="main-entrace">


                <div className="han-writte-handi">
                    <img src={plantlogo} alt='plant' />
                </div>

                <div className="after-main-entrace">
                    <h1>Give your plants a home as lovely as they make yours</h1>
                    <div className="after-main-logo">
                        "Where roots feel safe and leaves feel free, that <br></br>is where a plant truly feels at home.
                        Just like us plants <br></br>bloom best whenthey live in a place that is cared for, cherished,<br></br> and made beautiful with love"</div>
                </div>


                <div className="button-in-intrance">
                    <button>explore our collection</button>
                </div>

                <div className="button-in-intrance">
                    <button>style your space </button>
                </div>
            </div>

            <div className="after-main-entrance">

                <div className="plant-first-one">
                    <i className="icon-circle"><FaSeedling /></i>
                    <h3>Plants</h3>
                    <p>Live greenery</p>
                </div>

                <div className="plants-second-one">
                    <i className="icon-circle"><GiPlantSeed /></i>
                    <h3>Seeds</h3>
                    <p>Grow own seeds</p>
                </div>

                <div className="plants-second-two">
                    <i className="icon-circle"><FaTools /></i>
                    <h3>Materials</h3>
                    <p>Buy own meterails</p>
                </div>

                <div className="plants-second-three">
                    <i className="icon-circle"><VscOpenInProduct /></i>
                    <h3>Products</h3>
                    <p>Buy own products</p>
                </div>

                <div className="plants-second-four">
                    <i className="icon-circle"><GiPlantWatering /></i>
                    <h3>Soil</h3>
                    <p>Soil that helps your plants </p>
                </div>

            </div>
            </div>
        </>
    )
}


export default MainPage