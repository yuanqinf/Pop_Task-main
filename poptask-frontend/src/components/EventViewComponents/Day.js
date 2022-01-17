import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../context/GlobalContext";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);

  const {
    setDaySelected,
    setShowEventModal,
    setSelectedEvent,
    currentGroup,
    showEventModal,
  } = useContext(GlobalContext);

  const token = `Token ${localStorage.getItem("Token")}`;

  function getTasks() {
    console.log("get task!");
    const axios = require('axios');
    return axios.get('/tasks/', {
      headers: {
        'Authorization': token
      }
    }).then(function ({ data }) {
      // handle success
      return (data);
    })
  }

  async function fetchTaskInfo() {
    await getTasks().then((tasks) => {
      const filteredTasks = (tasks.sort((a, b) => a.deadline - b.deadline)
        .filter((evt) => (evt.assigned_to === localStorage.getItem("UserEmail") && evt.group === currentGroup && evt.done_at === null)))
      setDayEvents(filteredTasks);
    });
  }

  // useEffect(() => {
  //   const events = filteredEvents.filter(
  //     (evt) => (dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY") && evt.popped)
  //   );
  //   setDayEvents(events);
  // }, [filteredEvents, day]);

  useEffect(() => {
    fetchTaskInfo();
  }, [currentGroup, showEventModal]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  function handleBurndownBar() {
    if (Number(day.format("MM")) < Number(dayjs().format("MM"))) {
      return <div className={`bg-black p-1 mt-2 m-26 rounded mb-1`} />;
    } else if (day.diff(dayjs(), 'day') >= 7) {
      return <div className={`bg-blue-500 p-1 mt-2 m-0 rounded mb-1`} />;
    } else if (Number(day.format("DD")) < Number(dayjs().format("DD")) && Number(day.format("MM")) === Number(dayjs().format("MM"))) {
      return <div className={`bg-black p-1 mt-2 m-26 rounded mb-1`} />;
    }

    const dayDiff = Number(day.format("DD")) - Number(dayjs().format("DD"));

    if (dayDiff === 0) return <div className={`bg-red-500 p-1 mt-2 m-26 rounded mb-1`} />
    else if (dayDiff === 1 || (dayjs().diff(day, 'month', true) < 0 && dayDiff == -29)) return <div className={`bg-red-500 p-1 mt-2 m-24 rounded mb-1`} />
    else if (dayDiff === 2 || (dayjs().diff(day, 'month', true) < 0 && dayDiff == -28)) return <div className={`bg-red-500 p-1 mt-2 m-20 rounded mb-1`} />
    else if (dayDiff === 3 || (dayjs().diff(day, 'month', true) < 0 && dayDiff == -27)) return <div className={`bg-yellow-500 p-1 mt-2 m-16 rounded mb-1`} />
    else if (dayDiff === 4 || (dayjs().diff(day, 'month', true) < 0 && dayDiff == -26)) return <div className={`bg-yellow-500 p-1 mt-2 m-12 rounded mb-1`} />;
    else if (dayDiff === 5 || (dayjs().diff(day, 'month', true) < 0 && dayDiff == -25)) return <div className={`bg-yellow-500 p-1 mt-2 m-8 rounded mb-1`} />
    else return <div className={`bg-green-500 p-1 mt-2 m-4 rounded mb-1`} />;
  }

  return (
    <div className="border border-blue-400 border-opacity-25 px-1">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer pl-2"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {dayEvents.map((task, idx) => (
          day.format("YYYY-MM-DD") === (task.deadline.split(" ")[0]) &&
          <div
            key={idx}
            onClick={() => setSelectedEvent(task)}
            className={`bg-blue-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate text-center`}
          >
            {task.name}
            {handleBurndownBar()}
          </div>
        ))}
      </div>
    </div>
  );
}

