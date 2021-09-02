import styles from "./TodoList.module.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { db } from "../../services/firebase";
import { Delete } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import firebase from "firebase";
import Sidebar from "../Home/Sidebar/Sidebar";
import SectionsSidebar from "../Home/Sidebar/SectionsSidebar";

function TodoList() {
  const [task, setTask] = useState(""); // to set the text input
  const [tasks, setTasks] = useState([]); // to store tasks
  const [isLoading, setIsLoading] = useState(false);
  const { diary, todoName } = useParams();

  useEffect(() => {
    setIsLoading(true);
    db.collection("diaries")
      .doc(diary)
      .collection("entries")
      .doc(todoName)
      .get()
      .then((snapshot) => {
        setTasks(snapshot.data().tasks);
      })
      .catch((err) => {
        alert(err.message);
      });
    setIsLoading(false);
  }, []);

  async function handleSubmit() {
    try {
      if (task.trim() === "") {
        return alert("Please Enter a Task");
      }
      setTasks((arr) => [...arr, task]);
      setTask("");
      await db
        .collection("diaries")
        .doc(diary)
        .collection("entries")
        .doc(todoName)
        .update({
          tasks: firebase.firestore.FieldValue.arrayUnion(task),
        });
    } catch (err) {
      alert(err.message);
    }

    console.log(tasks.length);
  }

  async function deleteItem(item) {
    const index = tasks.findIndex((taskPar) => taskPar == item);
    try {
      tasks.splice(index, 1);
      setTasks((prevArr) => [...prevArr]);
      await db
        .collection("diaries")
        .doc(diary)
        .collection("entries")
        .doc(todoName)
        .update({
          tasks: firebase.firestore.FieldValue.arrayRemove(item),
        });
    } catch (err) {
      alert(err.message);
    }
    console.log(tasks.length);
  }

  return !isLoading ? (
    <div>
      <SectionsSidebar diary={diary} />
      <div class={styles.container}>
        <div id={styles.newtask}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task to be done.."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button id={styles.push} onClick={handleSubmit}>
              Add
            </button>
          </form>
        </div>
        <div id={styles.tasks}>
          {tasks.length !== 0 ? (
            tasks.map((taskPar) => (
              <div className={styles.task}>
                <span id={styles.taskname}>{taskPar}</span>
                <button
                  className={styles.delete}
                  onClick={() => deleteItem(taskPar)}
                >
                  <Delete />
                </button>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <CircularProgress />
  );
}

export default TodoList;
