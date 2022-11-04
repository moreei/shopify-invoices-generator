"use strict";

import moment from "moment";
import Shop from "../providers/shopify.js";
import Order from "../models/order.model.js";
import { createInvoice } from "../templates/shopifyInvoice.js";
import { Path } from "../config.js";

const destinationPath = Path.invoicesDestinationPath;
const separator = "------------------------";
const waitingTimeMilliseconds = 3000;
const perLap = 200;

let since_id = 0;
//since_id = 378801455155; // #1001
since_id = 800419774515; // #4670 (4671 1er EURL)

let firstAction = () => {
  loadOrdersShopify();
};

let loadOrdersShopify = () => {
  let params = { since_id: since_id, status: "any", limit: perLap };

  Shop.order
    .list(params)
    .then((shopifyOrders) => {
      for (let shopifyOrder of shopifyOrders) {
        let order = new Order(shopifyOrder);

        since_id = order.getId();

        if (!order.billing_address || !order.shipping_address) {
          console.log("NOP", order.getName());
          continue;
        }

        // On vire les commandes offertes
        if (Number(order.total_price) == 0) {
          console.log("Free Order", order.getName());
          continue;
        }

        // On vire les paiement en carte cadeau
        if (order.gateway == "gift_card") {
          console.log("Gift Card", order.getName());
          continue;
        }

        console.log(
          "Creation Invoice:",
          order.getName(),
          order.getInvoiceNumberCustom(),
          order.getId(),
          order.getDateInvoice()
        );

        createOrderInvoice(order);
      }

      console.log(separator);
      console.log(
        `We wait ${waitingTimeMilliseconds} milliseconds for new call to Shopify API ...`
      );
      console.log(separator);

      setTimeout(function () {
        loadOrdersShopify();
      }, waitingTimeMilliseconds);
    })
    .catch((err) => console.error(err));
};

/**
 * @param {Order} order
 */
let createOrderInvoice = (order) => {
  let fileName = `${moment(order.getCreatedAt()).format(
    "YYYYMMDD"
  )}-${order.getInvoiceNumberCustom()}.pdf`;
  createInvoice(order, `${destinationPath}/${fileName}`);
};

firstAction();
