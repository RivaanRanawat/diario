import styles from "./TodoList.module.css";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { db } from "../../services/firebase";
import { Delete } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import firebase from "firebase";
import SectionsSidebar from "../Home/Sidebar/SectionsSidebar";
import { useAuth } from "../../context/AuthContext";

function TodoList() {
  const [task, setTask] = useState(""); // to set the text input
  const [tasks, setTasks] = useState([]); // to store tasks
  const [isLoading, setIsLoading] = useState(false);
  const { diary, todoName } = useParams();
  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    db.collection("diaries")
      .doc(diary)
      .get()
      .then((snap) => {
        if (currentUser.uid === snap.data().createdBy) {
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
        } else {
          alert("You have no such diary!");
          history.push("/");
        }
      })
      .catch((err) => {
        alert("You have no such diary!");
      });
    setIsLoading(false);
  }, [diary, todoName]);

  async function handleSubmit() {
    if (task.trim() === "") {
      alert("Please Enter a Task");
    } else {
      try {
        await db
          .collection("diaries")
          .doc(diary)
          .collection("entries")
          .doc(todoName)
          .update({
            tasks: firebase.firestore.FieldValue.arrayUnion(task),
          });
        setTasks((arr) => [...arr, task]);
        setTask("");
      } catch (err) {
        alert(err.message);
      }
    }
  }

  async function deleteItem(item) {
    const index = tasks.findIndex((taskPar) => taskPar === item);
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
  }

  return !isLoading ? (
    <div>
      <SectionsSidebar diary={diary} />
      <div className={styles.todoContainer}>
        <div className={styles.newTodoTask}>
          <input
            type="text"
            placeholder="Task to be done.."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className={styles.addButton} onClick={handleSubmit}>
            Add
          </button>
        </div>
        <div className={styles.todoTasks}>
          {tasks.length !== 0 ? (
            tasks.map((taskPar, index) => (
              <div className={styles.todoTask} key={index}>
                <span className={styles.todoTaskName}>{taskPar}</span>
                <button
                  className={styles.deleteIcon}
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
