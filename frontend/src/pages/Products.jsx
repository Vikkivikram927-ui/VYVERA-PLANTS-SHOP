import React from "react";
import AllproductsPage from "./AllproductsPage";

function Products(props){
    return(
        <>
         <AllproductsPage categery={props.categery} />
        </>
    )
}


export default Products