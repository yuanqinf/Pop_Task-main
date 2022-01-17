import React, { useState, useContext, useEffect } from "react";
import { getMonth } from "../../util";
import CalendarHeader from "../..//components/EventViewComponents/CalendarHeader"
import Month from "../../components/EventViewComponents/Month";
import GlobalContext from "../../context/GlobalContext";
import EventModal from "../../components/EventViewComponents/EventModal";

export default function EventView() {
    const [currenMonth, setCurrentMonth] = useState(getMonth());
    const { monthIndex, showEventModal } = useContext(GlobalContext);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

    return (
        <React.Fragment>
            {showEventModal && <EventModal />}
            <div className="h-screen flex flex-col ">
                <CalendarHeader />
                <div className="flex flex-1 bg-primary bg-opacity-50 sm:rounded-lg">
                    <Month month={currenMonth} />
                </div>
            </div>
        </React.Fragment >
    )
}
