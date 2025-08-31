import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "./components/Chat";
import Time from "./components/Time";
import Weather from "./components/Weather";
import Tasks from "./components/Tasks";
import Modal from "./components/Modal";

function App() {
  const [command, setCommand] = useState("");
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("search");
  const [pressed, setPressed] = useState(false);
  const [quotes, setQuotes] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [name, setName] = useState(localStorage.getItem("lightning-name") ? localStorage.getItem("lightning-name") : "User");
  //TODO: add name setting system
  const [tasks, setTasks] = useState(
    localStorage.getItem("lightning-tasks") ? JSON.parse(localStorage.getItem("lightning-tasks")) : []
  );
  const [modal, setModal] = useState(false);
  const [placeholder, setPlaceholder] = useState("Type /help for a list of commands!");
  const inputRef = useRef();

  const commands = [
    { a: "No command: search Google" },
    { c: "c ", a: "send message to chatbot" },
    { c: "yt", a: "search YouTube" },
    { c: "gh", a: "search GitHub" },
    { c: "i ", a: "search IMDb" },
    { c: "g", a: "go to Gmail" },
    { c: "d", a: "go to Google Drive" },
    { c: "/t", a: "add task" },
    { c: "/help", a: "view all commands" },
  ];
  const placeholders = ["Type /help for a list of commands!", "Type /t to add a new task!", "sdafsadfsdaf", "aerhergeag"];

  useEffect(() => {
    async function getQuote() {
      try {
        const response = await fetch("https://dummyjson.com/quotes");
        const data = await response.json();
        setQuotes(data.quotes);
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    }
    getQuote();
    let placeholderIndex = 0;
    const refreshPlaceholder = setInterval(() => {
      setPlaceholder(placeholders[placeholderIndex % placeholders.length]);
      placeholderIndex++;
    }, 5000);

    return () => clearInterval(refreshPlaceholder);
  }, []);

  useEffect(() => inputRef.current.focus(), [inputRef]);

  useEffect(() => localStorage.setItem("lightning-tasks", JSON.stringify(tasks)), [tasks]);

  useEffect(() => {
    if (command.length > 0) {
      setPressed(true);
    }
    const timeout = setTimeout(() => {
      setPressed(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [command]);

  function handleCommand() {
    let shortHand = command.slice(0, 2);
    if (shortHand === "c ") {
      setMode("chat");
      setPrompt(command.slice(2));
    } else if (shortHand === "yt") {
      window.open(
        command.length == 2 ? "https://youtube.com" : `https://www.youtube.com/results?search_query=${command.slice(3)}`,
        "_self"
      );
    } else if (shortHand === "gh") {
      window.open(`https://github.com/search?s=stars&q=${command.slice(3)}`, "_self");
    } else if (shortHand === "i ") {
      window.open(`https://www.imdb.com/find/?q=${command.slice(2)}`, "_self");
    } else if (shortHand === "g ") {
      window.open(`https://gmail.com`, "_self");
    } else if (shortHand === "d ") {
      window.open(`https://drive.google.com`, "_self");
    } else if (shortHand === "/t") {
      handleNewTask(command.slice(2));
    } else if (command.slice(0, 5) === "/help") {
      setModal(true);
    } else {
      window.open(`https://www.google.com/search?q=${command}`, "_self");
    }
    setCommand("");
  }

  function handleNewTask(newTask, setNewTask = null, e = null) {
    e?.preventDefault();
    setTasks([newTask, ...tasks]);
    if (setNewTask) setNewTask("");
  }

  function handleDeleteTask(i) {
    let ogTasks = [...tasks];
    ogTasks.splice(i, 1);
    setTasks(ogTasks);
  }

  return (
    <motion.div initial={{ y: 100, opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} className="wrap">
      <AnimatePresence>
        {modal && (
          <Modal
            title="Lightning Commands"
            description="Always put the command in the front with the query behind it, separated by a space. Ex: yt cat videos"
            content={commands}
            setModal={setModal}
          />
        )}
      </AnimatePresence>
      <div className="info">
        <Time />
        <div className="hero">
          <h1 className="hero-title">Welcome back, {name}!</h1>
          <p className="hero-quote" onClick={() => setQuoteIndex((quoteIndex + 1) % quotes.length)}>
            {quotes.length > 0 ? (
              <>
                "{quotes[quoteIndex]?.quote}" - {quotes[quoteIndex]?.author}
              </>
            ) : (
              "Fetching quote..."
            )}
          </p>
        </div>
        <Weather />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand();
        }}
        className={`command-bar  ${pressed ? "typing" : ""}`}
      >
        <input
          type="text"
          value={command}
          onInput={(e) => setCommand(e.target.value)}
          placeholder={placeholder}
          ref={inputRef}
          className="command-input"
        />
        <motion.button type="submit" className="command-icon" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <img src="/lightning/icons/return.svg" />
        </motion.button>
      </form>
      <div className="widgets">
        <Chat prompt={prompt} mode={mode} />
        <Tasks tasks={tasks} setTasks={setTasks} addTask={handleNewTask} deleteTask={handleDeleteTask} />
      </div>
    </motion.div>
  );
}

export default App;
