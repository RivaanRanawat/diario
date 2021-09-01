import React, { useState, useEffect, useMemo } from "react";
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
import styles from "../Home.module.css";

function ChaptersTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const { slug } = useParams();
  const history = useHistory();

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const createNewChapter = () => history.push(`/create-new-chapter/${slug}`);

  useEffect(() => {
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
      console.log(data);
    });
  }, []);

  const classes = useStyles();

  function handleChapterChange(rowName) {
    history.push(`/text-editor/${slug}/${rowName}`);
  }

  return !isLoading ? (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Sr No.</b>
              </TableCell>
              <TableCell align="center">
                <b>Chapter Name</b>
              </TableCell>
              <TableCell align="right">
                <b>Last Modified</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={row.name}
                onClick={() => handleChapterChange(row.name)}
                style={{ cursor: "pointer" }}
              >
                <TableCell align="left">
                {(i+1).toString()}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  {row.createdAt.toDate().toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div id={styles.mybutton}>
        <button className={styles.createDiary} onClick={createNewChapter}>
          Create New Chapter
        </button>
      </div>
    </div>
  ) : (
    <div>Loading..</div>
  );
}

export default ChaptersTable;
