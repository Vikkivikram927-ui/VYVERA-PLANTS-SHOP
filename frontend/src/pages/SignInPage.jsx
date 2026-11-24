
import { useState } from "react";
import "./SignInPage.css"
import { API } from "../config";

function SignInPage() {

    const [state, setState] = useState("log in")
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const Login = async () => {
        console.log("Log In Function Executed", formData)
        let responceData;
        await fetch(`${API}/login`, {
            method: "POST",
            headers: {
                Accept: "application/form-Data",
                'content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((respone) => respone.json())
          .then((data) => responceData = data)
          if(responceData.success){
            localStorage.setItem('auth-token',responceData.token);
            window.location.replace('/')
          }else{
            alert(responceData.errors)
          }
    }
    const Create = async () => {
        console.log("create functionIn Function Executed", formData)
        let responceData;
        await fetch(`${API}/signup`, {
            method: "POST",
            headers: {
                Accept: "application/form-Data",
                'content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((respone) => respone.json())
          .then((data) => responceData = data)
          if(responceData.success){
            localStorage.setItem('auth-token',responceData.token);
            window.location.replace('/')
          }else{
            alert(responceData.errors)
          }
    }

    return (
        <>
            <div className="sign-page-main">

                <div className="sign-in-page">
                    <h2>{state}</h2>
                    <div className="sign-center">
                        {state === "Create Account" ? <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="enter username" /> : <></>}
                        <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="enter your email" />
                        <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="enter your password" />
                    </div>
                    <button onClick={() => { state === "Create Account" ? Create() : Login() }} >sign in</button>
                    <div className="already-have-account">
                        {state === "Create Account" ? <p>Already have an account? <span style={{ color: "blue" }} onClick={() => setState("Log in")}>Log in</span></p>
                            : <p>Create Account? <span style={{ color: "blue" }} onClick={() => setState("Create Account")}>Click Here</span></p>}
                        <div className="checkboe-page"><input type="checkbox" />By continuing,i agree to terms condtions</div>
                    </div>
                </div>

            </div>
        </>
    )
}


export default SignInPage