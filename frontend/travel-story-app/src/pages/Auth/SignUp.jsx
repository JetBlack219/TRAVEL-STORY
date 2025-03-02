import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleSignUp = async(e) => {
    e.preventDefault();

    if(!name){
      setError("Please enter your name");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter the password.")
      return;
    }

    setError("");

    //SignUp API Call
    try{
      const response = await axiosInstance.post("/create-account", {
        "fullName": name,
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
        
        <div className="w-1/2 h-full bg-signup-bg-img bg-cover bg-center rounded-l-lg flex flex-col justify-center p-10 text-white">
          <div className='ml-4'>
            <h4 className="text-5xl font-semibold leading-[58px] mt-8">
              Join The <br/> Adventure
            </h4>
            <p className="font-larger mt-4">
              Create an account to start documenting your travel and preserving
              your memories in your personal travel journal
            </p>

          </div>
        </div>

        <div className="w-1/2 h-full bg-white rounded-r-lg p-16 shadow-lg shadow-cyan-200/20 flex flex-col justify-center">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value = {name}
              onChange={({target}) => {setName(target.value)}}
            />

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

            <button type="submit" className="btn-primary"> CREATE ACCOUNT </button>

            <p className="text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/login")} // Using navigate function
            >
              LOGIN
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default SignUp;
