import React, { useContext } from 'react'
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// function getToken() {
//   let tokenString = sessionStorage.getItem('token');
//   console.log("App get token");
//   console.log(tokenString);
//   if (tokenString === 'undefined') {
//     console.log("enter app")
//     return;
//   }
//   let userToken = JSON.parse(tokenString);
//   return userToken?.token;
// }

function App() {
  return(
    <Router>
      <div className="App">
        <div className="content">
          <div>
            {
                (localStorage.getItem("UserEmail") !== null) ? 
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route exact path="/login" element={<Login/>} />
                  <Route exact path="/register" element={<Register/>} />
                  <Route exact path="/homepage" element={<HomePage/>} />
                </Routes> 
              :
                <Routes>
                  <Route path="/" element={<Login/>} /> 
                  <Route exact path="/login" element={<Login/>} />
                  <Route exact path="/register" element={<Register/>} />
                  <Route exact path="/homepage" element={<HomePage/>} />
                </Routes>
            }

          </div>
        </div>
      </div>
    </Router>
  )
  // if(Token !== "NoToken") {
  //   return (
  //     <Router>
  //       <Login/>
  //       <Routes>
  //         <Route path="/" element={<HomePage/>} />
  //         <Route path="/login" element={<Login/>} />
  //         <Route path="/register" element={<Register/>} />
  //         <Navigate from='/*' to='/'/> 
  //       </Routes>
  //     </Router>
  //   )
  // }
  // return (
  //   <Router>
  //     <Routes>
  //         <Route exact path="/" element={<HomePage/>} />
  //         <Route path="/login" element={<Login/>}/>
  //         <Route path="/register" celement={<Register/>} /> 
  //       </Routes>
  //   </Router>
  // );
}

export default App;
