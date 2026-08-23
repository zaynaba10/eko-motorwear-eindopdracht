# EKO Motorwear — Eindopdracht Mobile App (YP0833)

Voor mijn eindopdracht heb ik de website van **EKO Motorwear** (motorkledij­speciaalzaak in Kontich) volledig opnieuw ontworpen en gebouwd in **Webflow**, en daar een mobiele applicatie in **React Native (Expo)** aan gekoppeld die haar data live uit het **Webflow CMS** haalt. Deze repository bevat de app, mijn design- en analysebestanden en deze uitleg.

| Onderdeel | Waar |
|---|---|
| Live website (Webflow) | https://eko-exampenopdracht.webflow.io |
| Analyse van het origineel t.o.v. mijn redesign | [`design/analyse-eko-vergelijking.html`](design/analyse-eko-vergelijking.html) |
| Mockups + huisstijl (PDF) | [`design/design-mockups-eko.pdf`](design/design-mockups-eko.pdf) |
| React Native-app | [`app/`](app/) |

## Stap 1 — Analyse & redesign

Ik ben vertrokken van de bestaande site van EKO Motorwear en heb die geanalyseerd op structuur, UX, kleurgebruik, hiërarchie en gebruiksvriendelijkheid. Op basis daarvan koos ik een eigen huisstijl: **navy `#16232E`**, **oranje `#BD5C00`** als enig accent, **sectiegrijs `#ECEDEF`** en wit, met **Oswald** voor koppen en **Ubuntu** voor lopende tekst. Ook het logo hertekende ik in vaste uitvoeringen en ik maakte een eigen favicon (E|M-icoon in navy/oranje).

Beide documenten staan in [`design/`](design/): het analyseverslag (met metingen op de echte pagina's) en het mockupdocument met per onderdeel — homepagina, navigatie, hero, productoverzicht, blogoverzicht, footer, productdetail- en blogdetailtemplate — de desktop- en mobiele versie plus mijn ontwerpkeuzes.

## Stap 2 — Webflow-website

De site is een volledige webshop met CMS-blogs (12 artikels in collecties met categorieën), e-commerce (producten met SKU's, maten, winkelmand, checkout-flow), zoekfunctie met volledige-tekst­zoeken, accountgedeelte, retourflow en een mini-designsysteem van herbruikbare klassen. De site is live gepubliceerd op de link hierboven en bewerkbaar in Webflow.

## Stap 3 — React Native-app

De app haalt alles live op via de **Webflow REST API**:

- Lijst producten (incl. prijzen via SKU's): `GET /v2/sites/{site_id}/products`
- Eén product via ID: `GET /v2/sites/{site_id}/products/{product_id}`
- Lijst blogs én één blog via ID: `GET /v2/collections/{blogs_collection_id}/items`
- Productcategorieën: `GET /v2/collections/{categories_collection_id}/items`

Wat de app kan: shop in warenhuisstructuur (categorieën → subcategorieën → producten) met zoeken, filteren op categorie en prijs en sorteren; productdetail met fotogalerij, maatkeuze, aantal en live totaalprijs; blogoverzicht en -detail met zoeken en categoriefilter; verlanglijst, winkelmand en bestellingen; een accountdashboard dat gelijkloopt met de website; loading- en errorstates bij elke API-call en een lege staat bij nul resultaten.

## Stap 4 — Mini-game

Mijn mini-game is een motorrit in EKO-stijl, bereikbaar in de app via de route `/game`. Je rijdt op een motor over een heuvelig parcours en wordt achternagezeten door een bende van drie motoren die elke tien seconden versnelt. Met de knoppen geef je gas, rem je en spring je over obstakels: een geslaagde sprong levert een bonus (en een korte snelheidsboost) op, een botsing kost punten en vaart.

- **Score**: 1 punt per gereden meter, plus sprongbonussen, min de strafpunten van botsingen — live zichtbaar in de HUD.
- **Timer**: één ronde duurt 60 seconden, de resterende tijd telt af in beeld.
- **Winnen/verliezen**: blijf je de volle 60 seconden uit de handen van de bende, dan win je; halen ze je in, dan verlies je.
- **Herstartfunctie**: het win- en verliesscherm heeft een herstartknop, dus je kan meteen opnieuw voor een hogere score gaan.

Ook hier heb ik de code opgesplitst: het scherm `app/app/game.tsx` tekent alleen, alle spellogica (game loop, natuurkunde, score, timer, bende) zit in de hook `app/lib/game/useGameEngine.ts`, alle instelbare waarden staan in `app/lib/game/gameConfig.ts`, en de visuele onderdelen (Bike, Terrain, Obstacle, GameHUD, GameControls, GameOverlay, EkoLogo) zijn aparte componenten in `app/components/game/`. Niets wordt in een database opgeslagen; alles draait live in de app. Ik demonstreer de game tijdens het mondeling examen.

## Projectstructuur

Ik gebruik **expo-router** (file-based routing). De mappen van de opdracht — components, screens, navigation, services — zitten er zo in:

```
app/
  app/            # SCREENS: elk bestand is een scherm (tabs, blog/[id], product/[id], game, ...)
                  # NAVIGATION: de _layout.tsx-bestanden definiëren de Stack + Tabs (expo-router)
  components/     # COMPONENTS: herbruikbare componenten (product-card, blog-card,
                  #   search-filter-bar, uitklap, game/, winkel/, paginas/)
  lib/            # SERVICES: alle API-calls naar Webflow (webflow-products, webflow-blogs,
                  #   webflow-categories) + helpers (winkelmand, verlanglijst, maten, ...)
  constants/      # huisstijl (kleuren, fonts) — gesynct met mijn website (eko-theme.ts)
  assets/         # logo's, iconen, fonts
design/           # analyseverslag + mockupdocument (Stap 1)
```

Er staat geen enkele API-call rechtstreeks in een scherm: alle datalogica zit als herbruikbare functies in `app/lib/` en de schermen importeren die.

## Project starten

1. Repo clonen en afhankelijkheden installeren:

   ```bash
   cd app
   npm install
   ```

2. In de map `app/` een bestand `.env` aanmaken met de Webflow API-token (die zet ik bewust niet in de repo, omdat die openbaar is):

   ```
   EXPO_PUBLIC_WEBFLOW_API_TOKEN=jouw_token_hier
   ```

3. Starten:

   ```bash
   npx expo start
   ```

## Commits

Ik commit per afgewerkt onderdeel met de structuur `zaynaba-eindopdracht-onderdeel` (bv. `zaynaba-eindopdracht-minigame`). De alleroudste commits uit de opzetfase dragen nog generieke namen; vanaf de projectstructuur-commit volgt alles dit format.
