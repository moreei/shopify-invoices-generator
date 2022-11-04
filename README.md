# Shopify Invoices Generator

> Fonctionne avec node.js et yarn qu'il faut installer au préalable.

## Installation

Install packages:

```sh
yarn install
```

Create a `.env` file in the root directory of your project. Add
environment-specific variables on new lines in the form of `NAME=VALUE`.
For example:

```dosini
SHOPIFY_SHOP_NAME=<add>
SHOPIFY_API_KEY=<add>
SHOPIFY_API_PASSWORD=<add>
```

Editer le fichier `app/config.js` pour choisir les paramètres de la facture
(logo, polices, couleurs, dossier de destination etc ...)

## Utilisation

Script a lancer pour generer les factures

```sh
node app/scripts/generate.js
```
