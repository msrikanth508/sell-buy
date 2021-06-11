import React, { useState } from "react";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Typography,
  TextField,
  Grid,
  Paper,
  Button,
  Box,
  InputAdornment,
} from "@material-ui/core";

import ipfs from "../utils/ipfs";
import { UserContext } from "../Provider/UserProvider";
import { CoreContext } from "../Provider/CoreProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 30,
    marginBottom: 10,
  },
  paper: {
    height: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    paddingTop: 20,
    "& > button": {},
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "90%",
  },
  form: {
    width: "100%",
  },
}));

export default function Sell() {
  const classes = useStyles();
  const { contracts, web3, setToast } = React.useContext(CoreContext);
  const { account, name } = React.useContext(UserContext);
  const [itemDetails, setItemDetails] = useState({
    title: "",
    description: "",
    price: "",
  });
  const history = useHistory();
  const [fileAddress, setFileAddress] = React.useState(
    ""
  );

  async function handleSell() {
    try {
      const { title, description, price } = itemDetails;
      const itemAddress = await contracts.itemMangerContract.methods
        .createItem(
          title,
          description,
          web3.utils.toWei(price),
          name,
          fileAddress
        )
        .send({
          from: account,
          gas: 3000000,
        });

      if (itemAddress) {
        setToast({
          message: "Item has been created.",
          type: "success",
        });

        // redirect to home page
        history.push("/");
      } else {
        setToast({
          message: "failed to create an item, try again!",
          type: "warning",
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleUserInput(name) {
    return (event) => {
      switch (name) {
        case "title": {
          setItemDetails({
            ...itemDetails,
            title: event.target.value,
          });
          return;
        }
        case "description": {
          setItemDetails({
            ...itemDetails,
            description: event.target.value,
          });
          return;
        }
        case "price": {
          setItemDetails({
            ...itemDetails,
            price: event.target.value,
          });
          return;
        }
        default: {
        }
      }
    };
  }

  function onFileCapture(event) {
    event.preventDefault();
    try {
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadend = async () => {
        const buffer = Buffer(reader.result);

        const { cid } = await ipfs.add(buffer);
        const hash = cid;
        setFileAddress(hash.toString());
      };
    } catch (e) {
      console.log(e);
      setToast({
        message: "failed to upload image to ipfs, try again!",
        type: "warning",
      });
    }
  }

  React.useEffect(() => {
    if (!account) {
      // redirect to home page
      history.push("/");
    }
  }, [account]);
  
  return (
    <Grid
      container
      className={classes.root}
      spacing={3}
      direction="row"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} md={5} xl={5}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Sell</Typography>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              className={clsx(classes.margin, classes.textField)}
              label="Title"
              placeholder="Item name"
              fullWidth
              margin="normal"
              onChange={handleUserInput("title")}
              InputLabelProps={{
                shrink: true,
              }}
              value={itemDetails.title}
            />
            <TextField
              className={clsx(classes.margin, classes.textField)}
              label="Desciption"
              placeholder="Say something about your item"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={itemDetails.description}
              onChange={handleUserInput("description")}
            />
            <TextField
              className={clsx(classes.margin, classes.textField)}
              label="Price"
              placeholder="0.1"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">ETH</InputAdornment>
                ),
              }}
              value={itemDetails.price}
              onChange={handleUserInput("price")}
            />
            <Box display="flex" margin={1}>
              <Typography variant="p" marginRight={1} color="textSecondary">
                Photo
              </Typography>
              <input
                type="file"
                onChange={onFileCapture}
                accept="image/heic, image/png, image/jpeg, image/webp"
                multiple={false}
                title=""
                style={{
                  marginLeft: "12px",
                }}
              />
            </Box>

            <Box
              display="flex"
              alignContent="center"
              justifyContent="center"
              marginTop={2}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSell}
                disabled={fileAddress.length === 0}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}
