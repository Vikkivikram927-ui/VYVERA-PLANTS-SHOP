import React from 'react'
import AllproductsPage from './AllproductsPage'

function Plants(props) {
  return (
    <>
      <div>
        <AllproductsPage categery={props.categery} />
      </div>
    </>
  )
}

export default Plants
