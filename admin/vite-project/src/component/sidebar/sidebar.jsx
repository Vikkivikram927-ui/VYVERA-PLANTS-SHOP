import { Link } from "react-router-dom"
import { FaCartArrowDown } from "react-icons/fa6";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import "./sidebar.css"


function SideBar() {
    return (
        <>
            <div className="sidebar">
            <div className="sidebar-front">
                <Link to={"/addproduct"} style={{ textDecoration: "none" }} >
                    <div className="add-product"><FaCartArrowDown />add product</div>
                </Link>
            </div>

            <div className="sidebar-back">
                <Link to={"/productlist"} style={{ textDecoration: "none" }} >
                    <div className="product-list"> <LuGalleryVerticalEnd />product list</div>
                </Link>
            </div>
            </div>


        </>
    )
}

export default SideBar