import React from "react";
import { BrowserRouter as Link } from "react-router-dom";
import { makeStyles, Typography, AppBar, Toolbar } from "@material-ui/core";

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
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" className={classes.logo}>
          <Link to="/">Sell{"&"}Buy</Link>
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  );
}
