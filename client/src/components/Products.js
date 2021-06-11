import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Button,
  Box,
  makeStyles,
} from "@material-ui/core";

import { CoreContext } from "../Provider/CoreProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 30,
    marginBottom: 10,
  },
  cardRoot: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain",
  },
  actions: {
    justifyContent: "space-between",
    height: "52px",
  },
}));

export default function Products({ account }) {
  const classes = useStyles();
  const { contracts, web3, setToast } = React.useContext(CoreContext);
  const [items, setItems] = React.useState([]);

  async function fetchItems() {
    try {
      const results = await contracts.itemMangerContract.methods
        .getItems()
        .call();

      const items = results.map((result) => ({
        title: result.title,
        description: result.description,
        price: web3.utils.fromWei(result.price),
        seller: result.sellerName,
        sellerAccount: result.sellerAccount,
        id: result.id,
        sold: result.isSold,
        photoAddress: result.imageAddress,
        productAddress: result.productAddress,
      }));

      setItems(items);
    } catch (e) {
      console.error(e);
    }
  }

  async function buyItem(id) {
    try {
      const price = items[+id].price;
      const isSold = await contracts.itemMangerContract.methods
        .buyItem(id)
        .send({
          from: account,
          value: web3.utils.toWei(price),
          gas: 3000000,
        });

      if (isSold) {
        fetchItems();
      } else {
        setToast({
          message: "Failed to purchase the item.",
          type: "warning",
        });
      }
    } catch (e) {
      setToast({
        message: "Failed to purchase the item.",
        type: "warning",
      });
      console.error(e);
    }
  }

  React.useEffect(() => {
    if (account) {
      fetchItems();
    }
  }, [account]);

  if (items.length === 0) {
    return (
      <Box m={10} display="flex" justifyContent="center">
        <Typography variant="h5">
          No items exist, sell your own items 🤑.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container className={classes.root} spacing={3} direction="row">
      {items.map((item) => (
        <Grid item xs={12} xl={4} md={4} key={item.id}>
          <Card className={classes.cardRoot}>
            <CardHeader
              title={item.title}
              subheader={`Selling by ${item.seller}`}
            />
            <CardMedia
              className={classes.media}
              image={`https://ipfs.io/ipfs/${item.photoAddress}`}
              title={item.title}
            />
            <CardContent>
              <Typography color="textSecondary" component="h3">
                Description
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {item.description}
              </Typography>
              {/* <Box marginTop={2}>
                <Typography color="textSecondary" component="h3">
                  Product Address
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.productAddress}
                </Typography>
              </Box> */}
            </CardContent>
            <CardActions className={classes.actions}>
              <Typography component="h2" color="primary">
                Price: {item.price} ETH
              </Typography>
              {item.sold ? (
                <Button variant="contained" color="secondary">
                  Sold
                </Button>
              ) : item.sellerAccount !== account ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => buyItem(item.id)}
                >
                  Buy
                </Button>
              ) : null}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
