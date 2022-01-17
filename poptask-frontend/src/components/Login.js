/* login.jsx */
import React , { useState, useContext } from "react";
import logo from "../assets/TaskLogoTemp.png";
import "../login.css"
import { useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
import GoogleLogin from 'react-google-login';



export default function Login() {
  const navigator = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const axios = require('axios');
  const googleClientId = "810586372650-b4nsj2jid6rnln124vkq8k526kijl0e7.apps.googleusercontent.com"

  function getEmail() {
     return axios.get(`/users?username=${username}`)
      .then(function ({data}) {
          // handle success
          return (data[0]['email']);
    })
  }

  function loginUser(details) {
    console.log("currently logging");
    console.log(details);
    const axios = require('axios');
    return axios.post('/rest-auth/login/', details
        ).then(function (data) {
          console.log("this is key: ");
          console.log(data["data"]["key"]);
          localStorage.setItem('Token', data["data"]["key"])
        })
        .catch(function (error) {
            console.log(error);
        });
  }



  async function handleSubmit(e){
    e.preventDefault();
    const loginInfo = {
      "username": username,
      "password": password
    }
    try {
      await loginUser(loginInfo);
      await getEmail().then((email) => {
        localStorage.setItem('UserEmail', email)
        console.log("this is email");
        console.log(email);
      });
      navigator('/homepage');
    } catch (error) {
      console.log(error);
    }
  }
  

  const googleResponse = (response) => {
    console.log(response);
    const accesstoken = response.accesstoken;
    const code = response.code;
    const googleLogin = async (accesstoken, code) => {
      let res = await axios.post(
        "http://localhost:8000/rest-auth/google/",
        {
          "access_token": accesstoken,
          "code": code
        }
      );
      console.log(res);
      return await res.status;
    };
    return googleLogin;
  }

  return ( 
    <div className="h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pt-3 pl-3 pb-3" id="body">
      <div className="text-center mt-12">
        <div className="flex items-center justify-center">
          <img src={logo} alt="calendar" className="mb-1 mr-2 ml-1 w-20 h-20 inline-block mt-2 mb-8" />
        </div>            

        <h2 className="text-4xl tracking-tight">
          Sign in into your account
        </h2>
        <span className="text-sm"> or <a href="/register" className="text-blue-200 hover:text-blue-300"> 
          register a new account
        </a>
        </span>
      </div>
      <div className="flex justify-center my-8 mx-4 md:mx-0">
        <form onSubmit = {handleSubmit} className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='Password'>Username</label>
                  <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"  required 
                    onChange={e => setUsername(e.target.value)}
                  />
              </div>
              <div className="w-full md:w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='Password'>Password</label>
                  <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='password' required 
                    onChange={e => setPassword(e.target.value)}
                  />
              </div>
              <div className="w-full flex items-center justify-between px-3 mb-3 ">
                  <label htmlFor="remember" className="flex items-center w-1/2">
                    <input type="checkbox" name="" id="" className="mr-1 bg-white shadow" />
                    <span className="text-sm text-gray-700 pt-1">Remember Me</span>
                  </label>
                  <div className="w-1/2 text-right">
                    <a href="#" className="text-blue-500 text-sm tracking-tight">Forget your password?</a>
                  </div>
              </div>
              <div className="w-full md:w-full px-3 mb-6">
                  <button className="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none"
                    type="submit"
                  >
                    Sign in  
                  </button>
              </div>
              <div className="mx-auto -mb-6 pb-1">
                  <span className="text-center text-xs text-gray-700">or sign up with</span>
              </div>
              <div className="flex items-center w-full mt-4">
                  <div className="w-full md:w-1/3 px-3 pt-4 mx-2 border-t border-gray-400">

                  </div>
                  <div className="w-full md:w-32 px-8 pt-4 mx-2">
                    {/* <button className="appearance-none flex items-center justify-center block w-full bg-gray-100 text-gray-700 shadow border border-gray-500 rounded-lg py-3 px-3 leading-tight hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
                      onClick={googleLogin}>
                      <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
                        alt="calendar" className="w-8 h-8 inline-block" 
                      />
                    </button> */}
                    
                    <GoogleLogin
                      clientId={googleClientId}
                      buttonText="Google"
                      onSuccess={googleResponse}
                      isSignedIn={true}
                      onFailure={googleResponse}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 pt-4 mx-2 border-t border-gray-400">

                  </div>
              </div>
            </div>
        </form>
      </div>
    </div>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// }