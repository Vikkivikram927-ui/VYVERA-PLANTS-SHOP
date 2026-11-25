import "./footer.css"
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import { FaFacebook } from "react-icons/fa6";
import footerimg from "../Assets/footer-icon-removebg-preview.png"
function FooterPage() {
    return (
        <>
             <br></br><br></br>
            <div className="end-ofthe-page">
                <br />
                <h1>If you need assistance with plant care, our team <br />will provide clear, step-by-step guidance</h1>
                <button>Get Instructions Now</button>
            </div>


            <br></br><br></br>
            <div className="footer-page">

                <div className="footer-page-one">
                    <img src={footerimg} alt="gift" />
                    <form><input className="input-type-image" type="email" placeholder="enter your email" /></form>

                    <div className="footer-icons">
                        <FaSquareXTwitter />
                        < FaInstagram />
                        <IoLogoYoutube />
                        < FaFacebook />
                    </div>

                </div>

                <div className="footer-page-one">
                    <h4>shop</h4>
                    <ul className="services-list">
                        <li>plants</li>
                        <li>seeds</li>
                        <li>pots</li>
                        <li>products</li>
                        <li>soil</li>
                        <li>plant care</li>
                    </ul>
                </div>

                <div className="footer-page-one">
                    <h4>services</h4>
                    <ul  className="services-list">
                        <li>plants</li>
                        <li>seeds</li>
                        <li>pots</li>
                        <li>products</li>
                        <li>soil</li>
                        <li>gift</li>
                        <li>gift cards</li>
                        <li>corporate gifts</li>
                        <li>blog</li>
                        <li>offers</li>
                        <li>services</li>
                        <li>stores</li>
                    </ul>
                </div>

                <div className="footer-page-one">
                    <h4>about us</h4>
                    <ul  className="services-list">
                        <li>contact us</li>
                        <li>our story</li>
                        <li>careers</li>
                        <li>locate story</li>
                        <li>own grown</li>
                        <li>garden services</li>
                        <li>maintance assist</li>
                    </ul>
                </div>

                <div className="footer-page-one">
                    <h4>help</h4>
                    <ul  className="services-list">
                        <li>10 days plant guarante</li>
                        <li>shipping</li>
                        <li>care guides</li>
                        <li>track order</li>
                        <li>contactt</li>
                        <li>garden services</li>
                        <li>maintance assist</li>
                        <li>order related policy</li>
                        <li>corparte related-policy</li>
                        <li>support</li>
                        <li>whatsapp at us :+91567894844</li>
                        <li>call:+9167484285765 (9:30 am to 7:00 pm)</li>
                        <li>email support : support@gmail.com</li>
                    </ul>
                </div>

            </div>
        </>
    )
}


export default FooterPage