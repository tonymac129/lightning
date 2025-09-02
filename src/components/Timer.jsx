import { useEffect, useState } from "react";

function Timer({ timer, setTimer }) {
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer === "Pause") {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timer]);

  useEffect(() => {
    if (countdown == 0) setTimer("Start");
  }, [countdown]);

  function handleTimer() {
    if (timer == "Start") {
      setTimer("Pause");
      setCountdown(300);
    } else if (timer == "Pause") {
      setTimer("Resume");
    } else if (timer == "Resume") {
      setTimer("Pause");
    } else {
      setTimer("Start");
    }
  }

  return (
    <div className="widget timer-widget">
      <div className="timer">
        {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, 0)}
      </div>
      <div className="indicator-wrap">
        <div className="timer-indicator" style={{ width: countdown / 3 + "%" }}></div>
      </div>
      <button className="timer-btn" onClick={handleTimer}>
        {timer}
      </button>
    </div>
  );
}

export default Timer;
