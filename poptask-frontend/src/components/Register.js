/* login.jsx */
import React , { useState, useContext } from "react";
import logo from "../assets/TaskLogoTemp.png";
import "../login.css"
import { useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";
//import GoogleLogin from 'react-google-login';
import CSRFToken from './csrftoken';


const OtherMethods = props => (
<div id="alternativeLogin">
  <label>Or sign in with:</label>
  <div id="iconGroup">
  {/* <GoogleLogin
          clientId="<Google Client ID>"
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        /> */}
  </div>
</div>
);

const Google = props => (
  <a href="http://localhost:8000/accounts/google/login/?process=" id="googleIcon" ></a>
);


export default function Register({ storeToken}) {  
  const navigator = useNavigate();
  const [username, setUsername] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [email, setEmail] = useState();
  const axios = require('axios');

  // async function loginUser(details) {
  //   const requestOptions = {
  //     method: 'POST',
  //     body: details
  //   };

  //   const response = await fetch('http://localhost:8000/rest-auth/registration/', requestOptions)
  //   let data = await response.json()
  //   return data
  // }

  function getEmail() {
    return axios.get(`/users?username=${username}`)
     .then(function ({data}) {
         // handle success
        localStorage.setItem('UserEmail', email)
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

  function registerUser(registerDetails) {
    console.log("currently registering");
    console.log(registerDetails);
    const axios = require('axios');
    return axios.post('/rest-auth/registration/', registerDetails
        ).then(function (data) {
          console.log("sign up successfully!");
        })
        .catch(function (error) {
            console.log(error);
        });
  }

  async function handleSubmit(e){
    e.preventDefault();
    const loginInfo = {
      "username": username,
      "password": password1
    }

    const registerInfo = {
      "username": username,
      "email": email,
      "password1": password1,
      "password2": password2
    }

    try {
      await registerUser(registerInfo);
      await loginUser(loginInfo);
      await getEmail().then((email) => {
        console.log("this is email");
        console.log(email);
      });
      navigator('/homepage');
    } catch (error) {
      console.log(error);
    }
  }

  // const handleSubmit = async e => {
    // //e.preventDefault();
    // var formData = new FormData();
    // formData.append("username", username);
    // formData.append("email", email);
    // formData.append("password1", password1);
    // formData.append("password", password1);
    // const data =  await loginUser(
    //   formData
    // );
    // console.log("submit");
    // console.log(data);
    // const token = data['key'];
    // console.log(token);
    // if (token) setToken("Token " + token);
    // //console.log(getToken());
  // }

  return ( 
    <div className="h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pt-3 pl-3 pb-3">
      <div className="text-center mt-12">
        <div className="flex items-center justify-center">
          <img src={logo} alt="calendar" className="mb-1 mr-2 ml-1 w-20 h-20 inline-block mt-2 mb-8" />
        </div>            

        <h2 className="text-4xl tracking-tight">
          Sign Up
        </h2>
      </div>
      <div className="flex justify-center my-8 mx-4 md:mx-0">
        <form onSubmit = {handleSubmit} className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='Password'>E-mail</label>
                  <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='email'  required 
                    onChange={e => setEmail(e.target.value)}
                  />
              </div>
              <div className="w-full md:w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='Password'>Username</label>
                  <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='username' required 
                    onChange={e => setUsername(e.target.value)}
                  />
              </div>
              <div className="w-full md:w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='Password'>Password</label>
                  <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='password' required 
                    onChange={e => setPassword1(e.target.value)}
                  />
              </div>
              <div className="w-full md:w-full px-3 mb-6">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='Password'>Confirm</label>
                  <input className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none" type='password' required 
                     onChange={e => setPassword2(e.target.value)}
                  />
              </div>

              <div className="w-full md:w-full px-3 mb-6">
                  <button className="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500"
                    type="submit"
                  >
                    Create Account  
                  </button>
              </div>
              <div className="mx-auto -mb-6 pb-1">
                  <span className="text-center text-xs text-gray-700">or sign up with</span>
              </div>
              <div className="flex items-center w-full mt-4">
                  <div className="w-full md:w-1/3 px-3 pt-4 mx-2 border-t border-gray-400">
                  </div>
                  <div className="w-full md:w-32 px-8 pt-4 mx-2">
                    <button className="appearance-none flex items-center justify-center block w-full bg-gray-100 text-gray-700 shadow border border-gray-500 rounded-lg py-3 px-3 leading-tight hover:bg-gray-200 hover:text-gray-700 focus:outline-none">
                      <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
                        alt="calendar" className="w-8 h-8 inline-block" 
                      />
                    </button>
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
