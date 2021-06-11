import React from "react";

import Login from "./Login";
import { UserContext } from "../Provider/UserProvider";
import Products from "./Products";

export default function Home() {
  const { account } = React.useContext(UserContext);

  if (!account) {
    return <Login />;
  }

  return <Products account={account} />;
}
