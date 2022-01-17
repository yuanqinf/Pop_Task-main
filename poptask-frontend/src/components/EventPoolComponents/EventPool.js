import React, { useContext } from 'react'
import EventModal from '../EventViewComponents/EventModal'
import GlobalContext from "../../context/GlobalContext";
import PoolHeader from './PoolHeader';
import PoolContent from './PoolContent';

export default function EventPool() {
    const { showEventModal } = useContext(GlobalContext);

    return (
        <React.Fragment>
            {showEventModal && <EventModal />}
            <div className="h-screen flex flex-col ">
                <PoolHeader />
                <PoolContent />
            </div>
        </React.Fragment>
    )
}
