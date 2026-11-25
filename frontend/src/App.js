
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Seeds from "./pages/seeds"
import Pots from "./pages/pots"
import Plants from "./pages/plants"
import Store from "./pages/store"
import Home from "./pages/Home"
import FooterPage from './components/Footer/footer';
import Products from './pages/Products';
import SignInPage from './pages/SignInPage';
import CartPage from './pages/Cart';
import AllproductsPage from './pages/AllproductsPage';
import SpaProduct from './pages/SpaProduct';
import PlantCareTools from './pages/PlantCare';
import SearchResults from './components/SearchComponent/SearchComponent';
import CheckoutPage from "../src/components/CheckoutPage/CheckoutPage"
import OrderSuccess from "../src/components/OrderSuccess/OrderSuccess";
import MyOrders from "../src/components/MyOrders/MyOrder";


function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Navbar />
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/plants' element={<Plants categery="plants" />} />
          <Route path='/Seeds' element={<Seeds categery="seeds" />} />
          <Route path='/Pots' element={<Pots categery="pots" />} />
          <Route path='/products' element={<Products categery="products" />} />
          <Route path='/stores' element={<Store />} />
          <Route path='/plantcare' element={<PlantCareTools categery="Plantcare" />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/cartpage' element={<CartPage />} />
          <Route path='/Allproducts' element={<AllproductsPage categery="Allproducts" />} />
          <Route path='/SpaProduct/:id' element={<SpaProduct />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />

        </Routes>
        <FooterPage />
      </BrowserRouter>
    </div>
  );
}

export default App;
