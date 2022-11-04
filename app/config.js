import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const { SHOPIFY_SHOP_NAME, SHOPIFY_API_KEY, SHOPIFY_API_PASSWORD } =
  process.env;

export const ShopifyCredentials = {
  shopName: SHOPIFY_SHOP_NAME,
  apiKey: SHOPIFY_API_KEY,
  password: SHOPIFY_API_PASSWORD,
};

export const invoiceSettings = {
  logoFile: "assets/images/aeon-logo.png",
  fontRegular: "assets/fonts/Cabin/Cabin-Medium.ttf", // https://pdfkit.org/docs/text.html#fonts
  fontBold: "assets/fonts/Cabin/Cabin-Bold.ttf",
  textColor: "#303030",
  accentColor: "#ef7c8e",
  lightGrey: "#eaeaea",
  lineColor: "#9e9e9e",
  white: "#ffffff",

  // Emettor Company
  emettor: {
    companyName: "RPP COM",
    line1: "8 Allée Aimé Césaire",
    line2: "94450 Limeil Brevannes",
    line3: "France",
    line4: "SIREN: 848940615",
  },

  footerText: "RONPONPON.COM - CONTACT@RONPONPON.COM",
};

export const Path = {
  // Créer le dossier avant de lancer le script
  invoicesDestinationPath: "/Users/andre/Invoices",
};
