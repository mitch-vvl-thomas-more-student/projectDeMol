# De Mol-app

Dit is een schoolproject voor Thomas More geïnspireerd op het televisieprogramma "De Mol".

Met de applicatie kunt u een lijst met uw favoriete kandidaten maken, hints over hen bekijken en delen en video's bekijken van verschillende kanalen die verband houden met de show.

## Technologieën

Het project is gebouwd met Angular en Ionic. Om de applicatie uit te voeren, moet voert u volgende stappen uit:

1. Installeer de afhankelijkheden: `pnpm install`
2. Start de ontwikkelserver: `ionic serve`

## Functies

- Applicatie:
    - Installeer op Android
    - Installeer als PWA op IOS https://project-de-mol.web.app
    - Gebruik als webapp op https://project-de-mol.web.app

- Profiel:
    - Beheer uw weergave naam
    - Beheer uw profiel foto

- Logins
    - Bekijk waar en wanneer u bent ingelogt op dde applicatie
    - Bekijk met welk systeem u bent ingelogt
    - Beheer uw paswoord

- Top 10
    - Publieke top 10, hoe denken anderen over de kandidaten
    - Maak uw eigen top 10

- Kandidaten
    - Bekijk alle kandidaten
    - Deel hints over de kandidaten
    - Voeg opmerkingen toe aan gedeelde hints

- Youtube
    - Bekijk video's van verschillende kanalen die verband houden met de show

## Gebruikte plugins

- @capacitor/camera (versie 4.1.5): Hiermee kunnen foto's worden gemaakt met behulp van de camera van het apparaat.

- @capacitor/device (versie 5.0.2): Deze plugin geeft informatie over het apparaat waarop de app wordt uitgevoerd, zoals het besturingssysteem, het model en de taalinstellingen.

- @capacitor/geolocation (versie 5.0.2): Hiermee kan de app de huidige locatie van het apparaat ophalen met behulp van de GPS- of netwerkgegevens.

- @capacitor/splash-screen (versie 4.2.0): Deze plugin toont een splashscreen tijdens het opstarten van de app.

- capacitor-openstreetmap (versie 0.1.0): Deze plugin toont een map wanneer de gebruiker de app gebruikt op een native platform.

## Gebruikte services

- Youtube Api: 'https://www.googleapis.com/youtube/v3',
- Ip adress: 'https://geolocation-db.com/json/',
- Adres gegevens: 'https://geocode.maps.co/reverse',
- Authenticatie: firebase authentication
- Storage: firebase storage
- Leaflet: map tool bij gebruik van de webapplicatie



## Credits

Het project is ontwikkeld door Mitch Van Vlierberghe als schoolproject voor Thomas More.
