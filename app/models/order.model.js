"use strict";

import moment from "moment";
const startAfterOrder = 4670; // #4670 (Derniere an tant qu'autoentrepreneur)

export default class Order {
  constructor(data) {
    if (data) {
      Object.assign(this, data);
      //delete this.data;
    }
  }

  getThis() {
    console.log(this);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getOrderNumber() {
    return this.order_number;
  }

  getCustomer() {
    return this.customer;
  }

  getFulfillments() {
    return this.fulfillments;
  }

  getCustomerFullName() {
    return this.customer.last_name + " " + this.customer.first_name;
  }

  getBillingAddress() {
    return this.billing_address;
  }

  getShippingAddress() {
    return this.shipping_address;
  }

  getCreatedAtFormatted() {
    return this.created_at;
  }

  getCreatedAt() {
    return this.created_at;
  }

  getDateInvoice() {
    return moment(this.getCreatedAtFormatted()).format("MMMM D, YYYY");
  }

  getInvoiceNumberCustom() {
    return (this.getOrderNumber() - startAfterOrder)
      .toString()
      .padStart(7, "0");
  }

  //"MARCH 16, 2020"

  getInvoiceContact() {
    return this.getCustomer().email
      ? this.getCustomer().email
      : this.getShippingAddress().phone;
  }

  getShippingAddressPhone() {
    return this.getShippingAddress().phone
      ? this.getShippingAddress().phone
      : "+1000000000";
  }

  getFacebookPhone() {
    if (typeof this.getShippingAddress() === "undefined") {
      return "";
    }
    return this.getShippingAddress().phone
      ? this.getShippingAddress().phone
      : "";
  }

  getBillingAddressFullName() {
    return (
      this.getBillingAddress().last_name +
      " " +
      this.getBillingAddress().first_name
    );
  }

  getShippingAddressFullName() {
    return (
      this.getShippingAddress().last_name +
      " " +
      this.getShippingAddress().first_name
    );
  }

  getAddressFullName(type) {
    let address =
      type == "billing" ? this.getBillingAddress() : this.getShippingAddress();
    return `${address.last_name} ${address.first_name}`;
  }

  getAddress1(type) {
    let address =
      type == "billing" ? this.getBillingAddress() : this.getShippingAddress();
    return address.address1;
  }

  getCityAndZip(type) {
    let address =
      type == "billing" ? this.getBillingAddress() : this.getShippingAddress();
    return `${address.city}, ${
      address.province_code ? `${address.province_code} ` : ""
    }${address.zip ? `${address.zip} ` : ""}`;
  }

  getCountry(type) {
    let address =
      type == "billing" ? this.getBillingAddress() : this.getShippingAddress();
    return address.country;
  }

  getShippingAddressFullAddress() {
    let address = this.getShippingAddress().address1;
    if (this.getShippingAddress().address2) {
      address += ", " + this.getShippingAddress().address2;
    }
    return address;
  }

  getPaymentMethod() {
    if (this.gateway == "gift_card") {
      return "Gift Card";
    } else if (this.gateway == "paypal") {
      return `Paypal`;
    } else {
      return `Credit Card`;
    }
  }

  getFacebookCustomer() {
    if (!this.customer) return false;
    return {
      id: this.customer.id,
      email: this.customer.email,
      phone: this.getFacebookPhone(),
      first_name: this.customer.first_name,
      last_name: this.customer.last_name,
      country_code: this.customer.default_address.country_code,
    };
  }

  getLineItems() {
    return this.line_items;
  }

  getNote() {
    return this.note;
  }

  getProductTitle() {
    //return this.getProduct()['Line: Title'];
  }

  /*

  getProduct() {
    var product = {};
    product['Line: Product ID'] = this['Line: Product ID'];
    product['Line: Product Handle'] = this['Line: Product Handle'];
    product['Line: Title'] = this['Line: Title'];
    product['Line: Name'] = this['Line: Name'];
    product['Line: Variant ID'] = this['Line: Variant ID'];
    product['Line: Variant Title'] = this['Line: Variant Title'];
    product['Line: SKU'] = this['Line: SKU'];
    product['Line: Quantity'] = this['Line: Quantity'];
    product['Line: Price'] = this['Line: Price'];
    product['Line: Discount'] = this['Line: Discount'];
    product['Line: Total'] = this['Line: Total'];
    product['Line: Grams'] = this['Line: Grams'];
    product['Line: Requires Shipping'] = this['Line: Requires Shipping'];
    product['Line: Properties'] = this['Line: Properties'];
    product['Line: Gift Card'] = this['Line: Gift Card'];
    product['Line: Taxable'] = this['Line: Taxable'];
    return product;
  }

  getProductShort() {
    var product = {};
    product['Line: Product ID'] = this.getProduct()['Line: Product ID'];
    product['Line: Title'] = this.getProduct()['Line: Title'];
    return product;
  }

  getProductTitle() {
    return this.getProduct()['Line: Title'];
  }

  getQuantity() {
    return parseInt(this.getProduct()['Line: Quantity']);
  }

  */
}
