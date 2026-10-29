# Kosten pro Tragetag, Am längsten nicht getragen, Service-Erinnerung – Specsheet

Drei kleine Basis-Funktionen aus der Roadmap, kostenlos, ohne KI. Sie rechnen mit Daten, die es schon gibt (Kaufpreis, Tragetage), plus zwei neuen Uhrenfeldern für die Revision.
Branch `feature/basis-kosten-service`, am 29.10.2026 autark umgesetzt, während Markus Pause macht. Alles unter [Vorschlag] ist eingebaut und kann geändert werden.

## Kosten pro Tragetag

- **[fest]** Kaufpreis ÷ Anzahl Tragetage, gerundet auf ganze Euro (unter 10 € mit einer Nachkommastelle).
- **[Vorschlag]** Nur wenn ein Kaufpreis als Zahl eingetragen ist und es mindestens einen Tragetag gibt. Sonst nichts anzeigen.
- **[Vorschlag]** Sichtbar auf der Detailseite im Feld „Tragetage“: „Kosten pro Tragetag: 12 €“.
- **[Vorschlag]** Im Vergleich als eigene Zeile „€ pro Tragetag“ unter „Tragetage“, fett wie die anderen Zahlenzeilen bei größtem und kleinstem Wert.

## Am längsten nicht getragen

- **[Vorschlag]** Hinweis oben in der Sammlung: „Flieger 39: seit 47 Tagen im Kasten“, Tipp öffnet die Uhr.
- **[Vorschlag]** Kandidaten: Uhren mit Status „Sammlung“ (nicht bestellt, nicht verkauft), die schon mindestens einmal getragen wurden. Nie getragene Uhren zählen nicht, weil das Kaufdatum oft fehlt und neue Nutzer sonst sofort für jede Uhr einen Hinweis bekämen.
- **[Vorschlag]** Erst ab 21 Tagen, und nur wenn mindestens zwei Uhren in Frage kommen (bei einer einzigen Uhr ist der Hinweis sinnlos). Gezeigt wird nur die eine Uhr, die am längsten liegt.
- **[Vorschlag]** Auf der Detailseite im Feld „Tragetage“ zusätzlich „zuletzt vor 47 Tagen“.
- **[offen]** Wegklicken („Später“) wie beim Sicherungs-Hinweis? Bisher nicht, der Hinweis ist eine einzelne ruhige Zeile.

## Service-Erinnerung

- **[fest]** Zwei neue Uhrenfelder in der Gruppe „Werk“: `lastService` „Letzte Revision (Monat/Jahr)“ als Text wie beim Kaufdatum (`03/2022` oder `2022`), `serviceYears` „Revisions-Intervall (Jahre)“ als Zahl.
- **[Vorschlag]** Fällig ab Monat der letzten Revision + Intervall. Nur Jahr eingetragen → gilt der Januar.
- **[Vorschlag]** Detailseite, Gruppe „Werk“: Zeile „Revision“ mit „zuletzt 03/2022, alle 5 Jahre, fällig 03/2027“; ist sie fällig, in Warnfarbe „fällig seit 03/2027“. Lässt sich in den Einstellungen ausblenden wie die anderen Felder.
- **[Vorschlag]** Hinweis oben in der Sammlung, wenn eine Revision fällig ist: „Revision fällig: Flieger 39“ (bei mehreren: „Revision fällig: Flieger 39, PH-2“). Zwei Monate vorher noch nicht, um nicht zu nerven.
- **[Vorschlag]** Ohne Intervall kein Fälligkeitsdatum, nur „zuletzt 03/2022“.
- **[fest]** Sichern/Laden und ältere App-Versionen: die neuen Felder wandern einfach mit, alte Sicherungen bleiben gültig.

## Offen

- **[offen]** Sollen Quarzuhren auch eine Erinnerung bekommen (Batterie statt Revision)? Technisch geht es schon, nur der Text sagt „Revision“.
- **[offen]** Beispiel-Sammlung: Revisionsdaten für ein, zwei Uhren ergänzen, damit man die Funktion in der Demo sieht? Bisher nicht gemacht.
