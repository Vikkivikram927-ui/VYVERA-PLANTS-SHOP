import React from "react";
import AllproductsPage from './AllproductsPage'


function PlantCareTools(props){
    return(
        <>
           <AllproductsPage categery={props.categery} />
        </>
    )
}

export default PlantCareTools