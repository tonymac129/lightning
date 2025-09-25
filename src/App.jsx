import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "./components/Chat";
import Time from "./components/Time";
import Weather from "./components/Weather";
import Shortcuts from "./components/Shortcuts";
import Tasks from "./components/Tasks";
import Note from "./components/Note";
import Timer from "./components/Timer";
import Modal from "./components/Modal";

function App() {
  const [command, setCommand] = useState("");
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("search");
  const [pressed, setPressed] = useState(false);
  const [quotes, setQuotes] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(Math.round(Math.random() * 30));
  const [newUser, setNewUser] = useState(false);
  const [name, setName] = useState(localStorage.getItem("lightning-name") ? localStorage.getItem("lightning-name") : "");
  const [tasks, setTasks] = useState(
    localStorage.getItem("lightning-tasks") ? JSON.parse(localStorage.getItem("lightning-tasks")) : []
  );
  const [modal, setModal] = useState(false);
  const [placeholder, setPlaceholder] = useState("Type /h for a list of commands!");
  const [newNote, setNewNote] = useState(
    localStorage.getItem("lightning-note") ? JSON.parse(localStorage.getItem("lightning-note")) : ""
  );
  const [timer, setTimer] = useState("Start");
  const [shortcuts, setShortcuts] = useState(
    localStorage.getItem("lightning-shortcuts") ? JSON.parse(localStorage.getItem("lightning-shortcuts")) : []
  );
  const [shortModal, setShortModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editInfo, setEditInfo] = useState();
  const [settingModal, setSettingModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("lightning-theme") ? localStorage.getItem("lightning-theme") : "");
  const [bg, setBg] = useState(localStorage.getItem("lightning-bg") ? localStorage.getItem("lightning-bg") : "");
  const [custom, setCustom] = useState(JSON.parse(localStorage.getItem("lightning-custom")) || []);
  const inputRef = useRef();

  const commands = [
    { a: "No command: search Google" },
    { a: "URL: open website" },
    { c: "c ", a: "send message to chatbot" },
    { c: "yt", a: "search YouTube" },
    { c: "gh", a: "search GitHub" },
    { c: "i ", a: "search IMDb" },
    { c: "g", a: "go to Gmail" },
    { c: "d", a: "go to Google Drive" },
    { c: "/t", a: "add task" },
    { c: "/tm", a: "start 5 minute timer" },
    { c: "/n", a: "add note" },
    { c: "/s1", a: "go to shortcut 1" },
    { c: "/s2", a: "go to shortcut 2 etc." },
    { c: "/s", a: "open Settings" },
    { c: "/h", a: "view all commands" },
  ];
  const placeholders = [
    "Type /h for a list of commands!",
    "Type /s to change the settings!",
    "Type /t to add a new task!",
    "Type /n to add a note!",
    "Type /tm to start a 5 minute timer!",
    "Click to see more hints!",
    "Click on the quote to refresh it!",
    "Click on the temperature to switch units!"
  ];

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
    if (!localStorage.getItem("lightning-name")) {
      setNewUser(true);
    } else {
      setNewUser(false);
    }

    return () => clearInterval(refreshPlaceholder);
  }, []);

  useEffect(() => inputRef.current.focus(), [inputRef]);

  useEffect(() => localStorage.setItem("lightning-name", name), [name]);

  useEffect(() => localStorage.setItem("lightning-tasks", JSON.stringify(tasks)), [tasks]);

  useEffect(() => localStorage.setItem("lightning-note", JSON.stringify(newNote)), [newNote]);

  useEffect(() => localStorage.setItem("lightning-shortcuts", JSON.stringify(shortcuts)), [shortcuts]);

  useEffect(() => localStorage.setItem("lightning-custom", JSON.stringify(custom)), [custom]);

  useEffect(() => {
    if (theme) {
      document.body.className = "";
      document.body.classList.add(theme);
      localStorage.setItem("lightning-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (bg) {
      document.body.style.backgroundImage = `linear-gradient(var(--modal-bg),var(--modal-bg)), url(${bg})`;
      localStorage.setItem("lightning-bg", bg);
    } else {
      document.body.style.background = "var(--body-bg)";
    }
  }, [bg]);

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
    } else if (command === "g") {
      window.open(`https://gmail.com`, "_self");
    } else if (command === "d") {
      window.open(`https://drive.google.com`, "_self");
    } else if (command.slice(0, 3) === "/tm") {
      setTimer("Pause");
    } else if (shortHand === "/t") {
      handleNewTask(command.slice(2));
    } else if (shortHand === "/n") {
      setNewNote(command.slice(2));
    } else if (shortHand === "/h") {
      setModal(true);
    } else if (shortHand === "/s" && command.length == 2) {
      setSettingModal(true);
    } else if (shortHand === "/s" && command.length > 2) {
      window.open(shortcuts[command.slice(2, 3) - 1].url, "_self");
    } else if (
      command.includes("http") ||
      command.includes("www.") ||
      command.includes(".co") ||
      command.includes(".org") ||
      command.includes(".net") ||
      command.includes("edu") ||
      command.includes(".gov")
    ) {
      if (command.includes("https://") || command.includes("http://")) {
        window.open(command, "_self");
      } else window.open("https://" + command, "_self");
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
      <title>{`${name.length>0?name+"'s":""} Lightning`}</title>
      <AnimatePresence>
        {modal && (
          <Modal
            title="Lightning Commands"
            description="Always put the command in the front with the query behind it, separated by a space. Ex: yt cat videos"
            content={commands}
            setModal={setModal}
          />
        )}
        {newUser && (
          <Modal
            title="Welcome to Lightning!"
            description="Get to where you want, lightning fast. Lightning is a highly customizable browser new tab dashboard with powerful commands and functional widgets!"
            welcome={true}
            setName={setName}
            setNewUser={setNewUser}
          />
        )}
        {shortModal && <Modal title="Add Shortcut" setModal={setShortModal} shortcuts={shortcuts} setShortcuts={setShortcuts} />}
        {editModal && (
          <Modal
            title="Edit Shortcut"
            setModal={setEditModal}
            shortcuts={shortcuts}
            setShortcuts={setShortcuts}
            editInfo={editInfo}
          />
        )}
        {settingModal && (
          <Modal
            title="Settings"
            setModal={setSettingModal}
            name={name}
            setName={setName}
            theme={theme}
            setTheme={setTheme}
            setBg={setBg}
            custom={custom}
            setCustom={setCustom}
          />
        )}
      </AnimatePresence>
      <div className="info">
        <Time className="info-widget" />
        <div className="hero info-widget">
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
        <Weather className="info-widget" />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand();
        }}
        onClick={() => {
          let index = (placeholders.indexOf(placeholder) + 1) % placeholders.length;
          setPlaceholder(placeholders[index]);
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
      {!custom.includes(0) && (
        <Shortcuts
          shortcuts={shortcuts}
          setShortcuts={setShortcuts}
          setShortModal={setShortModal}
          setEditInfo={setEditInfo}
          setEditModal={setEditModal}
        />
      )}
      <div className="widgets">
        {!custom.includes(1) && <Chat prompt={prompt} mode={mode} />}
        {!custom.includes(2) && <Tasks tasks={tasks} setTasks={setTasks} addTask={handleNewTask} deleteTask={handleDeleteTask} />}
        {!custom.includes(3) && <Note newNote={newNote} setNewNote={setNewNote} />}
        {!custom.includes(4) && <Timer timer={timer} setTimer={setTimer} />}
      </div>
    </motion.div>
  );
}

export default App;
