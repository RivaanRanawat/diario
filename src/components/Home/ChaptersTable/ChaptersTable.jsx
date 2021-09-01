import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { db, storage } from "../../../services/firebase";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styles from "../Home.module.css";
import { Button } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";

function ChaptersTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [uploading, setUploading] = useState(false);
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

  function handleInput(e) {
    const image = e.target.files[0];
    if (image == null) return;
    setUploading(true);
    const uploadTask = storage.ref(`/cover-images/${slug}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        console.log(snapShot);
      },
      (err) => {
        setUploading(false);
        alert(err.message);
      },
      () => {
        storage
          .ref("cover-images")
          .child(slug)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            db.collection("diaries")
              .doc(slug)
              .update({
                coverImage: fireBaseUrl,
              })
              .then(() => {
                setUploading(false);
                alert("Your Cover Page has been updated!")
              })
              .catch((err) => {
                setUploading(false);
                alert(err.message);
              });
          });
      }
    );
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
                <TableCell align="left">{(i + 1).toString()}</TableCell>
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
          CREATE NEW CHAPTER
        </button>
      </div>
      <form>
        <div id={styles.uploadPicButton}>
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            accept="image/png, image/jpeg"
            onInput={(e) => handleInput(e)}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="raised"
              component="span"
              startIcon={<CloudUpload />}
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: "10px",
              }}
            >
              {uploading ? "Uploading" : "Upload"}
            </Button>
          </label>
        </div>
      </form>
    </div>
  ) : (
    <div>Loading..</div>
  );
}

export default ChaptersTable;
