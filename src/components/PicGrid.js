
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { storage, app } from '@firebase/app';
import '@firebase/storage';
import { ref, listAll, getDownloadURL } from "firebase/storage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  image: {
    width: 128,
    height: 128,
  },
}));

function PicGrid(props) {
  const { storage } = props;
  const [photos, setPhotos] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const storageRef = ref(storage, `photos`);
    const imageRefs = [];
    listAll(ref(storage, storageRef)).then((result) => {
    // storageRef.listAll().then((result) => {
      result.items.forEach((imageRef) => {
        imageRefs.push(imageRef);
      });
      Promise.all(imageRefs.map((imageRef) => getDownloadURL(imageRef))).then((urls) => {
        setPhotos(urls);
      });
    });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={4} key={photo}>
            <Paper className={classes.paper}>
              <img src={photo} alt="" className={classes.image} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default PicGrid;