import React from 'react'

export default function Notification(props) {
    return (
        <div className="ml-5 mt-2 text-gray-700">{props.message}</div>
    )
}
