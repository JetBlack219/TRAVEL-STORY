import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleLogin = async(e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter the password.")
      return;
    }

    setError("");

    //Login API Call
    try{
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      //Handle successful login response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error){
      // Handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ){
        setError(error.response.data.message);
      } else{
        setError("An unexpected error occured. Please try again.");
      }
    }

  }

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">

      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        
        <div className="w-1/2 h-full bg-login-bg-img bg-cover bg-center rounded-l-lg flex flex-col justify-center p-10 text-white">
          <div className='ml-4'>
            <h4 className="text-5xl font-semibold leading-[58px] mt-8">
              Capture Your <br /> Journeys
            </h4>
            <p className="font-larger mt-4">
              Record your travel experiences and memories in your <br /> 
              personal travel journal
            </p>

          </div>
        </div>

        <div className="w-1/2 h-full bg-white rounded-r-lg p-16 shadow-lg shadow-cyan-200/20 flex flex-col justify-center">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value = {email}
              onChange={({target}) => {setEmail(target.value)}}
            />

            <PasswordInput value = {password}
              onChange={({target}) => {setPassword(target.value)}}/>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type="submit" className="btn-primary"> LOGIN </button>

            <p className="text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/signUp")} // Using navigate function
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
