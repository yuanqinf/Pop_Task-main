import React from 'react'
import CreateEventButton from "./CreateEventButton";

export default function PoolHeader() {
    return (
        <header className="px-4 py-2 flex items-center">
            <h1 className="mr-10 text-xl text-gray-500 fond-bold">
                Task Pool
            </h1>
            <CreateEventButton />
      </header>
    )
}
