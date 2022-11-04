"use strict";

import { createWriteStream } from "fs";
import PDFDocument from "pdfkit";
import Order from "../models/order.model.js";
import { invoiceSettings } from "../config.js";

// Logo
const logoFile = invoiceSettings.logoFile;

// Fonts
const fontRegular = invoiceSettings.fontRegular;
const fontBold = invoiceSettings.fontBold;

// Colors
const textColor = invoiceSettings.textColor;
const accentColor = invoiceSettings.accentColor;
const lightGrey = invoiceSettings.lightGrey;
const lineColor = invoiceSettings.lineColor;
const white = invoiceSettings.white;

// Margins & Sizes
const defaultMargin = 36;
const sizeLine = 559;
const rowEnd = sizeLine;

const leftPartCenter = 170;
const rightPart = 320;
const rightPartCenter = 440;

const addressesTop = 120;
const paymentMethodTop = addressesTop + 117;

let invoiceSkeleton = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111,
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000,
    },
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
};

/**
 * @param {Order} order
 */
export function createInvoice(order, path) {
  let doc = new PDFDocument({ size: "A4", margin: defaultMargin });

  doc.font(fontRegular);

  generateHeader(doc, order);
  generateAddresses(doc, order);
  generatePaymentMethod(doc, order);
  generateInvoiceTable(doc, order, invoiceSkeleton);
  generateFooter(doc);

  doc.end();
  doc.pipe(createWriteStream(path));
}

/**
 * @param {Order} order
 */
function generateHeader(doc, order) {
  let topMargin = 36 + 25;

  doc
    .image(logoFile, defaultMargin, 42, { width: 130 })
    .fillColor(textColor)

    .strokeColor(lightGrey)
    .lineWidth(43)
    .lineCap("butt")
    .moveTo(rightPart, topMargin)
    .lineTo(rightPartCenter, topMargin)
    .stroke()

    .strokeColor(accentColor)
    .lineWidth(43)
    .lineCap("butt")
    .moveTo(rightPartCenter, topMargin)
    .lineTo(rowEnd, topMargin)
    .stroke()

    .fillColor(textColor)
    .fontSize(8)
    .text("INVOICE", rightPart + 15, defaultMargin + 24)
    .font(fontBold)
    .text(order.getInvoiceNumberCustom(), rightPart + 52, defaultMargin + 24)

    .fillColor(white)
    .font(fontRegular)
    .text("ISSUE DATE", 300, defaultMargin + 14, { width: 244, align: "right" })
    .font(fontBold)
    .text(order.getDateInvoice().toUpperCase(), 300, defaultMargin + 24, {
      width: 244,
      align: "right",
    });
}

/**
 * @param {Order} order
 */
function generateAddresses(doc, order) {
  let padding = 14;
  let hideShipping = false;
  let moveDownSpace = 0.2;

  if (order.getAddress1("shipping") == order.getAddress1("billing")) {
    hideShipping = true;
  }

  if (!hideShipping) {
    doc
      .strokeColor(lineColor)
      .lineWidth(0.1)
      .moveTo(leftPartCenter, addressesTop)
      .lineTo(leftPartCenter, addressesTop + 80)
      .stroke();
  }

  doc
    .strokeColor(lineColor)
    .lineWidth(0.1)
    .moveTo(rightPart, addressesTop)
    .lineTo(rightPart, addressesTop + 80)
    .stroke()

    .fontSize(8)
    .fillColor(textColor)
    .font(fontBold)
    .text(invoiceSettings.emettor.companyName, defaultMargin, addressesTop)
    .moveDown(moveDownSpace)
    .font(fontRegular)
    .text(invoiceSettings.emettor.line1, defaultMargin)
    .moveDown(moveDownSpace)
    .text(invoiceSettings.emettor.line2, defaultMargin)
    .moveDown(moveDownSpace)
    .text(invoiceSettings.emettor.line3, defaultMargin)
    .moveDown(moveDownSpace)
    .text(invoiceSettings.emettor.line4, defaultMargin);

  if (!hideShipping) {
    doc
      .font(fontRegular)
      .text("SHIPPING ADDRESS", leftPartCenter + padding, addressesTop)
      .moveDown(moveDownSpace)
      .font(fontBold)
      .text(
        order.getAddressFullName("shipping").toUpperCase(),
        leftPartCenter + padding
      )
      .moveDown(moveDownSpace)
      .font(fontRegular)
      .text(order.getAddress1("shipping"), leftPartCenter + padding)
      .moveDown(moveDownSpace)
      .text(order.getCityAndZip("shipping"), leftPartCenter + padding)
      .moveDown(moveDownSpace)
      .text(order.getCountry("shipping"), leftPartCenter + padding)
      .moveDown(moveDownSpace);
  }

  doc
    .font(fontRegular)
    .text("CLIENT", rightPart + padding, addressesTop)
    .moveDown(moveDownSpace)
    .font(fontBold)
    .text(
      order.getAddressFullName("billing").toUpperCase(),
      rightPart + padding
    )
    .moveDown(moveDownSpace)
    .font(fontRegular)
    .text(order.getAddress1("billing"), rightPart + padding)
    .moveDown(moveDownSpace)
    .text(order.getCityAndZip("billing"), rightPart + padding)
    .moveDown(moveDownSpace)
    .text(order.getCountry("billing"), rightPart + padding)
    .moveDown(moveDownSpace)
    .text(order.getInvoiceContact(), rightPart + padding);

  generateDashedLine(doc, addressesTop + 100);
}

/**
 * @param {Order} order
 */
function generatePaymentMethod(doc, order) {
  doc
    .fillColor(textColor)
    .fontSize(8)
    .text("PAYMENT METHOD", defaultMargin, paymentMethodTop)
    .font(fontBold)
    .text(
      order.getPaymentMethod().toUpperCase(),
      leftPartCenter,
      paymentMethodTop
    )
    .font(fontRegular)
    .text("ORDER NUMBER", defaultMargin, paymentMethodTop + 15)
    .font(fontBold)
    .text(order.getId(), leftPartCenter, paymentMethodTop + 15)

    .fontSize(17)
    .font(fontRegular)
    .text("THANK YOU FOR YOUR", rightPart, paymentMethodTop)
    .text("PURCHASE.", rightPart, paymentMethodTop + 21);

  generateDashedLine(doc, paymentMethodTop + 62);
}

/**
 * @param {Order} order
 */
function generateInvoiceTable(doc, order, invoice) {
  let i = 0;
  let color;
  const invoiceTableTop = 330;

  doc.font(fontBold);
  generateTableHeader(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Quantity",
    "Unit Price",
    "Total"
  );
  doc.font(fontRegular);

  order.getLineItems().forEach((lineItem) => {
    let position = invoiceTableTop + (i + 1) * 30;
    if (i % 2 == 0) {
      color = lightGrey;
    } else {
      color = white;
    }
    generateTableRow(
      doc,
      position,
      lineItem.title,
      lineItem.variant_title,
      lineItem.quantity,
      formatCurrency(lineItem.price),
      formatCurrency(lineItem.quantity * lineItem.price),
      color
    );
    i++;
  });

  let totalLines = [];

  totalLines.push({
    label: "Subtotal",
    price: order.total_line_items_price,
  });

  //console.log('order.total_discounts', order.total_discounts)
  /*if(Number(order.total_discounts) > 0) {
    totalLines.push({
      label: 'Discount',
      price: -order.total_discounts
    })
  }*/

  if (order.discount_codes) {
    order.discount_codes.forEach((discount_code) => {
      totalLines.push({
        label: `Discount ${discount_code.code}`,
        price: -discount_code.amount,
      });
    });
  }

  let total_shipping = 0;
  order.shipping_lines.forEach((shipping_line) => {
    total_shipping += shipping_line.discounted_price;
  });

  totalLines.push({
    label: "Shipping",
    price: total_shipping,
  });

  if (order.tax_lines) {
    order.tax_lines.forEach((tax_line) => {
      totalLines.push({
        label: `${tax_line.title} ${tax_line.rate * 100}%`,
        price: tax_line.price,
      });
    });
  }

  totalLines.forEach((totalLine) => {
    let position = invoiceTableTop + (i + 1) * 30;
    if (i % 2 == 0) {
      color = lightGrey;
    } else {
      color = white;
    }
    generateTableRowHalf(
      doc,
      position,
      totalLine.label,
      formatCurrency(totalLine.price),
      color
    );
    i++;
  });

  //console.log(i)
  let position = invoiceTableTop + (i + 1) * 30;
  generateTableRowHalf(
    doc,
    position,
    "TOTAL AMOUNT",
    formatCurrency(order.total_price),
    accentColor,
    true
  );

  doc.font(fontRegular);
}

function generateFooter(doc) {
  doc
    .fontSize(7)
    .fillColor(textColor)
    .text(invoiceSettings.footerText, defaultMargin, 790, {
      align: "center",
      width: 500,
    });
}

function generateTableHeader(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
  rowColor
) {
  let position = y - 5;
  doc
    .fillColor(accentColor)
    .fontSize(8)
    .text(item.toUpperCase(), defaultMargin + 8, position)
    .text(description.toUpperCase(), 220, position)
    .text(unitCost.toUpperCase(), 280, position, { width: 90, align: "right" })
    .text(quantity.toUpperCase(), 370, position, { width: 90, align: "right" })
    .text(lineTotal.toUpperCase(), 0, position, {
      width: sizeLine - 13,
      align: "right",
    });
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
  rowColor
) {
  let position = y - 5;
  let itemCharLimit = 33;

  item =
    item.length > itemCharLimit ? `${item.substr(0, itemCharLimit)}...` : item;

  doc
    .strokeColor(rowColor)
    .lineWidth(30)
    .lineCap("butt")
    .moveTo(defaultMargin, y)
    .lineTo(sizeLine, y)
    .stroke();

  doc
    .fillColor(textColor)
    .fontSize(8)
    .font(fontBold)
    .text(item, defaultMargin + 8, position)
    .fontSize(8)
    .font(fontRegular)
    .text(description, 220, position)
    .text(unitCost, 280, position, { width: 90, align: "right" })
    .text(quantity, 370, position, { width: 90, align: "right" })
    .font(fontBold)
    .text(lineTotal, 0, position, { width: sizeLine - 13, align: "right" });
}

function generateTableRowHalf(doc, y, label, lineTotal, rowColor, last) {
  let position = y - 5;
  let labelFont = fontRegular;
  let color = textColor;

  if (last) {
    labelFont = fontBold;
    color = white;
  }

  doc
    .strokeColor(rowColor)
    .lineWidth(30)
    .lineCap("butt")
    .moveTo(rightPart, y)
    .lineTo(sizeLine, y)
    .stroke();

  doc
    .fillColor(color)
    .font(labelFont)
    .text(label, rightPart + 18, position)
    .font(fontBold)
    .text(lineTotal, 0, position, { width: sizeLine - 13, align: "right" });
}

function generateDashedLine(doc, y) {
  doc
    .strokeColor(textColor)
    .lineWidth(0.5)
    .dash(1, { space: 2 })
    .moveTo(defaultMargin, y)
    .lineTo(sizeLine, y)
    .stroke()
    .undash();
}

function formatCurrency(amount) {
  return Number(amount) < 0
    ? `- $${-Number(amount).toFixed(2)}`
    : `$${Number(amount).toFixed(2)}`;
}
