# Beispiel-Sammlung „Demo laden“ – Specsheet

Wer die Uhrenbox zum ersten Mal öffnet, sieht eine leere App. Mit einer Beispiel-Sammlung sieht man sofort, was sie
kann: Uhren mit Fotos, Gangkurven, Tragekalender, Vergleich, Wristcheck. Das braucht es für die Vorstellung im Forum,
für den Wettbewerb und für die englischen Manifest-Screenshots.

Bezug: `SPEC-englisch.md`, Abschnitt Offen (Demo und Screenshots).
**[fest]** entschieden · **[Vorschlag]** gilt, wenn Markus nicht widerspricht · **[offen]** Frage an Markus.

## Einschätzung vorab (einfacher Weg zuerst)

- **Einfachster Weg (≈ 1 h):** eine Datei `demo.json` im Sicherungsformat neben `index.html` legen. Der Knopf „Demo laden“
  holt sie und gibt sie an das vorhandene `importJson`. Eine eigene Demo-Logik gibt es nicht.
  Haken: Das Laden **ersetzt die Sammlung**. Deshalb darf der Knopf nur bei leerer Sammlung erscheinen.
- **Gewählt [fest, 29.10.2026] (≈ 2–3 h):** zusätzlich ein eigener Demo-Speicher unter `?demo=1`. Dann kann auch jemand mit
  eigener Sammlung die Demo ansehen, ohne dass etwas überschrieben wird, und die Screenshots lassen sich jederzeit neu
  aufnehmen. Dazu kommen Datumsangaben, die zum heutigen Tag passen (siehe 3).
- **Nicht** gewählt: Demodaten fest in `index.html` einbauen (Datei wird um Fotos größer, jeder lädt sie mit) und ein
  eigener „Demo-Modus“ mit Sonderfällen quer durch den Code.

## 1. Wo der Knopf steht

- **[Vorschlag]** Im Leerzustand der Sammlung („Noch keine Uhren gespeichert …“) ein zweiter Knopf
  **„Beispiel-Sammlung ansehen“** / „View sample collection“.
- **[fest, 29.10.2026]** Er öffnet die Demo im eigenen Speicher (`?demo=1`, siehe 2), nicht in der echten Sammlung. So ersetzt
  der erste Tipp eines neuen Nutzers nichts, und der Weg zurück ist klar.
- **[fest, 29.10.2026]** Zusätzlich in ⚙ Einstellungen ein Eintrag „Beispiel-Sammlung ansehen“, auch wenn die Sammlung schon
  gefüllt ist. Mit eigenem Speicher ist das gefahrlos.

## 2. Eigener Speicher für die Demo

- **[fest, 29.10.2026]** `?demo=1` öffnet die IndexedDB `uhrenbox-demo` statt `uhrenbox`. Ansichts-Schalter (`uhrenbox.ansicht`)
  und die Sicherungs-Erinnerung bekommen im Demo-Modus eigene Schlüssel bzw. sind aus.
- **[Vorschlag]** Oben eine schmale Leiste **„Beispiel-Sammlung – deine eigenen Daten sind nicht betroffen.
  [Zur eigenen Sammlung]“**. Der Link führt zu `index.html` ohne `?demo`.
- **[Vorschlag]** Die Demo ist frei bedienbar (Uhr anlegen, Messung, Tragetag). Beim nächsten Öffnen über den Knopf wird
  sie frisch geladen, Änderungen bleiben also nicht.
- **[Vorschlag]** „Sichern“ geht in der Demo auch, die Datei heißt dann `uhrenbox-demo-…json`. Das ist nützlich zum
  Ausprobieren und schadet nichts.
- **[fest]** Die echte Sammlung und ihr Speicher werden im Demo-Modus nie gelesen oder geschrieben.

## 3. Inhalt der Beispiel-Sammlung

- **[fest, 29.10.2026]** **Welche Uhren?** Gewählt ist (b).
  - (a) **Deine echte Sammlung** (9 Uhren aus `Sicherungen/uhrenbox-komplett-mit-fotos.json`, eigene Fotos). Das wirkt
    echt und kostet keine Arbeit. Es zeigt aber öffentlich, was du besitzt, mit Kaufpreisen und Händlern.
  - (b) **Deine Uhren, aber ausgedünnt** (gewählt): dieselben Uhren und Fotos, ohne Kaufpreis, Händler, Kaufdatum
    und Seriennummer. Die Felder „Kosten pro Tragetag“ usw. bekommen dann Beispielpreise oder bleiben leer.
  - (c) **Ausgedachte Uhren ohne Marken** („Taucher 300“, „Flieger 39“), Fotos selbst gemacht oder gezeichnet. Das ist
    neutral, sieht aber leerer aus und kostet mehr Zeit.
- **[Vorschlag]** Alle 9 Uhren, die Seafarer WD0017B bleibt „Bestellt“. Notizen und offene Punkte werden durchgesehen
  und alles Private gestrichen.
- **[Vorschlag]** Messungen: je mechanischer Uhr 5–15 Messungen über einige Wochen, damit der Gangverlauf eine Kurve
  zeigt, gemischt aus Zeitwaage, Mikrofon und Zeitvergleich und in mehreren Lagen.
- **[Vorschlag]** Tragetagebuch: etwa 60 Tage mit einem erkennbaren Muster (eine Lieblingsuhr, eine „lange nicht
  getragen“), damit Wristcheck-Vorschläge und Kalender etwas zeigen. Vorerst ohne Handgelenk-Fotos.
- **[Vorschlag]** **Datum mitwandern lassen:** In `demo.json` stehen Tage relativ zu heute (z. B. `"tag": -1` für gestern).
  Beim Laden rechnet die App sie auf echte Daten um. So steht „gestern getragen“ an jedem Tag richtig, auch in einem
  Jahr. Ohne das würde die Demo schnell alt aussehen („zuletzt vor 400 Tagen“).
- **[fest]** Die Werte stehen im Sicherungsformat (deutsche Auswahlwerte als Schlüssel), wie in `SPEC-englisch.md`
  Abschnitt 2.

## 4. Sprache der Demo

- **[fest, 29.10.2026]** Gewählt ist (a). Freitexte der Uhren (Zifferblatt, Lünette, Notizen) sind Nutzertext und werden nie übersetzt. Auf Englisch
  stünden also deutsche Beschreibungen in der Demo.
  - (a) **Zwei Dateien** `demo.json` und `demo-en.json` mit gleichen Daten und übersetzten Freitexten, gewählt nach der
    Sprache der Oberfläche (gewählt). Auswahlwerte bleiben in beiden gleich, nur die Freitexte unterscheiden sich.
  - (b) Freitexte in der Demo kurz halten und englisch schreiben (Uhrenforen-Englisch geht auch für Deutsche).
  - (c) Deutsch lassen.

## 5. Größe und Offline

- **[Vorschlag]** `demo.json` und ihre Fotos kommen **nicht** in den Service-Worker-Vorabspeicher. Sie werden erst beim
  Tipp auf den Knopf geladen. Wer die Demo nie öffnet, lädt nichts. Fotos verkleinert (≈ 800 px, JPEG), Ziel unter 1 MB
  gesamt.
- **[Vorschlag]** Offline ohne vorher geladene Demo: Hinweis „Beispiel-Sammlung braucht einmal Internet“.

## 6. Englische Manifest-Screenshots

- **[Vorschlag]** Mit der Demo im Browser-Fenster aufnehmen: Handy 1080 × 2340 (wie `screenshot-handy.png`) und Desktop
  (wie `screenshot-desktop.png`), je Sprache. Neue Dateien `screenshot-handy-en.png` und `screenshot-desktop-en.png`,
  eingetragen in `manifest-en.webmanifest`. Die deutschen Bilder werden mit derselben Demo neu aufgenommen, damit sie
  nicht mehr deine echte Sammlung zeigen.
- **[fest, 29.10.2026]** Handy-Bilder: **Sammlung**, **Detailseite mit Gangkurve** und **Tragekalender**, je Sprache
  (`screenshot-handy-1…3.png`, `-en` für Englisch). Desktop ein Bild (Sammlung).

## 7. Testen

- **[fest]** Im Browser-Fenster (launch.json `uhrenbox`, `/pwa/index.html`): Knopf bei leerer Sammlung, `?demo=1`
  in beiden Sprachen, Handygröße 375 px und Desktop.
- **[fest]** Gegenprobe: eine echte Sicherung aus `Sicherungen/` laden, dann die Demo öffnen und wieder schließen. Die
  echte Sammlung muss unverändert sein (Anzahl Uhren, Messungen, Tragetage, Fotos).
- **[fest]** `sw.js` `VERSION` hochzählen.

## Offen

- **[fest, 29.10.2026]** Eintrag auch in den Einstellungen: ja (siehe 1).
- **[fest, 29.10.2026]** Handgelenk-Fotos: erst ohne. Die Tragetage der Demo haben vorerst kein Foto, das kann später dazukommen.

Entschieden am 29.10.2026: echte Uhren ohne Preise und Händler, eigener Demo-Speicher `?demo=1`, zwei Dateien
deutsch/englisch, Screenshots Sammlung + Detailseite + Tragekalender.
