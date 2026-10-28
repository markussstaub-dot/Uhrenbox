# Zeitwaage – Specsheet

Gang direkt in der Uhrenbox messen statt mit der App „Watch Accuracy Meter“. Zwei Wege: **per Tipp** gegen die Handyuhr (Basis, einfach, über Stunden oder Tage) und **akustisch** übers Mikrofon (Zeitwaage, Ergebnis in einer Minute). Alles läuft auf dem Gerät, offline, ohne Server.

## Einschätzung vorab (einfacher Weg zuerst)

- **M1 allein deckt den heutigen Gebrauch ab** (das, was „Watch Accuracy Meter“ heute macht). Aufwand: etwa eine Session. Über 24 h ist der Tipp sogar genauer als die Akustik: ±0,2 s/Tag gegenüber ±1–4 s/Tag ohne Kalibrierung, und er misst den echten Gang am Arm.
- **M2 ist der große Brocken**: Erkennung schreiben und abstimmen, Kalibrierung, Tests mit echten Uhren. Aufwand: mehrere Sessions, Ergebnis vorher nicht sicher. Lohnt sich für Lagen-Messungen, Abfallfehler und schnelle Kontrolle nach dem Aufziehen.
- **M3 (Amplitude)** nur, wenn M2 am Fold stabil läuft.

## M1 „Gang per Tipp“ (Basis)

### Ablauf

- **[fest]** Neuer Knopf **„⏱ Gang per Tipp“** im Messungen-Panel der Uhr und in der Ansicht Messungen (neben „+ Messung“). Öffnet ein Vollbild-Fenster mit großer Tipp-Fläche.
- **[Vorschlag]** Ablauf wie bei „Watch Accuracy Meter“: Der Nutzer tippt in dem Moment, in dem der Sekundenzeiger der Uhr auf **12** steht. Danach fragt die App „Welche Uhrzeit zeigte die Uhr?“ und schlägt die nächstliegende volle Minute zur Handyzeit vor (Stunde und Minute mit ±-Knöpfen änderbar). Abweichung = gezeigte Uhrzeit − Handyzeit beim Tipp.
- **[Vorschlag]** Optional **3 Tipps** an drei aufeinanderfolgenden Minuten, die App nimmt den Mittelwert. Das glättet das Zittern der Reaktionszeit (ca. 0,1–0,2 s).
- **[fest]** Der erste Tipp ist der **Startpunkt**. Jeder weitere Tipp ergibt eine **Messung gegen den vorigen** und wird selbst neuer Startpunkt (Kette). Gang = (Abweichung neu − Abweichung alt) ÷ Zeitraum in Tagen.
- **[fest]** Nach dem Tipp fragt die App „Uhr jetzt neu gestellt?“. Bei Ja beginnt die Kette neu (nächster Tipp ist wieder nur Startpunkt).
- **[Vorschlag]** Hinweis bei weniger als 12 h Abstand („kurzer Zeitraum, Ergebnis ungenau“), gespeichert wird trotzdem.
- **[Vorschlag]** Ergebnisfenster zeigt Gang in s/Tag mit Toleranz-Farbe wie bisher, dazu die **Gang-Prognose** in einem Satz: „Bei +6 s/Tag ist die Uhr in 10 Tagen eine Minute vor.“ (kleiner Zusatz, erfüllt den Roadmap-Punkt „Gang-Prognose“ zum Teil).

### Referenzzeit

- **[fest]** Referenz ist die **Systemzeit des Handys**. Bei „Datum und Uhrzeit automatisch“ gleicht Android sie über das Netz (NTP/Mobilfunk) ab, meist auf Zehntelsekunden genau. Für den Gang zählt nur, dass sie zwischen zwei Tipps nicht springt. Eine feste Abweichung der Handyuhr fällt heraus, ebenso eine gleichbleibende Reaktionszeit.
- **[fest]** Zeitstempel des Tipps aus dem Ereignis selbst (`performance.timeOrigin + event.timeStamp` bei `pointerdown`), nicht erst im Handler gemessen.
- **[Vorschlag]** Kein Abgleich mit einem Zeitserver im Internet. Bleibt offline, und der Gewinn ist bei 24 h Abstand gering. Einmaliger Hinweis im Fenster: „Automatische Uhrzeit am Handy muss an sein.“

### Daten

- **[Vorschlag]** Messung als vorhandene Art `kind: 'vergleich'` mit `deviation` (s) und `days`. Dazu neue, optionale Felder `method: 'tipp'`, `offStart`, `offEnd` (Abweichungen in s). Gangverlauf, Tabelle, Vergleich und ältere App-Versionen zeigen das ohne Änderung. Lage optional (`position`, Voreinstellung „Am Handgelenk“).
- **[Vorschlag]** Der offene Startpunkt liegt an der Uhr: `tippStart: { at, offset }`. Damit ist er automatisch in „Sichern/Laden“, ohne neue Sammlung.

### Nur am echten Handy prüfbar

- Wie gut der Tipp auf dem Fold-Innendisplay trifft (Reaktionszeit, versehentliche Gesten).
- Vergleich mit „Watch Accuracy Meter“: dieselbe Uhr 24 h parallel in beiden Apps messen.

## M2 „Akustische Zeitwaage“ (Premium-Kandidat laut Roadmap)

### Aufnahme

- **[fest]** `getUserMedia` direkt in der PWA, kein Capacitor. Einstellungen: `echoCancellation: false`, `noiseSuppression: false`, `autoGainControl: false`, `channelCount: 1`. Sonst filtert Chrome genau die Ticks weg bzw. verzerrt ihre Lautstärke.
- **[fest]** Rohdaten über ein `AudioWorklet`. Der `AudioContext` läuft mit der **eigenen Abtastrate des Mikrofons** (`track.getSettings().sampleRate`, am Fold vermutlich 48 kHz), damit Chrome nicht umrechnet.
- **[fest]** Während der Messung bleibt der Bildschirm an (Wake Lock), sonst stoppt Android das Mikrofon. Mikrofon wird nach der Messung sofort freigegeben.
- **[fest]** Mikrofon-Auswahl, falls mehrere Eingänge da sind (`enumerateDevices`), etwa ein angestecktes USB-C-Kontaktmikrofon.

### Auswertung

- **[fest]** Die Auswertung ist eine reine Funktion `analyseTicks(samples, sampleRate, opts)` ohne Oberfläche. So lässt sie sich im Browser mit aufgenommenen WAV-Dateien testen, bevor sie ans Handy geht.
- **[Vorschlag]** Schritte:
  1. Hochpass (ca. 1–2 kHz), dann Hüllkurve (Betrag, geglättet).
  2. **Frequenz**: Autokorrelation der Hüllkurve über einige Sekunden, auf die nächste übliche Frequenz runden (18.000 / 19.800 / 21.600 / 25.200 / 28.800 / 36.000 A/h). Ist an der Uhr `bph` eingetragen, gilt das als Vorgabe, die Erkennung prüft nur.
  3. **Ticks finden**: in einem Fenster um die erwartete Zeit den Anstieg der Hüllkurve suchen. Aussetzer und Störspitzen verwerfen.
  4. **Gang**: Gerade durch die Tick-Zeitpunkte legen, getrennt für Tick und Tack. Gang (s/Tag) = (Soll-Periode − Ist-Periode) ÷ Ist-Periode × 86.400.
  5. **Abfallfehler**: halber Unterschied zwischen Tick→Tack und Tack→Tick, in ms.
  6. **Güte**: Anteil der erkannten Ticks und Streuung um die Gerade. Unter einer Schwelle zeigt die App „zu laut / zu leise“ statt eines Werts.
- **[Vorschlag]** Anzeige live: Frequenz, Gang, Abfallfehler, Güte, dazu der klassische **Zeitwaagen-Streifen** (Punkte je Tick, Steigung = Gang). Messdauer 30–60 s, die ersten Sekunden nach dem Ablegen verwerfen.

### Kalibrierung der Abtastrate

- **[fest]** Die Abtastrate des Handys weicht um einige ppm ab, 1 ppm = 0,0864 s/Tag. Bei 10–50 ppm sind das **±1–4 s/Tag** Fehler. Ohne Kalibrierung zeigt die App das als Hinweis an der Messung.
- **[Vorschlag]** Zwei Wege, das Ergebnis (Korrektur in ppm) wird je Gerät gespeichert:
  - **Gegen die Systemzeit**: 15–30 min Aufnahme laufen lassen (Handy liegt still, keine Uhr nötig), gezählte Samples gegen die Systemzeit. Einzelne Zeitstempel zittern um Millisekunden, deshalb Gerade über viele Messpunkte und lange Dauer.
  - **Mit einer Quarzuhr**: deren Sekundenticks akustisch messen. Ihr wahrer Gang ist aus M1 bekannt (Tipp-Messung über Wochen, steht schon in der Sammlung), der Rest ist der Fehler des Handys.
- **[Vorschlag]** Die Korrektur liegt in den Geräte-Einstellungen (`localStorage`), nicht in der Sicherung, weil sie nur für dieses Handy gilt. An jeder Messung wird die verwendete Korrektur mitgespeichert (`calibPpm`).

### Daten

- **[fest]** Ergebnis wird eine normale Zeitwaagen-Messung: `kind: 'waage'` mit `position`, `rate`, `beatError`, `bph`; `amplitude` bleibt leer bis M3.
- **[Vorschlag]** Neue, optionale Felder: `method: 'mikro'`, `dur` (Messdauer in s), `quality` (0–1), `calibPpm`. Ältere Versionen ignorieren sie.

### Nur am echten Handy prüfbar

- Getestet wird am **Z Fold6 in Chrome**: welches Mikrofon Chrome nimmt (unten / oben), ob die drei Filter wirklich aus sind (`getSettings()` prüfen), Abtastrate, Verhalten auf Außen- und Innendisplay.
- Gegenprobe: eine Uhr per Mikrofon messen und 24 h per Tipp (M1); dazu eine Quarzuhr.
- iPhone Safari: `getUserMedia` geht in der installierten App, ungetestet.

### Stand Prototyp (28.10.2026)

Prototyp `Uhrenbox/zeitwaage-labor/` (außerhalb dieses Repos): `analyse.js` (Auswertung, reine Funktionen), `synth.js`
(Testuhr), Labor-Seite mit allen Stufen als Diagramm, `node --test` mit 15 Tests, davon 3 echte Aufnahmen vom Fold6
(`aufnahmen/`). Live am Fold6 über USB (`adb reverse`, `localhost`) gemessen:

| Uhr | A/h | Gang s/Tag | Abfallfehler ms | Streuung ms | Bemerkung |
|---|---|---|---|---|---|
| PT5000 (ETA-2824-Klon) | 28.800 | −1 … −8 (je nach Lage) | 0,3 | 0,14 | „Watch Accuracy Meter“: +2, Abfall 0,2 |
| Seiko NH35 | 21.600 | ≈ +10 | 0,8 | 0,10 | leise |
| Sea-Gull ST2130 | 28.800 | +6,2 … +7,0 | 0,4 | 0,06 | sauberstes Signal, Amplitude ≈ 330° (L 50°) |
| Omega Seamaster Co-Axial | 25.200 | ≈ +10 ± 4 | 0,3–0,7 | 0,9 / 1,5 | Tick und Tack klingen verschieden |
| Moonswatch (Quarz) | 3.600 | +1,0 über 2 min | – | 1–2 | Referenz; über 60 s noch +2,5 … +8,5 (todo) |
| Mecaquartz (6 Schritte/s) | – | – | – | – | für das Handymikrofon nicht hörbar |

Erkenntnisse, die in die Umsetzung gehören:
- **Takt des Fold6** gegen die Systemuhr: −1 … +1 ppm (≈ 0,1 s/Tag). Zeitstempel dafür **im AudioWorklet** setzen; im
  Hauptprogramm kommen Blöcke verzögert an und täuschen bis −1000 ppm vor. Kalibrierung ist für das Fold6 kaum nötig,
  die Anzeige bleibt als Kontrolle.
- **Frequenz**: vor der Autokorrelation langsame Lautstärke-Schwankungen abziehen und einzelne Stöße kappen (ein
  Feuerzeug-Klick hat sonst 36.000 statt 28.800 ergeben); kürzeste fast gleich hohe Spitze nehmen (Oktavfehler).
- **Tick-Zeitpunkt**: Kandidat im Suchfenster nur, wer im Umkreis von ±2 ms die höchste Spitze ist und mindestens halb
  so laut wie ein typischer Tick; davon der, der der Erwartung am nächsten liegt (nicht der lauteste: Störklicks).
  Startphase per Faltung der ersten 6 s, Lautstärke dabei gedeckelt.
- **Güte**: Messungen mit Güte < 80 % oder Streuung > 0,5 ms gelten als unsicher und zählen nicht. Live zusätzlich ein
  ruhiger Wert (Median der letzten guten Messungen).
- **Quarz** (1 Tick/s): eigenes Erkennungsfenster um 1 s und Auswertung über 2 min statt 20 s. Template-Matching senkt
  die Streuung, verschiebt beim Quarz aber den Gang, deshalb vorerst aus.

### Einbau in die Uhrenbox (28.10.2026)

- **[fest]** Kein neuer Tab und keine eigene App. Im Messungs-Formular bei Art „Zeitwaage“ ein Knopf
  **„🎙 Mit dem Mikrofon messen“**. Er öffnet ein Vollbild-Messfenster: Lage wählen, Uhr auflegen, live Gang,
  Abfallfehler, Güte, ruhiger Wert und Zeitwaagen-Streifen. **„Übernehmen“** füllt die vorhandenen Felder (Gang,
  Abfallfehler, A/h, Lage, Amplitude nur mit Hebungswinkel); gespeichert wird wie bisher im Formular.
- **[fest]** Frequenz wird nicht im Messfenster abgefragt, sondern aus der Uhr genommen, in dieser Rangfolge:
  1. A/h an der Uhr eingetragen → gilt als Vorgabe, die Erkennung prüft nur und warnt bei Widerspruch („Gehört wird
     21.600, eingetragen sind 28.800. Richtige Uhr?“).
  2. Nur die Werk-Art bekannt (`isMech`) → Quarz: 1-Hz-Suche und 2-min-Fenster; mechanisch: nur mechanische Frequenzen.
  3. Nichts bekannt → erkennen; nach der ersten guten Messung anbieten, die erkannte Frequenz an der Uhr zu speichern.
  Manuelle Frequenz nur versteckt unter „Erweitert“.
- **[fest]** Eine Auswertung für beide: `analyse.js` wandert als `pwa/zeitwaage.js` in dieses Repo, das Labor lädt sie von
  dort. Die Uhrenbox lädt sie erst beim Öffnen des Messfensters (`import()`), der Service Worker nimmt sie für offline mit.
- **[Vorschlag]** Neues Uhrenfeld **Hebungswinkel** (`liftAngle`, °); ohne Wert keine Amplitude. Werte des Nutzers:
  NH35 53°, ETA 2824 / PT5000 / ST2130 50°. Co-Axial unbekannt.
- **[Vorschlag]** Längeres Fenster (bis 2 min) auch bei mechanischen Uhren mit hoher Streuung (Co-Axial).
- **[Vorschlag]** Zusatzfelder an der Messung wie oben unter „Daten“ (`method: 'mikro'`, `dur`, `quality`, `calibPpm`).
- **[Vorschlag]** Bis die Premium-Frage entschieden ist, kommt die Zeitwaage ohne Kennzeichnung in die Basis.
- Nur am Handy prüfbar: Mikrofon über HTTPS (GitHub Pages) ohne USB, installierte PWA, Bildschirm-Sperre während der Messung.

### Umgesetzt (28.10.2026)

- `zeitwaage-labor/analyse.js` ist jetzt `pwa/zeitwaage.js`; Labor (`labor.js`) und Tests importieren von dort. Dazu dort
  gemeinsam: Worklet, Mikrofon-Einstellungen, Güte-Grenzen, Takt-Messung. Neu: Option `nurMech` (Quarz-Erkennung aus).
  Das Labor läuft jetzt über `node zeitwaage-labor/server.mjs` (liefert nur `zeitwaage-labor/` und `pwa/` aus).
- Messungs-Formular, Art Zeitwaage: Knopf „🎙 Mit dem Mikrofon messen“ → Vollbild-Fenster mit Lage, Start/Stopp, ruhigem
  Wert (Median der letzten 5 guten), Gang, Abfallfehler, Güte, gehörter Frequenz, Streifen (oben = Tick zu früh, eine
  vorgehende Uhr steigt). „Übernehmen“ füllt Gang, Abfallfehler (2 Nachkommastellen, Feld jetzt `step 0.01`), A/h, Lage,
  Amplitude (nur mit Hebungswinkel), Zeitpunkt = jetzt; Mikrofon wird dabei sofort freigegeben. Wake Lock während der
  Messung; App im Hintergrund → Messung stoppt sauber.
- Frequenz-Rangfolge wie oben, inklusive Warnung („Gehört wird …“, erst wenn dreimal gleich gehört) mit Knopf „Mit … messen“
  und dem Angebot „An der Uhr speichern“ (bei erkanntem Quarz: Werk-Art Quarz). Von Hand unter „Erweitert“, dort auch
  die Mikrofon-Auswahl (nur bei mehr als einem Eingang).
- Lage wechseln während der Messung: 2 s Einschwingen, ruhiger Wert beginnt neu.
- Messfenster 20 s; 120 s bei Quarz und bei mechanisch mäßig hoher Streuung (0,5–2 ms, zweimal hintereinander).
- **Quarz**: Streuungsgrenze 2 ms statt 0,5 ms (bei 1 Tick/s über 120 s ≈ ±0,3 s/Tag), Werte zählen erst ab 110 s Fenster
  („vorläufig“), weil der Prototyp unter 2 min +2,5 … +8,5 s/Tag zeigte.
- Amplitude: nur Werte von 150–360° werden gezeigt und übernommen (an der 28.800-Aufnahme kam sonst 82° heraus).
- Daten: `liftAngle` an der Uhr; `method: 'mikro'`, `dur`, `quality`, `calibPpm` an der Messung, bleiben beim Ändern
  erhalten. Kennzeichen 🎙 in der Messungs-Tabelle. Ältere Messungen ohne diese Felder unverändert.
- `calibPpm` = verwendete Korrektur aus `localStorage` `uhrenbox.zeitwaage` (`{ calibPpm }`), bisher ohne Oberfläche, also 0.
- Service Worker: `zeitwaage.js` im Cache, Version `uhrenbox-v5`.
- Testschalter am PC: `?zwtest=<WAV-Pfad>` spielt eine Aufnahme statt des Mikrofons ein (gleicher Weg ab dem Worklet).
- Noch offen: Kalibrier-Oberfläche (Takt gegen Systemzeit, 15–30 min), Live-Test am Fold6 über GitHub Pages.

## M3 „Amplitude“ (Stufe danach)

- **[fest]** Amplitude braucht den **Hebungswinkel** des Kalibers (oft 50–53°, z. B. ETA 2824 52°) und die **drei Teilgeräusche** eines Ticks (Entriegeln, Impuls, Fall). Gemessen wird die Zeit t vom ersten bis zum dritten Teilgeräusch. Amplitude = Hebungswinkel ÷ (2 · sin(π · t ÷ T)), T = Schwingungsdauer der Unruh.
- **[Vorschlag]** Neues Uhrenfeld `liftAngle` (°) im Uhr-Formular. Leer → Amplitude wird nicht angezeigt statt geraten. Später füllt die **Kaliber-Datenbank** das Feld vor (zusammen mit `bph`).
- **[Vorschlag]** Amplitude nur anzeigen, wenn die Teilgeräusche sauber getrennt sind (eigene Güte). Das wird mit dem Handymikrofon am ehesten scheitern; ein Kontaktmikrofon hilft hier am meisten.
- **[Vorschlag]** Mit Amplitude und Abfallfehler im Verlauf bekommt die **Gang-Analyse in Worten** (KI-Premium) ihre Daten („Amplitude fällt seit 4 Monaten …“).

## M4 „Messreihe in 5 Lagen“ (Vorschlag)

- **[Vorschlag]** Baut auf M2 auf und ersetzt den Roadmap-Punkt **Messreihen-Assistent**: statt 24 h je Lage dauert eine Reihe wenige Minuten.
- **[Vorschlag]** Der Assistent führt durch **5 Lagen** aus der vorhandenen Lagen-Liste (Voreinstellung: Zifferblatt oben, Zifferblatt unten, Krone unten, Krone links, Krone oben; änderbar). Je Lage: Ansage „Uhr mit Krone links hinlegen“, 15 s Beruhigung, 30–60 s Messung, weiter.
- **[Vorschlag]** Ergebnis: 5 Messungen mit gemeinsamer `seriesId`, dazu Mittelwert, **Delta** (größter minus kleinster Gang) und Abfallfehler je Lage.
- **[Vorschlag]** **Beste Ablage-Lage für die Nacht**: Aus der aktuellen Abweichung (letzter Tipp, M1) und dem Gang je Lage schlägt die App die Lage vor, die die Uhr bis morgen früh wieder näher an 0 bringt („geht 8 s vor → nachts Krone oben, dort −4 s/Tag“).
- **[Vorschlag]** Ohne M2 ginge der Assistent auch per Tipp (je Lage einige Stunden), das ist aber mühsam. Deshalb erst nach M2.

## Risiken

- **Abtastrate**: ±1–4 s/Tag ohne Kalibrierung (siehe oben). Kann zusätzlich mit der Temperatur des Handys wandern → Kalibrierung gelegentlich wiederholen, Datum der letzten Kalibrierung anzeigen.
- **Störgeräusche**: Raum, Tisch, Hände, Lüfter. Abhilfe: Uhr direkt aufs Mikrofon legen, weiche Unterlage, stiller Raum. **Kontaktmikrofon** (Piezo am USB-C-Adapter, ca. 10–30 €) als Option, die App wählt es über die Mikrofon-Auswahl.
- **Leise Werke**: manche Automatikwerke und Uhren mit dickem Boden sind kaum zu hören → klare Meldung „Ticks nicht erkannt“, keine Fantasiewerte.
- **Chrome/Android**: Mikrofon stoppt bei Bildschirm aus oder App im Hintergrund; Berechtigung nur über HTTPS bzw. localhost (GitHub Pages und `Uhrenbox-starten.cmd` passen).
- **Erwartung**: Eine Handy-Zeitwaage ersetzt kein Witschi-Gerät. Ziel ist „Trend und grober Wert“, das sollte die App auch so sagen.

## Testweg

- **[Vorschlag]** Erst im Browser am PC: einige WAV-Aufnahmen echter Uhren (am Fold aufgenommen, verschiedene Frequenzen, eine Quarzuhr, eine laute Umgebung) in einer Testseite durch `analyseTicks` schicken und mit „Watch Accuracy Meter“ bzw. M1 vergleichen. Danach erst am Fold live messen.

## Offen (Fragen an Markus)

1. **[offen]** M1-Ablauf: Passt „Tipp, wenn der Sekundenzeiger auf 12 steht, dann Uhrzeit bestätigen“ so, wie du es von „Watch Accuracy Meter“ kennst? Oder misst du dort anders (z. B. Uhrzeit vorher wählen, dann tippen)?
2. **[offen]** Soll die akustische Zeitwaage (M2–M4) wie in der Roadmap **Premium** werden oder in die Basis? Davon hängt ab, ob sie schon jetzt einen Schalter bzw. eine Kennzeichnung bekommt.
3. ~~Quarzuhr und Kontaktmikrofon~~ **[fest, 28.10.2026]** Quarz-Referenz ist die Moonswatch; das Handymikrofon reicht für
   alle gemessenen mechanischen Uhren, ein Kontaktmikrofon ist vorerst nicht nötig. Kalibrierung läuft gegen die Systemzeit.
