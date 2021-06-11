import React from "react";
import { useHistory } from "react-router-dom";
import { CoreContext } from "./CoreProvider";

export const UserContext = React.createContext({
  name: "",
  account: "",
});

export default function UserProvider({ children }) {
  const { contracts, setToast } = React.useContext(CoreContext);

  const [userDetails, setUserDetails] = React.useState({
      name: null,
      account: null,
    }
  );
  const history = useHistory();
  function isValidUser() {
    return userDetails.account?.lenght > 0;
  }

  function getUserAccount() {
    return userDetails.account;
  }

  function onLogin(name, account) {
    const user = {
      name,
      account,
    };
    setUserDetails(user);
    localStorage.setItem("user", JSON.stringify(user));
  }


  function onLogout() {
    setUserDetails({
      name: null,
      account: null,
    });
    localStorage.removeItem("user");

    // //redirect to home page
    history.push("/");
  }

  React.useEffect(() => {
    const { account } =  JSON.parse(localStorage.getItem("user") || null) || {
      name: null,
      account: null,
    };

    async function fetchDetails() {
      const name = await contracts.userContract.methods
      .getUser(account)
      .call();

      if (name) {
        onLogin(name, account);
      } else {
        localStorage.removeItem("user");
        setToast({
          message: "Account does't exist, signup now!",
          type: "warning",
        });
      }
    }
    if(account) {
      fetchDetails();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...userDetails,
        onLogin,
        onLogout,
        isValidUser,
        getUserAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
