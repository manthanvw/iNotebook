import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup(props) {
    const [credentials, setCredentials] = useState({name:"",email:"",password:"",confirm_password:""})
    let navigate = useNavigate ();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name,email,password} = credentials;  
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
    method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name,email,password})
    });
    const json = await response.json();
    console.log(json);
    if (json.success)
    {
        // Save the authtoken and redirect
        localStorage.setItem('token',json.authtoken);
        props.showAlert("Account Created Successfully",'success')
        navigate("/login");

    }
    else
    {
        props.showAlert("Invalid Details",'danger')

    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  aria-describedby="nameHelp"
                  required
                  minLength={3}
                  name="name"
                  onChange={onChange}
                />{" "}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  required
                  name="email"
                  onChange={onChange}
                />{" "}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  required
                  minLength={5}
                  name='password'
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirm_password" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirm_password"
                  required
                  minLength={5}
                  name='confirm_password'
                  onChange={onChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
