# Wristcheck Light – Specsheet

Basis-Funktion, kostenlos, ohne KI. „Was trage ich gerade?“ → Foto → Uhr antippen → Tragetag mit Foto.

## Ablauf

- **[fest]** Knopf **„📷 Was trage ich?“** öffnet direkt die Rückkamera (`<input type="file" accept="image/*" capture="environment">`, kein getUserMedia, keine Kamera-Berechtigung nötig).
- **[fest]** Gleichzeitig öffnet sich ein Fenster „Was trage ich?“. Nach dem Foto zeigt es das Foto und die **3 wahrscheinlichsten Uhren** plus **„Andere Uhr wählen“** (klappt alle tragbaren Uhren auf).
- **[fest]** Ein Tipp auf eine Uhr trägt sie für **heute** ins Tragetagebuch ein, mit Foto. Fertig, Fenster zu, Hinweis „… eingetragen“.
- **[fest]** Kamera abgebrochen → das Fenster bleibt mit den Vorschlägen offen, Eintragen geht auch ohne Foto. Im Fenster gibt es „Foto machen“ (Kamera) und „Aus Galerie“ (ohne `capture`, für ein schon gemachtes Foto).
- **[fest]** Kurzbefehl im Manifest **„Was trage ich?“** (`?aktion=wristcheck`) neben „Heute getragen“. Weil Browser die Kamera nur nach einem echten Tipp öffnen dürfen, öffnet der Kurzbefehl das Fenster; die Kamera kommt mit einem Tipp auf „Foto machen“.
- **[Vorschlag]** Knopf an zwei Stellen: Sammlung (Kachel „Heute am Handgelenk“) und Tragetagebuch (Tagesfeld).

## Vorschläge (Regeln)

- **[fest]** Kandidaten: alle Uhren außer „Bestellt“ und „Verkauft“.
- **[Vorschlag]** Punkte je Uhr, die drei besten werden gezeigt, mit kurzem Grund:
  - heute schon eingetragen → ganz oben („heute schon eingetragen“, Tipp ergänzt nur das Foto)
  - gestern getragen → +5 („gestern getragen“)
  - in den letzten 3 Tagen getragen → +2 („zuletzt am …“)
  - an diesem Wochentag in den letzten 8 Wochen getragen → +1,5 je Mal („oft am Dienstag“)
  - sonst: am längsten nicht getragen bzw. noch nie → kleiner Bonus, damit auch „mal wieder“-Uhren auftauchen („seit 24 Tagen nicht am Arm“)
- **[fest]** Aufbau für später: `wristSuggestions(tag)` liefert eine sortierte Liste `{ uhr, punkte, grund }`. Eine spätere lokale Erkennung (Premium) bekommt Liste + Foto und **sortiert nur um** (`reorder(liste, foto)`), die Oberfläche bleibt gleich. Heute ist `reorder` leer.

## Daten

- **[fest]** Foto wird wie alle Fotos der App gespeichert: auf max. 1600 px verkleinert, JPEG, in IndexedDB (`photos`), kommt mit in „Sichern/Laden“.
- **[Vorschlag]** Tragetag-Eintrag bekommt ein optionales Feld `shots: { uhrId: fotoId }` neben `watches`. Alte Sicherungen bleiben gültig, ältere App-Versionen ignorieren das Feld.
- **[Vorschlag]** Neues Foto für dieselbe Uhr am selben Tag ersetzt das alte (das alte wird gelöscht). Wird die Uhr aus dem Tag ausgetragen, fällt ihr Foto mit weg.
- **[Vorschlag]** Sichtbar: Im Tragetagebuch beim gewählten Tag als Vorschaubild (Tipp = groß ansehen), im Kalender bekommen Tage mit Foto einen kleinen Punkt.

## Entschieden (28.10.2026)

- **[fest]** Ist heute schon eine andere Uhr eingetragen, kommt die gewählte **dazu** (Uhrwechsel).
- **[fest]** Ein Foto pro Uhr und Tag, ein neues **ersetzt** das alte.
- **[fest]** Eigenes schlichtes **Kamera-Icon** für den Kurzbefehl.

## Nur am echten Handy prüfbar

- Ob `capture="environment"` wirklich direkt die Rückkamera öffnet (Android Chrome: ja; iPhone Safari: ja, bietet teils Auswahl an).
- Kurzbefehl per langem Druck aufs App-Icon (nur in der installierten App).
