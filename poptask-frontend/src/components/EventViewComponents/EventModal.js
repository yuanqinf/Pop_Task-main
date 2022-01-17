import React, { useContext, useState } from "react";
import GlobalContext from "../../context/GlobalContext";
import SmallCalendar from "./SmallCalendar";
import dayjs from "dayjs";

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    setDaySelected,
    selectedEvent,
    segmentSelected,
    currentGroup,
    currentUser,
    setCurrentUser,
  } = useContext(GlobalContext);

  const [name, setName] = useState(
    selectedEvent ? selectedEvent.name : ""
  );

  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );

  const [score, setScore] = useState(
    selectedEvent ? selectedEvent.score : 100
  );

  const token = `Token ${localStorage.getItem("Token")}`;

  const [miniCalendarOpen, setMiniCalendarOpen] = useState(false);

  function newHandleDoneTask() {
    console.log("creating new task");
    const updatedTask = {
      "score": selectedEvent.score,
      "done_at": dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    const axios = require('axios');
    return axios.put(`/tasks/${selectedEvent.id}/`, updatedTask, {
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

  // function handleDoneTask(newScore) {
  //   console.log("task done");
  //   let newUserInfo = currentUser;
  //   newUserInfo.score += newScore;

  //   const axios = require('axios');
  //   return axios.put(`/users/${localStorage.getItem("UserEmail")}/`, newUserInfo, {
  //     headers: {
  //       'Authorization': token
  //     }
  //   }
  //   ).then(() => {
  //     setCurrentUser(newUserInfo);
  //     handleDelete(selectedEvent);
  //   })
  // }


  function handleSubmit() {
    console.log("creating new task");
    const calendarTask = {
      "group": currentGroup,
      "name": name === "" ? "Untitled Task" : name,
      "description": description === "" ? "......" : description,
      "score": Number(score) === 0 ? 0 : Number(score),
      "deadline": daySelected.format("YYYY-MM-DD HH:mm:ss"),
    };

    const axios = require('axios');
    if (selectedEvent) {
      return axios.put(`/tasks/${selectedEvent.id}/`, calendarTask, {
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
    } else {
      return axios.post('/tasks/', calendarTask, {
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
  }

  function handleDelete(selectedEvent) {
    console.log("Delete a task");
    const axios = require('axios');
    return axios.delete(`/tasks/${selectedEvent.id}/`, {
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
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent ?
              <span
                onClick={() => {
                  handleDelete(selectedEvent);
                  setShowEventModal(false);
                  setDaySelected(dayjs());
                }}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span> : ""
            }
            <button onClick={() => {
              setShowEventModal(false);
              setDaySelected(dayjs());
            }}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            {
              segmentSelected === "TaskPool" ?
                <input
                  type="text"
                  name="name"
                  placeholder="Add Name"
                  value={name}
                  required
                  className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  onChange={(e) => setName(e.target.value)}
                /> :
                <input
                  type="text"
                  name="name"
                  value={name}
                  readOnly
                  className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
            }
            <span className="material-icons-outlined text-gray-400">
              event
            </span>
            <span>
              {
                segmentSelected === "TaskPool" ?
                  <p className="cursor-pointer" onClick={() => { setMiniCalendarOpen(!miniCalendarOpen) }}>
                    {daySelected.format("dddd, MMMM DD")}
                  </p> :
                  <p className="">
                    {daySelected.format("dddd, MMMM DD")}
                  </p>
              }
              <span className="absolute">
                {miniCalendarOpen && <SmallCalendar />}
              </span>
            </span>

            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            {segmentSelected === "TaskPool" ?
              <input
                type="text"
                name="description"
                placeholder="description..."
                value={description}
                required
                autoComplete="off"
                className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                onChange={(e) => setDescription(e.target.value)}
              /> :
              <input
                type="text"
                name="description"
                placeholder="description..."
                value={description}
                readOnly
                className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              />
            }

            <span className="material-icons-outlined text-gray-400">
              sports_score
            </span>
            {
              segmentSelected === "TaskPool" ?
                <input
                  type="number"
                  name="score"
                  placeholder="0"
                  value={score}
                  required
                  className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  onChange={(e) => setScore(e.target.value)}
                />
                :
                <input
                  type="number"
                  name="score"
                  placeholder="score..."
                  value={score}
                  readOnly
                  className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
            }
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          {segmentSelected === "TaskPool" ?
            <button
              onClick={() => {
                handleSubmit();
                setDaySelected(dayjs());
              }}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
            >
              Save
            </button>
            :
            <button
              onClick={() => {
                // handleDoneTask(score);
                newHandleDoneTask();
                setDaySelected(dayjs());
              }}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
            >
              Done
            </button>
          }
        </footer>
      </div>
    </div>
  );
}
