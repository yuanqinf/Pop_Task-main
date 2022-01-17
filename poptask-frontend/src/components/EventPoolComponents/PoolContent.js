import React, { useState, useEffect, useContext, useRef } from 'react'
import GlobalContext from '../../context/GlobalContext';
import EventCard from './EventCard';

export default function PoolContent() {
    const { currentGroup, showEventModal } = useContext(GlobalContext);
    const [currentUsercurrentGroupUnpoppedEvents, setCurrentUsercurrentGroupUnpoppedEvents] = useState([])
    const [delay, setDelay] = useState(500);

    const token = `Token ${localStorage.getItem("Token")}`;

    function getTasks() {
        console.log("get task!");
        const axios = require('axios');
        return axios.get('/tasks/',{
            headers: {
              'Authorization': token
            }
          }).then(function ({data}) {
                // handle success
                return (data);
            })
    }

    async function fetchTaskInfo(){
        console.log("fetchTaskInfo");
        await getTasks().then((tasks) => {
            const filteredTasks = (tasks.sort((a, b) => a.deadline - b.deadline).filter((evt) => (evt.assigned_to === null && evt.group === currentGroup)))
            setCurrentUsercurrentGroupUnpoppedEvents(filteredTasks);
        });
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();
        // Remember the latest function.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
    }

    useInterval(() => {
        fetchTaskInfo();
    }, delay);

    useEffect(() => {
        fetchTaskInfo();
    }, [currentGroup, showEventModal]);

    return (
        <div className="overflow-auto h-3/4 grid grid-cols-3 bg-blue-300 bg-opacity-50 sm:rounded-lg">
            {currentUsercurrentGroupUnpoppedEvents.map((evt, idx) =>
                <EventCard task={evt} key={evt.id} />
            )}
        </div>
    )
}