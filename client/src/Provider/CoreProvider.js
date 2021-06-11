import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";

import getWeb3 from "../utils/getWeb3";
import ItemMangerContract from "../contracts/ItemManager.json";
import UserContract from "../contracts/Users.json";
import Toast from "../components/Toast";
import Layout from "../components/Header";

export const CoreContext = React.createContext({});

export default function CoreProvider({ children }) {
  const [contracts, setContract] = useState({});
  const [accounts, setAccounts] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isCoreLoaded, setCoreLoaded] = useState(false);
  const [isCoreError, setCoreError] = useState(false);
  // toast config
  const [toast, setToast] = useState(null);
  
  function handleToast() {
    setToast(null);
  }

  React.useEffect(() => {
    async function setup() {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();

        const userContract = new web3.eth.Contract(
          UserContract.abi,
          UserContract.networks[networkId]?.address
        );

        const itemMangerContract = new web3.eth.Contract(
          ItemMangerContract.abi,
          ItemMangerContract.networks[networkId]?.address
        );
         
        setContract({
          userContract,
          itemMangerContract,
        });
        
        setAccounts(accounts);
        setWeb3(web3);
        setCoreLoaded(true);
        setCoreError(false);
      } catch (error) {
        setCoreError(true);
        setCoreLoaded(true);
        console.error(error);
      }
    }
    setup();
  });

  return (
    <CoreContext.Provider
      value={{
        contracts,
        accounts,
        web3,
        isCoreError,
        isCoreLoaded,
        setToast,
      }}
    >
      {!isCoreLoaded && (
        <>
          <Layout />
          <Box m={10} display="flex" justifyContent="center">
            <Typography variant="h5">Loading...</Typography>
          </Box>
        </>
      )}
      {isCoreError && (
        <>
          <Layout />
          <Box m={10}>
            <p>
              Failed to load web3, accounts, or contract, check console for
              details. To run this app, you must have a crypto wallet like{" "}
              <a href="https://metamask.io/">metamask</a>.
            </p>
          </Box>
        </>
      )}

      {isCoreLoaded && !isCoreError && children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToast}
        />
      )}
    </CoreContext.Provider>
  );
}
