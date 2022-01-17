import React, { useContext } from 'react'
import GlobalContext from '../../context/GlobalContext';

export default function EventCard({ task }) {
    const { setShowEventModal, selectedEvent, setSelectedEvent, currentGroup } = useContext(GlobalContext);

    const token = `Token ${localStorage.getItem("Token")}`;

    const currentUserEmail = localStorage.getItem("UserEmail");

    function handlePop() {
        console.log("pop a new task");
        const calendarTask = {
            "group": currentGroup,
            "name": task.name,
            "description": task.description,
            "score": Number(task.score),
            "deadline": (task.deadline),
            "assigned_to": currentUserEmail
          };
    
        const axios = require('axios');
        return axios.put(`/tasks/${task.id}/`, calendarTask, {
            headers: {
              'Authorization': token
            }
          }
        ).then(function () {
            setShowEventModal(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div className="rounded-lg h-80 w-3/4 text-center bg-blue-300 px-6 py-2 m-10 shadow-md">
            <div className={`h-1 bg-${task.label}-200`}></div>
            <span className="material-icons-outlined text-black-400 cursor-pointer m-2" onClick={() => {
                setShowEventModal(true);
                setSelectedEvent(task)
            }}>
                edit
            </span>
            <p className="break-words mt-2 font-sans text-xl text-gray-800 font-semibold">
                {task.name}
            </p>
            <p className="break-words mt-5 font-sans text-lg text-gray-800 text-center font-medium">
                {task.description}
            </p>
            <p className="mt-5 font-sans text-lg text-gray-800 text-center font-medium">
                {`Score: ${task.score}`}
            </p>
            <p className="mt-5 font-sans text-lg text-gray-800 text-center font-medium">
                {`Due By: ${(task.deadline.split(" ")[0])}`}
            </p>
            <button className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 border border-blue-700 rounded"
                onClick = { () => {
                    handlePop();
                }}
            >
                POP-IT
            </button>
        </div>
    )
}
