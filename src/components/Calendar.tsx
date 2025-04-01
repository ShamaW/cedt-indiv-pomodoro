import { gapi } from 'gapi-script';
import React, { useEffect, useRef, useState } from 'react';

console.log("Current Origin:", window.location.origin);

const Calendar = () => {
    return (
        <div className="calendar">
            <h1>Today's Events</h1>
        </div>
    );
};

export default Calendar;
