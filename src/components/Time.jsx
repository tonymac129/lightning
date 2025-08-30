import { useState, useEffect } from "react";

function Time() {
  const [time, setTime] = useState(new Date());
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="panel">
      <div className="time">
        {(time.getHours() % 12).toString().padStart(2, "0")}:{time.getMinutes().toString().padStart(2, "0")}:
        <span className="time-seconds">{time.getSeconds().toString().padStart(2, "0")}</span>{" "}
        {time.getHours() >= 12 ? "PM" : "AM"}
      </div>
      <div className="date">
        <div className="day">{days[time.getDay()].toUpperCase()}</div>
        {time.toLocaleDateString()}
      </div>
    </div>
  );
}

export default Time;
