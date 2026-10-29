# Englische Oberfläche – Specsheet

Die Uhrenbox wird zweisprachig: **Deutsch bleibt Standard**, Englisch kommt dazu. Es ändert sich nur die Oberfläche,
nie die gespeicherten Daten oder Sicherungen.

Bezug: `ROADMAP-privat.md` („Englische Version – vergrößert die Zielgruppe deutlich“).

## Einschätzung vorab (einfacher Weg zuerst)

- **Gewählt**: ein Wörterbuch direkt in `index.html` (`EN` und `FN`) und eine kleine Funktion `tr('Sammlung')` (nicht `t`, weil `t` im Code oft schon eine Variable ist).
  Kein Build-Schritt, keine Bibliothek, kein Nachladen; die App bleibt eine einzelne Datei. Aufwand: eine Session,
  der größte Teil ist das Herausziehen von rund 400 Texten.
- **Nicht** gewählt: i18n-Bibliothek (i18next o. ä.), getrennte JSON-Dateien pro Sprache, zwei Kopien der App. Alles
  mehr Teile für dieselbe Wirkung.

## 1. Texte herausziehen

- **[fest, 29.10.2026]** Die deutschen Texte bleiben als Schlüssel im Code stehen: `tr('Sammlung')`. Eine Tabelle `EN`
  oben im Skript liefert das Englische (`'Sammlung': 'Collection'`). Deutsch ändert sich dadurch Wort für Wort nicht,
  der Code bleibt lesbar, und fehlt eine Übersetzung, erscheint der deutsche Text (fällt beim Testen auf).
- **[fest]** Texte mit Zahlen oder Namen bekommen einen kurzen Schlüssel und je Sprache eine kleine Funktion in der
  Tabelle `FN`, z. B. `'coll.count': [n => n === 1 ? '1 Uhr' : n + ' Uhren', n => n === 1 ? '1 watch' : n + ' watches']`.
  So bleiben Mehrzahl und Satzbau je Sprache richtig, ohne Regelwerk.
- **[fest]** Feste Texte im HTML (Reiter, Ladehinweis, Update-Leiste) bekommen `data-t` und werden beim Start und beim
  Umschalten gesetzt.
- **[fest]** Kommentare im Code bleiben deutsch.

## 2. Gespeicherte Werte bleiben deutsch

- **[fest]** Auswahlwerte, die in den Daten stehen, werden **nicht** übersetzt gespeichert: Werk-Art (`Automatik`,
  `Handaufzug`, `Quarz`, `Mecaquartz`), Status (`Sammlung`, `Bestellt`, `Verkauft`), Kategorie (`Taucher`, …),
  Lage (`Zifferblatt oben`, …), Toleranz-Einheit (`s/Tag`, `s/Monat`). Sie bleiben die Schlüssel, angezeigt wird die
  Übersetzung (`T.en.val['Zifferblatt oben'] = 'Dial up'`). In Auswahlfeldern ist `value` deutsch, nur die Beschriftung
  wechselt.
- **[fest]** Damit sind Sicherungen sprachunabhängig: Eine auf Englisch gemachte Sicherung lädt auf Deutsch und
  umgekehrt, alte Sicherungen bleiben gültig.
- **[fest]** Was der Nutzer selbst schreibt (Namen, Notizen, Zifferblatt, Band, offene Punkte), wird nie übersetzt.
- **[fest]** Fehlertexte aus `zeitwaage.js` (`Zu wenige Ticks erkannt` …) bleiben dort unverändert; `index.html`
  übersetzt sie bei der Anzeige über dieselbe Tabelle. Die Messlogik wird nicht angefasst.

## 3. Sprache wählen

- **[fest, 29.10.2026]** In den Einstellungen ein Abschnitt **„Sprache / Language“** mit drei Knöpfen:
  **Automatisch** (Gerätesprache), **Deutsch**, **English**. Gespeichert pro Gerät in `uhrenbox.ansicht` (wie die
  anderen Ansichts-Schalter), **nicht** in der Sicherung.
- **[fest, 29.10.2026]** „Automatisch“ ist voreingestellt: Gerätesprache beginnt mit `de` → Deutsch, sonst Englisch. Für
  Markus' Fold6 (Deutsch) ändert sich also nichts; jemand mit englischem Handy sieht sofort Englisch.
- **[fest]** `?lang=en` bzw. `?lang=de` in der Adresse setzt die Sprache für diesen Aufruf (ohne sie zu
  speichern), praktisch für Links in einer englischen Vorstellung.
- **[fest]** Umschalten wirkt sofort, ohne Neuladen; `<html lang>` wechselt mit (Vorlesefunktion, Silbentrennung).
- **[fest]** Das Zahnrad ist auch auf Englisch leicht zu finden; der Abschnitt heißt in beiden Sprachen
  „Sprache / Language“, damit man aus der falschen Sprache herausfindet.

## 4. Datum, Zahlen, Einheiten

- **[fest]** Alle `toLocale…`-Aufrufe nehmen die Sprache der Oberfläche statt fest `de-DE`.
- **[fest, 29.10.2026]** Englisch = `en-GB`: Datum `29/10/2026`, 24-Stunden-Uhr, Dezimalpunkt, Woche ab Montag (der
  Kalender im Tragetagebuch beginnt ohnehin montags). Uhrenforen sind stark europäisch; `en-US` (10/29/2026,
  AM/PM) wäre die Alternative.
- **[fest]** Einheiten bleiben inhaltlich gleich, nur die Beschriftung wechselt: `s/Tag` → `s/day`,
  `s/Monat` → `s/month`, `A/h` → `bph` (in englischen Foren üblich), `ms`, `°`, `mm`, `m`, `ppm` bleiben. In den
  Daten bleibt `s/Tag`.
- **[fest]** Kaufpreis bleibt `€` (so eingetragen, keine Umrechnung).
- **[fest]** Fachwörter wie in englischen Uhrenforen: Gang = rate, Amplitude = amplitude, Abfallfehler = beat error,
  Hebungswinkel = lift angle, Zeitwaage = timegrapher, Lage = position (Dial up / Dial down / Crown down / Crown up /
  Crown left / Crown right / On the wrist), Bandanstoß = lug width, Lünette = bezel, Abgleich mit Funkuhr =
  check against atomic time (radio clock).

## 5. Hilfetexte, Meldungen

- **[fest]** Alle sichtbaren Texte werden übersetzt: Hinweise, Leerzustände, Meldungen (Toasts), Bestätigungen
  (`confirm`), `aria-label`, `title`, Platzhalter, Texte im Zeitwaagen-Fenster und im Wristcheck.
- **[fest]** Die Gründe im Wristcheck („gestern getragen“, „3× an Dienstagen getragen“) kommen auch aus dem Wörterbuch,
  Wochentage aus `Intl`.

## 6. Manifest und Kurzbefehle

- **[fest, 29.10.2026]** Zwei Manifeste: `manifest.webmanifest` (deutsch, wie bisher) und `manifest-en.webmanifest`
  (englisch). Gleiche `id`, gleiche Icons, gleiche Kurzbefehl-Adressen (`?aktion=messung` …), nur Name-Beschreibung,
  Kurzbefehl-Namen und Screenshot-Beschriftungen auf Englisch. `index.html` setzt beim Start den Manifest-Link passend
  zur Sprache. Wirkt beim Installieren; bei schon installierten Apps übernimmt Chrome die Texte irgendwann beim
  nächsten Manifest-Abgleich (nicht steuerbar).
- **[fest]** Der App-Name bleibt in beiden Sprachen **Uhrenbox** (Marke).
- **[fest]** Der Service Worker cacht beide Manifeste; `VERSION` wird hochgezählt.

## 7. Dateinamen und Sicherungen

- **[fest]** Inhalt der Sicherung unverändert (`app: 'Uhrenbox'`, `version: 2`, gleiche Felder).
- **[fest]** Nur der Dateiname folgt der Sprache: `uhrenbox-sicherung-2026-10-29.json` /
  `uhrenbox-backup-2026-10-29.json`. Laden akzeptiert beide (prüft nur den Inhalt, wie bisher).
- **[fest]** Dateiname der WAV-Aufnahme bleibt wie bisher (mit deutscher Lage), weil das Labor ihn so einliest.

## 8. Testen

- **[fest]** Im Browser-Fenster (`uhrenbox`, Port 3000, `/pwa/index.html`; der Server liefert kein Verzeichnis-Index): beide Sprachen, Handygröße (Fold6 zu ≈ 375 px) und
  Desktop; alle Reiter, Detailseite, Formular, Messung, Wristcheck, Zeitwaagen-Fenster, Einstellungen.
- **[fest]** Testdaten: eine vorhandene Sicherung in die Browser-Fenster-Instanz laden (eigener Speicher, berührt die
  App am Handy nicht). `SPEC-testdaten.md` beschreibt Aufnahmen-Spenden, keine Oberflächen-Testdaten.
- **[fest]** Prüfung auf vergessene deutsche Texte: im englischen Modus den Seitentext nach typisch deutschen
  Wörtern/Umlauten durchsuchen (Uhrnamen und Nutzertexte ausgenommen).

**Stand 29.10.2026: umgesetzt und geprüft.**
- Deutsch: Alle Ansichten, Formulare, Zeitwaagen-Fenster und Wristcheck zeigen zeichengenau denselben Text wie die
  Fassung davor (alte und neue Datei mit denselben Daten nebeneinander verglichen); neu ist nur der Abschnitt
  „Sprache / Language“.
- Englisch: kein deutscher Oberflächentext mehr gefunden, nur Nutzertexte (Notizen, Band, Vorbild).
- Eine auf Englisch eingetragene Messung „Crown down“ steht in den Daten als `Krone unten`.
- Handygröße (375 px): in keiner Ansicht waagrechtes Scrollen, in beiden Sprachen.
- Service Worker auf `uhrenbox-v11`, cacht `manifest-en.webmanifest` mit.

## Offen

- **[offen]** Eine **Beispiel-Sammlung** zum Ausprobieren („Demo laden“), damit jemand ohne eigene Uhren die App
  sofort gefüllt sieht. Nicht Teil dieser Runde; eigene kleine Session, falls gewünscht.
- **[offen]** Englische Screenshots für das Manifest (`screenshot-handy.png` zeigt die deutsche Oberfläche).
  Erst nach dieser Runde neu aufnehmen.
- **[offen]** Weitere Sprachen: Das Wörterbuch erlaubt sie, geplant ist keine.
