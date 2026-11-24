import { BrowserRouter, Routes, Route } from "react-router-dom"
import Admin from "./pages/Admin"
import AdminPage from "./component/Admin/AdminPage"


function App() {
  return (
    <>
      <AdminPage />
      <Admin />
    </>
  )
}

export default App