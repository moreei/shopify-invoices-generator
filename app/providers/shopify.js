import Shopify from "shopify-api-node";
import { ShopifyCredentials } from "../config.js";

export default new Shopify({
  shopName: ShopifyCredentials.shopName,
  apiKey: ShopifyCredentials.apiKey,
  password: ShopifyCredentials.password,
});
