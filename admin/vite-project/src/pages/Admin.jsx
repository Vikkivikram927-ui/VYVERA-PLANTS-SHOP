
import AddtocartPage from "../component/addproduct/Addtocart"
import ListProduct from "../component/Listproduct/ListProduct"
import SideBar from "../component/sidebar/sidebar"
import { Route,Routes,Navigate } from "react-router-dom"
import "./Admin.css"

function Admin() {
    return (
        <>
            <div className="admin">
            <SideBar />
            <Routes>
                <Route path="/" element={<Navigate to="/listproduct" replace />} />
                <Route path="/addproduct" element={<AddtocartPage/>} />
                <Route path="/productlist" element={<ListProduct />} />
            </Routes>
            </div>
        </>
    )
}

export default Admin