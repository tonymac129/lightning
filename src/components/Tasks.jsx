import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Tasks({ tasks, addTask, deleteTask }) {
  const [newTask, setNewTask] = useState("");

  return (
    <div className="widget task-widget">
      {tasks.length > 0 ? (
        <div className="task-items">
          <AnimatePresence layout>
            {tasks.map((task, i) => {
              return (
                <motion.div initial={{ x: 200 }} animate={{ x: 0 }} exit={{ x: 300 }} key={i} className="task-item" layout>
                  <img src="/lightning/icons/complete.svg" onClick={() => deleteTask(i)} />
                  {task}
                  <motion.img
                    whileHover={{ rotate: 20, scale: 1.2 }}
                    whileTap={{ rotate: 5, scale: 1.2 }}
                    src="/lightning/icons/trash.svg"
                    onClick={() => deleteTask(i)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="message">No tasks added</div>
      )}
      <form onSubmit={(e) => addTask(newTask, setNewTask, e)}>
        <input
          type="text"
          placeholder="Add new task"
          className="task-input"
          value={newTask}
          onInput={(e) => setNewTask(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Tasks;
