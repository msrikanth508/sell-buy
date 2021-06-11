import React, { useState } from "react";
import clsx from "clsx";
import {
  Typography,
  makeStyles,
  TextField,
  Grid,
  Paper,
  Button,
} from "@material-ui/core";
import Web3 from "web3";

import { UserContext } from "../Provider/UserProvider";
import { CoreContext } from "../Provider/CoreProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 30,
    marginBottom: 10,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    paddingTop: 20,
    "& > h6": {
      color: theme.palette.primary.main,
      paddingBottom: 10,
    },
    "& > button": {
      margin: 20,
    },
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

export default function Login() {
  const { onLogin } = React.useContext(UserContext);
  const { contracts, setToast } = React.useContext(CoreContext);
  const classes = useStyles();
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [loginAccount, setLoginAccount] = useState("");

  function handleUserInput(name) {
    return (event) => {
      switch (name) {
        case "name": {
          setName(event.target.value);
          return;
        }
        case "account": {
          setAccount(event.target.value);
          return;
        }
        case "loginAccount": {
          setLoginAccount(event.target.value);
          return;
        }
        default: {
        }
      }
    };
  }
  async function handleAccountSignup() {
    try {
      if (!Web3.utils.isAddress(account)) {
        setToast({
          message: "Enter valid address",
          type: "warning",
        });
      }
      await contracts.userContract.methods.createUser(name).send({
        from: account,
        gas: 3000000,
      });

      setName("");
      onLogin(name, account);
    } catch (e) {}
  }

  async function handleAccountLogin() {
    try {
      if (!Web3.utils.isAddress(loginAccount)) {
        setToast({
          message: "Enter valid address",
          type: "warning",
        });
      }

      const name = await contracts.userContract.methods
        .getUser(loginAccount)
        .call();
      if (name) {
        onLogin(name, loginAccount);
        setToast({
          message: "A new account has been created.",
          type: "success",
        });
      } else {
        setToast({
          message: "Account does't exist, signup now!",
          type: "warning",
        });
      }
    } catch (e) {
      setToast({
        message: "something went wrong",
        type: "warning",
      });
    }
  }

  return (
    <Grid
      container
      className={classes.root}
      spacing={3}
      direction="row"
      alignItems="center"
      justify="center"
    >
      <Grid item sm={12} xs={3} md={4}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Signup </Typography>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              label="Name"
              className={clsx(classes.margin, classes.textField)}
              onChange={handleUserInput("name")}
              value={name}
            />
            <TextField
              label="Public Address"
              className={clsx(classes.margin, classes.textField)}
              onChange={handleUserInput("account")}
              value={account}
            />
          </form>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAccountSignup}
          >
            Create Account
          </Button>
          <Typography variant="h6">or</Typography>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              label="Public Address"
              className={clsx(classes.margin, classes.textField)}
              onChange={handleUserInput("loginAccount")}
              value={loginAccount}
            />
          </form>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAccountLogin}
          >
            Login
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
