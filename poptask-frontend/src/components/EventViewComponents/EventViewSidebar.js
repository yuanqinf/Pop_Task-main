import React from "react";
// import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";
export default function EventViewSidebar() {
  return (
    <aside className="border p-3 w-64">
      {/* <SmallCalendar /> */}
      <Labels />
    </aside>
  );
}
