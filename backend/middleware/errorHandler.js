const errorHandler =(err,req,res,next)=>{
    console.log(err)
    res.status(500).send({sucess:false,message:err.message})
}

export default errorHandler