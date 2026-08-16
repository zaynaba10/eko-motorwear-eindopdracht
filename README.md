# EKO Motorwear — Eindopdracht Mobile App

Voor mijn eindopdracht bouwde ik een mobiele applicatie voor EKO Motorwear (Kontich)
met **React Native (Expo)**, gekoppeld aan het **Webflow CMS** van de website die ik
voor dezelfde opdracht maakte.

**Live website:** https://eko-exampenopdracht.webflow.io

## Wat kan de app?

- **Shop**: alle producten uit mijn Webflow-webshop, met zoeken (op naam), filteren
  op categorie én op prijsrange, en sorteren (naam A-Z/Z-A, prijs laag-hoog/hoog-laag).
- **Productdetail**: opgehaald via het API-endpoint per product-ID, met maatkeuze,
  aantal aanpassen (+/−, minimum 1) en live berekende totale prijs.
- **Blog**: alle blogartikelen met zoeken, categoriefilter en sorteren;
  detailscherm via een dynamische route.
- **Account**: dashboard opgebouwd zoals het accountgedeelte op mijn website.
- Navigatie met tabs onderaan (Stack + Tabs gecombineerd), loading- en
  errorstates bij elke API-call, herbruikbare componenten (ProductCard, BlogCard,
  SearchFilterBar) en een lege staat bij nul zoekresultaten.

## Koppeling met Webflow (API)

Ik haal de data op via de Webflow REST API:

- Lijst producten (incl. prijzen via SKU's): `GET /v2/sites/{site_id}/products`
- Eén product via ID: `GET /v2/sites/{site_id}/products/{product_id}`
- Lijst blogs: `GET /v2/collections/{blogs_collection_id}/items`
- Eén blog via ID uit dezelfde collectie
- Productcategorieën: `GET /v2/collections/{categories_collection_id}/items`

Alle API-logica staat in `app/lib/` (mijn services-laag), gescheiden van de schermen.

## Project starten

1. Repo clonen en afhankelijkheden installeren:

   ```bash
   cd app
   npm install
   ```

2. Maak in de map `app/` een bestand `.env` met de Webflow API-token
   (die zet ik bewust niet in de repo, omdat die openbaar is):

   ```
   EXPO_PUBLIC_WEBFLOW_API_TOKEN=jouw_token_hier
   ```

3. Starten:

   ```bash
   npx expo start
   ```

## Structuur

```
app/
  app/            # schermen (expo-router): tabs, blog/[id], product/[id]
  components/     # herbruikbare componenten (ProductCard, BlogCard, ...)
  constants/      # huisstijl (kleuren, fonts, radii) — gesynct met mijn website
  lib/            # services: API-calls naar Webflow + helpers
  assets/         # logo's, iconen, fonts
```

## Mini-game

De mini-game (met score, timer en herstartfunctie) zit in de app en demonstreer
ik tijdens het mondeling examen.
