import React, { useContext } from 'react'
import logo from "../assets/TaskLogoTemp.png";
import { Navbar, Nav } from 'react-bootstrap';
import GlobalContext from "../context/GlobalContext";


export default function MainHeader() {
    const { setSegmentSelected } = useContext(GlobalContext);
    return (
        <Navbar fixed="top">
            <Nav className="ml-auto">
                <Navbar.Brand href="#home" >
                    <img src={logo} alt="calendar" className="mb-1 mr-2 ml-1 w-12 h-12 inline-block" />
                    <h1 className="mt-2 mr-10 text-3xl text-gray-200 font-mono inline-block font-medium" >
                        PopTask
                    </h1>
                </Navbar.Brand>
                <button
                    onClick={() => { setSegmentSelected("TaskView") }}
                    className="bg-blue-400 hover:bg-blue-600 ml-12 mr-12 px-6 py-2 rounded text-white"
                >
                    Task View
                </button>
                <button
                    onClick={() => { setSegmentSelected("TaskPool") }}
                    className="bg-purple-400 hover:bg-purple-600 ml-12 mr-12 px-6 py-2 rounded text-white float-center"
                >
                    Task Pool
                </button>
                <button
                    onClick={() => { setSegmentSelected("Leaderboard") }}
                    className="bg-red-400 hover:bg-red-500 ml-12 mr-12 px-6 py-2 rounded text-white float-center"
                >
                    LeaderBoard
                </button>
            </Nav>
        </Navbar>

    )
}
