import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { db } from "../../../services/firebase";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { CircularProgress } from "@material-ui/core";
import Sidebar from "../Sidebar/Sidebar";
import { Delete } from "@material-ui/icons";
import {useAuth} from "../../../context/AuthContext";

function ChaptersTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const { slug } = useParams();
  const history = useHistory();
  const {currentUser} = useAuth();

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  useEffect(() => {
    db.collection("diaries").doc(slug).get().then((snap) => {
      if(currentUser.uid !== snap.data().createdBy) {
        alert("You have no such diary!");
        history.push("/");
      }
    });
    async function fetchChapters() {
      try {
        setIsLoading(true);
        const querySnapshot = await db
          .collection("diaries")
          .doc(slug)
          .collection("entries")
          .orderBy("createdAt", "asc")
          .get();
        querySnapshot.docs.forEach((querySnapshot) => {
          setData((arr) => [...arr, querySnapshot.data()]);
        });
      } catch (err) {
        setIsLoading(false);
        alert(err.message);
      }
    }
    fetchChapters().then(() => {
      setIsLoading(false);
    });
  }, []);

  const classes = useStyles();

  function handleChapterChange(rowName, rowType) {
    if (!rowType) {
      history.push(`/text-editor/${slug}/${rowName}`);
    } else {
      history.push(`/todo-list/${slug}/${rowName}`);
    }
  }

  async function handleChapterDelete(rowName, index) {
    try {
      await db
        .collection("diaries")
        .doc(slug)
        .collection("entries")
        .doc(rowName)
        .delete();
      data.splice(index, 1);
      setData((prevArr) => [...prevArr]);
    } catch (err) {
      alert(err.message);
    }
  }

  return !isLoading ? (
    <div>
      <Sidebar slug={slug} />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Sr No.</b>
              </TableCell>
              <TableCell align="left">
                <b>Name</b>
              </TableCell>
              <TableCell align="center">
                <b>Type</b>
              </TableCell>
              <TableCell align="center">
                <b>Last Modified</b>
              </TableCell>
              <TableCell align="center">
                <b>Delete</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={row.name} style={{ cursor: "pointer" }}>
                <TableCell
                  align="left"
                  onClick={() => handleChapterChange(row.name, row.type)}
                >
                  {(i + 1).toString()}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  onClick={() => handleChapterChange(row.name, row.type)}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  onClick={() => handleChapterChange(row.name, row.type)}
                >
                  {!row.type ? "Chapter" : row.type}
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleChapterChange(row.name, row.type)}
                >
                  {row.createdAt.toDate().toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Delete
                    style={{ color: "red" }}
                    onClick={() => handleChapterDelete(row.name, i)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : (
    <CircularProgress />
  );
}

export default ChaptersTable;
