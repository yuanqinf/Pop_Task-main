import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";


async function postEvent(payload) {

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
    "Authorization": "Token 78556e40349ed503f2739a7a3c999e38e7223a55" },
    body: JSON.stringify({ 
      "created_by": 1,
      "assigned_by": 2,
      "assigned_to": 3,
      "name": payload['title'],
      "description": payload['description'],
      "score": payload['score'],
      "deadline": payload['deadline'],
      "done_at": "2021-12-12 13:13:13" })
      // TODO Add Task
  };

  const response = await fetch('http://localhost:8000/tasks/', requestOptions)
  console.log(response)
  
}

async function updateEvent(payload) {

  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',
    "Authorization": "Token 78556e40349ed503f2739a7a3c999e38e7223a55" },
    body: JSON.stringify({ 
      "created_by": 1,
      "assigned_by": 2,
      "assigned_to": 3,
      "name": payload['title'],
      "description": payload['description'],
      "score": payload['score'],
      "deadline": payload['deadline'],
      "done_at": "2021-12-12 13:13:13" })
      // TODO Edit Task
  };

  const response = await fetch('http://localhost:8000/tasks/' + payload.id.toString(), requestOptions)
  console.log(response)
  
}

async function deleteEvent(payload) {

  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json',
    "Authorization": "Token 78556e40349ed503f2739a7a3c999e38e7223a55" },
  };

  const response = await fetch('http://localhost:8000/tasks/' + payload.id.toString(), requestOptions)
  console.log(response)
  // TODO Remove Task when deleted or done
}

async function getEvent() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
    "Authorization": "Token 78556e40349ed503f2739a7a3c999e38e7223a55" }
  };

  const response = await fetch('http://localhost:8000/tasks/', requestOptions)
  console.log(response)
  //TODO Get all tasks
  
}

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      postEvent(payload);
      getEvent();
      return [...state, payload];
    case "update":
      updateEvent(payload);
      return state.map((evt) =>
        evt.id === payload.id ? payload : evt
      );
    case "delete":
      deleteEvent(payload);
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}

function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [segmentSelected, setSegmentSelected] = useState("");
  const [currentGroup, setCurrentGroup] = useState("");
  const [allGroupsInfo, setAllGroupsInfo] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState();

  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );


  const [groupsRankInfo, setGroupsRankInfo] = useState([]);

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map(
        (label) => {
          const currentLabel = prevLabels.find(
            (lbl) => lbl.label === label
          );
          return {
            label,
            checked: currentLabel ? currentLabel.checked : true,
          };
        }
      );
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label) {
    setLabels(
      labels.map((lbl) => (lbl.label === label.label ? label : lbl))
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        segmentSelected, 
        setSegmentSelected,
        currentGroup,
        setCurrentGroup,
        currentUser, 
        setCurrentUser,
        allGroupsInfo, 
        setAllGroupsInfo,
        allUsers,
        setAllUsers,

        groupsRankInfo, 
        setGroupsRankInfo,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
