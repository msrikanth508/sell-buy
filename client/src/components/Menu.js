import React from "react";
import { Link } from "react-router-dom";
import { makeStyles, Typography, Button } from "@material-ui/core";

import { UserContext } from "../Provider/UserProvider";

const useStyles = makeStyles((theme) => ({
  logo: {
    "& > a": {
      color: "#fff",
      textDecoration: "none",
    },
  },
  menu: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
    "& > a": {
      color: "#fff",
    },
  },
}));

export default function Header() {
  const classes = useStyles();
  const { account, name, onLogout } = React.useContext(UserContext);

  return (
    <>
      {account && (
        <>
          <Typography className={classes.menu}>
            <Link to="/">Home</Link>
            <Link to="/sell">Sell</Link>
          </Typography>
          Hi, {name}{" "}
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </>
      )}
    </>
  );
}
