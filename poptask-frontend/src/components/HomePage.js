import React, { useContext, useEffect } from 'react'
import EventView from "./EventViewComponents/EventView";
import MainHeader from "./MainHeader";
import MainSideNav from "./MainSideNav";
import GlobalContext from "../context/GlobalContext";
import EventPool from './EventPoolComponents/EventPool';
import LeaderboardView from './LeaderboardComponents/LeaderboardView';

export default function HomePage() {
  const { Token, segmentSelected } = useContext(GlobalContext);

  return ( 
    <div>
      {
        <React.Fragment>
          <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pt-3 pl-3 pb-3 ">
            <MainHeader />
          </div>
          <div className={`flex bg-${segmentSelected === "TaskView" ? "blue" : segmentSelected === "TaskPool" ? "purple" : "pink"}-100`}>
            <MainSideNav />
            {segmentSelected === "TaskPool" ?
              <div className="flex-auto px-12 py-2" >
                <EventPool />
              </div>
              :
              segmentSelected === "TaskView" ?
                <div className="flex-auto px-12 py-2" >
                  <EventView />
                </div>
                :
                <div className="flex-auto px-12 py-2" >
                  <LeaderboardView />
                </div>
            }
          </div>
        </React.Fragment>
      }
    </div >
  );
}