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

### Variante „Gang per Foto“ (Idee 28.10.2026)

- **[Vorschlag]** Statt im richtigen Moment zu tippen: Uhr oder Wecker **fotografieren**. Das Foto friert den Moment
  ein, die Reaktionszeit fällt weg. Die App zeigt das Foto groß (zoombar) und schlägt die Handyzeit vor; der Nutzer
  korrigiert auf die abgelesene Zeit **mit Sekunden**. Danach wie oben: erstes Foto = Startpunkt, jedes weitere eine
  Messung gegen das vorige (Kette, `method: 'foto'`).
- **[Vorschlag]** Genauigkeit: mit Sekundenzeiger ±0,5 s je Ablesung, über 7 Tage ≈ 0,15 s/Tag. Ohne Sekundenzeiger
  ±15–30 s je Ablesung, dann nur über Wochen sinnvoll; die App sagt das dazu. Gut für Quarz, Wecker und den Gang am Arm.
- **[fest]** Kein automatisches Ablesen der Zeiger: auf beliebigen Zifferblättern offline zu unsicher, Abtippen dauert
  Sekunden. (Später allenfalls KI-Premium bzw. Digitalanzeigen.)
- **[offen]** Zeitstempel: EXIF `DateTimeOriginal` (+ `SubSecTimeOriginal`) des Fotos, falls Chrome ihn beim Weiterreichen
  an die Web-App behält; sonst `file.lastModified` bzw. Zeitpunkt der Ankunft in der App mit einmal ausgemessenem
  Versatz. Am Fold prüfen.
- **[Vorschlag]** Das Foto bleibt optional an der Messung (wie beim Wristcheck verkleinert), als Beleg.

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
- **[fest]** Die Zeitwaage ist Freeware und gehört in die Basis, ohne Kennzeichnung (siehe Offen 2).
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

### Befund Quarz am Fold6 (28.10.2026, abends, per USB mit dem Labor)

- **Mechanisch ≈ „Watch Accuracy Meter“**: Markus hat mehrere mechanische Uhren mit beiden Apps gemessen, die Werte
  sind fast identisch.
- **Quarz als 18.000 erkannt, Güte nie über 20 %**: Unter ≈ 20 s reicht die Autokorrelation nicht für den
  Quarz-Nachweis. Abhilfe Gegenprobe mit 1 Tick/s bei Güte < 50 % (in `zeitwaage.js`, Test „Quarz in kurzen Fenstern“).
- **Mecaquartz tickt nicht sicher einmal pro Sekunde.** Die App setzt Mecaquartz heute mit 1 Tick/s gleich, das ist
  falsch, sobald keine laufende kleine Sekunde da ist bzw. der Chrono läuft.
- **Seiko VH31**: macht **4 Schritte/s** (Takt 250 ms), extrem leise (Spitze 0,001–0,002, Moonswatch 0,27), nur über
  4 kHz. Tick für Tick nicht zu finden (Güte < 5 %). Mit **Faltung** (5-s-Abschnitte = 20 Schritte im Soll-Takt
  übereinanderlegen, Lage der Spitze je Abschnitt, Gerade) Phasenstreuung 0,36 ms, Gang ≈ +0,5 s/Tag. Gegenprobe:
  falsche Perioden 2,7–5,6 ms, ohne Uhr 8,2 ms. Flach aufgelegt besser als angedrückt (Griffgeräusche).
- **Seiko VK63** (Chrono gestoppt): mit dem Handymikrofon **nicht hörbar** (Spitze 0,0005, kein Takt bei keiner Periode).
- **Moonswatch** per Faltung: Gang ≈ +7 … +8,5 s/Tag, sehr gleichmäßig. Ob die Uhr wirklich so vorgeht, klärt erst
  eine Tipp-Messung über Tage (M1).
- **Display aus macht Aufnahmen unbrauchbar, unauffällig**: Mit schlafendem Handy zeigte die Takt-Messung −382 ppm und
  die Aufnahme einen exakt 250 ms periodischen Schein-Takt. Auch einmal mit Display an −1161 ppm (Ursache unklar, die
  WAV hatte keine erkennbaren Lücken).
- **[Vorschlag]** Eigenes Quarz-Verfahren: Faltung im bekannten Takt statt Tick-Suche; Muster ohne den jeweiligen
  Abschnitt bilden (sonst passt Rauschen auf sich selbst und täuscht Präzision vor); schmales Suchfenster (±10 ms)
  von Abschnitt zu Abschnitt; Hochpass 4 kHz für leise Schrittmotoren prüfen; Quarz-Takte 1/s und 4/s.
  Versuchsskripte: `zeitwaage-labor/quarz-falten.mjs`, `quarz-takt.mjs`, `quarz-profil.mjs`, `quarz-luecken.mjs`.
- **[Vorschlag]** Takt-Wächter in der App: Weicht die Takt-Messung um mehr als ≈ 20 ppm ab, Messung als gestört
  markieren („Bildschirm war aus oder Aufnahme hatte Aussetzer“).
- **[Vorschlag]** Mecaquartz und nicht hörbare Quarzwerke: klarer Hinweis im Messfenster „akustisch nicht messbar,
  ‚Abgleich mit Funkuhr‘ nutzen“ statt Messung mit falschem Takt.
- **[fest, 28.10.2026]** Schlüssel ist das **Kaliber** (Uhrenfeld `movement`, heute Freitext „Kaliber“), nicht die
  Werk-Art: Daraus folgt, welche Ticks wie oft kommen sollten. Rangfolge dann: A/h an der Uhr → Kaliber → Werk-Art →
  erkennen.
- **[Vorschlag]** Kleine eingebaute Kaliber-Tabelle (Anfang der Roadmap-„Kaliber-Datenbank“): je Kaliber Art, Takt
  (A/h bzw. Schritte/s), Hebungswinkel, Hinweis „akustisch nicht messbar“. Abgleich tolerant (Groß/Klein, Leerzeichen,
  „Seiko“-Vorsilbe). Erste Einträge aus Markus' Sammlung: NH35 (21.600, L 53°), ETA 2824 / PT5000 / ST2130 (28.800,
  L 50°), VH31 (Quarz, 4 Schritte/s), VK63 (Mecaquartz, nicht hörbar), Omega Co-Axial (25.200, L offen). Unbekanntes
  Kaliber → wie bisher über die Werk-Art. Die Tabelle füllt auch `bph` und `liftAngle` im Uhrenformular vor (M3).
- Aufnahmen: `aufnahmen/2026-10-28-fold6-vh31.wav` (gut), `-vh31-angedrueckt.wav`, `-vh31-display-aus.wav` (gestört),
  `-vk63.wav`, `-ohne-uhr.wav` (Kontrolle).

### Quarz: nur Hinweis (29.10.2026)

- **[fest]** Quarz und Mecaquartz werden **nicht akustisch gemessen**, keine Signalverarbeitung in der App. Ihr Gang
  (oft < 0,5 s/Tag) ist kleiner als das, was das Handymikrofon in Minuten auflöst, und viele Werke sind nicht hörbar.
  Für Automatik bleibt die Zeitwaage, wie sie ist.
- Umsetzung: Im Messungs-Formular steht bei Quarzuhren (Werk-Art Quarz/Mecaquartz, A/h 3.600 oder Kaliber laut Tabelle)
  statt des Mikro-Knopfs ein Hinweis mit „Zum Abgleich wechseln“ (Art „Abgleich mit Funkuhr“). Klingt eine unbekannte
  Uhr nach Quarz, stoppt die Messung mit demselben Hinweis und dem Angebot „Als Quarzwerk speichern“. Quarz ist aus der
  Frequenzauswahl unter „Erweitert“ entfernt. `analyseQuarz` (Faltung) bleibt in `zeitwaage.js` und im Labor.
- Der richtige Weg für Quarz ist M1 („Gang per Tipp“ / „Gang per Foto“).

## M3 „Amplitude“ (zurückgestellt, 29.10.2026)

- **[fest, 29.10.2026]** M3 ist **runterpriorisiert**: ambitioniert, weil 1 ms Fehler beim Abstand der Teilgeräusche
  ≈ 35° Amplitude ausmacht und ohne Referenzgerät nicht zu entscheiden ist, welche Spitze das Entriegeln ist. Bis dahin
  bleibt die Amplitude experimentell (nur mit Hebungswinkel, nur 150–360°). Gang und Abfallfehler decken die meisten
  Entscheidungen ab.
- **[fest]** Weitermachen erst, wenn **Datenspenden mit Referenzwerten** einer echten Zeitwaage kommen
  (`SPEC-testdaten.md`), eine eigene Zeitwaage da ist oder ein Kontaktmikrofon saubere, getrennte Teilgeräusche liefert.
  Vorher Reihenfolge: Quarz-Hinweis im Messfenster, dann M1 (Tipp und Foto).


- **[fest]** Amplitude braucht den **Hebungswinkel** L des Kalibers (oft 50–53°) und die **drei Teilgeräusche** eines
  Schlags (1 Entriegeln, 2 Impuls, 3 Fall). Gemessen wird die Zeit t vom ersten bis zum dritten Teilgeräusch.
  Amplitude = L ÷ (2 · sin(π · t ÷ T)), T = Schwingungsdauer der Unruh (2 Schläge). Begründung: Die Unruh läuft durch
  den Hebungswinkel nahe ihrer Mitte, also fast mit Höchstgeschwindigkeit; je weiter sie schwingt, desto kürzer ist t.
- **[fest]** Empfindlichkeit: bei 28.800 A/h, L 50°, 270° entspricht 0,1 ms Fehler in t etwa **3,6°**, bei 21.600 A/h,
  L 53°, 240° etwa 2°. 1° Fehler im Hebungswinkel macht 2 % der Amplitude (≈ 5°). Die Trennung der Teilgeräusche muss
  also auf etwa 0,2 ms stimmen; welcher Klick als „erster“ zählt, entscheidet über 50–100°.

### Befund Labor (28.10.2026)

Versuch `zeitwaage-labor/m3-teilgeraeusche.mjs` an den beiden mechanischen Aufnahmen und an der Testuhr. Heute nimmt
`analyse` im gemittelten Schlag (Mittelwert aller geraden Schläge, ausgerichtet auf den lautesten Klick, −25 … +5 ms)
die **erste und die letzte Spitze über 25 % des Maximums**. Das hat vier Schwächen:

1. **Schwelle zu nah am Boden.** Die Hüllkurve von Rauschen ist immer positiv, sie mittelt sich nicht zu null, sondern
   zu einem Boden von ≈ 15 % des Maximums. 25 % liegen nur ≈ 4 dB darüber. Die schwachen Teilgeräusche (Entriegeln
   4–6 dB über dem Boden) liegen genau dort; ob sie mitzählen, ist Zufall.
2. **Letzte Spitze = Nachklingen.** Hinter dem lautesten Klick kommen 0,5–3 ms lang kleine Spitzen desselben Klicks
   (Gehäuse, Tisch). Die letzte davon gilt heute als Klick 3, t wird 1–3 ms zu lang. Nach dem lautesten Klick kommt in
   beiden Aufnahmen bis +40 ms kein weiteres Teilgeräusch: Der lauteste ist der Fall (3).
3. **Mittelwert statt Median.** Ein einzelner Stoß (in der 28.800-Aufnahme ein Schlag mit 28 dB bei −43 ms) bleibt im
   Mittelwert stehen und kann als Klick 1 zählen.
4. **Nur eine Seite.** Es wird nur der „Tick“ (gerade Schläge) ausgewertet. Welche Seite das ist, hängt vom Startpunkt
   ab: dieselbe NH35-Aufnahme ergibt im Labor 281°, mit vorgegebener Frequenz wie in der Uhrenbox 195°.

| Aufnahme | heute | stabile Spitzen (ms vor Klick 3, dB über Boden) | Lage Klick 2 | Amplitude, wenn die früheste Spitze Klick 1 ist | wenn die mittlere Klick 1 ist |
|---|---|---|---|---|---|
| PT5000 28.800, L 50° | 180° ganz; 84° / 82° / 127° in 10-s-Stücken | −14,3 (5) · −9,7 (9) · 0 (20), Tick und Tack | 32 % | **140°** | 206–222° |
| NH35 21.600, L 53° | 281° bzw. 195° | −11,9 (5, nur eine Seite) · −7,2 (12) · 0 (16) | 39 % | **238°** (Hälften 232 / 241°) | 413° (unmöglich) |
| Testuhr 220/270/310° | ±1° | Entriegeln nur 6 dB leiser als der Fall | 35 % | ±1° | – |

- **Die 82°** entstehen, wenn eine Spitze bei −22,5 ms über 25 % kommt (nur in Teilen der Aufnahme, im Median-Schlag
  verschwindet sie) und das Nachklingen bei +1,9 ms als Klick 3 zählt: t ≈ 24 ms. Eine laufende Uhr schwingt nie so
  wenig; das ist kein Teilgeräusch.
- **Muster 1-2-3**: In beiden Uhren liegt das mittlere Teilgeräusch bei 32–39 % der Strecke. Das passt zum Modell
  (Impuls beginnt nach dem Entriegeln, etwa ein Drittel des Hebungswinkels) und spricht dafür, dass die schwache
  früheste Spitze das Entriegeln ist. Bei der NH35 ergäbe die andere Deutung 413°, das kann ein Automatikwerk nicht.
  Bei der PT5000 ergäbe diese Deutung aber nur 140°, ungewöhnlich wenig. **Ohne Referenz nicht entscheidbar.**
- **Sea-Gull ST2130 ≈ 330° (L 50°)** bedeutet t ≈ 6,0 ms. Ohne Aufnahme nicht nachzurechnen. Wahrscheinlich derselbe
  Mechanismus wie oben: Ist das schwache Entriegeln unter der Schwelle, misst die App Impuls → Fall (+ Nachklingen),
  t wird zu kurz und die Amplitude zu hoch. Bei 35 % Impuls-Lage läge der wahre Wert dann eher bei 210–290°. Braucht
  die WAV-Datei (Referenz 1).
- **Testuhr ist zu freundlich**: Entriegeln nur 6 dB unter dem Fall, kein Nachklingen. Am Fold6 liegt das Entriegeln
  11–15 dB unter dem Fall und nur 4–6 dB über dem Boden. Deshalb stimmt heute jede Methode an der Testuhr.
- Tick- und Tack-Seite stimmen bei der PT5000 untereinander je Hälfte auf 0,2–0,4 ms überein: 70 Schläge je Seite
  (20 s bei 28.800) reichen für die Zeitmessung. Das Problem ist die Zuordnung, nicht die Streuung.

### Erkennung der Teilgeräusche

- **[Vorschlag]** Gemittelter Schlag als **Median je Stelle**, getrennt für gerade und ungerade Schläge; **beide Seiten**
  auswerten. Begründung: Median wirft einzelne Stöße hinaus, und welche Seite „Tick“ heißt, ist Zufall des Startpunkts.
- **[Vorschlag]** Spitzen in **dB über dem Boden** (Median des Schlags) statt in % des Maximums. Kandidat ist nur, wer im
  Umkreis ±0,5 ms die höchste Stelle ist.
- **[Vorschlag]** **Klick 3 = Hauptspitze** (der lauteste, auf den ohnehin ausgerichtet ist). Was danach kommt, ist
  Nachklingen und zählt nicht.
- **[Vorschlag]** **Klick 1 = früheste Spitze ≥ 4 dB** in dem Abstand, den eine Amplitude von 130–380° bei dieser
  Frequenz und diesem Hebungswinkel erlaubt (28.800/L 50: 5,2–15,4 ms; 21.600/L 53: 7,4–21,8 ms; 18.000/L 53: bis 26 ms).
  Das Suchfenster richtet sich danach, statt fest 25 ms. Spitzen außerhalb (wie die −22,5 ms) zählen nicht.
- **[Vorschlag]** **Klick 2 als Bestätigung**: stärkste Spitze zwischen 1 und 3. Liegt sie bei 20–50 % der Strecke,
  passt das Muster. Fehlt sie, gibt es trotzdem einen Wert, aber schlechtere Güte (siehe unten).
- **[Vorschlag]** Amplitude = Mittel aus Tick- und Tack-Seite, wenn beide da sind (wie Witschi: beide Halbschwingungen
  zusammen).
- **[Vorschlag]** Testuhr (`synth.js`) bekommt Optionen für echtes Verhalten: Entriegeln 12 dB leiser, Nachklingen
  nach dem Fall, Tick und Tack mit leicht verschiedenem t, Entriegeln auf einer Seite unhörbar. Erst damit prüfen die
  Tests das, woran es am Handy scheitert. Die heutigen Amplituden-Tests bleiben.
- **[offen]** Gemessen wird heute von Spitze zu Spitze. Ob Anstieg zu Anstieg besser zu „Watch Accuracy Meter“ passt,
  zeigen erst die Referenzen; ein fester Versatz ließe sich als Korrektur einrechnen.
- **[offen]** Die Schwellen (4 dB Kandidat, 6 dB sicher, 0,5 ms Tick/Tack) sind aus zwei Aufnahmen geraten und werden
  an den Referenzen eingestellt.

### Güte der Amplitude

- **[Vorschlag]** Eigene **Amplituden-Güte**, getrennt von der Gang-Güte (eine Messung kann für Gang und Abfallfehler gut
  und für die Amplitude unbrauchbar sein). Drei Stufen:
  - **gut**: Klick 1 auf beiden Seiten ≥ 6 dB über dem Boden, Tick und Tack innerhalb 0,5 ms (≈ 18° bei 28.800),
    Muster 1-2-3 passt.
  - **vorläufig**: nur eine Seite hat ein Klick 1, oder Klick 1 nur 4–6 dB, oder kein Klick 2.
  - **keine**: kein Klick 1 im möglichen Bereich, oder Tick und Tack mehr als 0,5 ms auseinander („Teilgeräusche nicht
    eindeutig“).
  Angewendet auf heute: PT5000 → keine (Tick 14,3 ms, Tack 9,0 ms, weil das frühe Entriegeln dort knapp unter 4 dB
  liegt), NH35 → vorläufig (nur eine Seite), Testuhr → gut.
- **[Vorschlag]** Zusätzlich live: der ruhige Wert (Median der letzten 5) gilt nur, wenn die letzten 5 Einzelwerte
  innerhalb ±10° liegen. Springt die Amplitude, ist die Zuordnung unsicher, auch wenn jede Einzelmessung gut aussieht.
- **[Vorschlag]** Keine neue Güte-Zahl in der Messung speichern: Gespeichert wird die Amplitude nur, wenn sie gut war.
  Hält die Daten einfach.

### Anzeige- und Übernahme-Regeln

- **[fest]** Heute: Amplitude nur mit Hebungswinkel an der Uhr, nicht bei Quarz, nur Werte von 150–360°, ruhiger Wert =
  Median der letzten 5 guten Messungen, Hinweis „experimentell“.
- **[Vorschlag]** 150–360° bleibt als harter Rahmen (darunter läuft eine Uhr kaum sauber, darüber droht Prellen), ist
  aber nicht mehr der eigentliche Filter. Entscheidend ist die Amplituden-Güte.
- **[Vorschlag]** Anzeige: **gut** → Wert („265°“); **vorläufig** → grau mit „≈“; **keine** → „–“ mit Grund in einem
  Satz („Entriegeln nicht hörbar, Uhr direkt aufs Mikrofon legen“).
- **[Vorschlag]** „Übernehmen“ füllt die Amplitude nur, wenn der ruhige Wert **gut** ist. Bei vorläufig bleibt das Feld
  leer, der Wert steht als Platzhalter daneben und lässt sich mit einem Tipp eintragen.
- **[Vorschlag]** Unter „Erweitert“ der gemittelte Schlag als kleines Bild mit den drei markierten Klicks (wie im
  Labor). So sieht man am Handy selbst, ob die Zuordnung stimmt.
- **[Vorschlag]** „Experimentell“ bleibt stehen, bis mindestens drei Uhren innerhalb ±15° zu „Watch Accuracy Meter“
  liegen.
- **[offen]** Soll M4 (5 Lagen) die Amplitude je Lage zeigen? Der Abfall von flach zu hängend (oft 20–50°) wäre ein
  guter Plausibilitäts-Test, lohnt aber erst, wenn M3 sicher ist.

### Hebungswinkel

- **[fest]** Uhrenfeld `liftAngle` (°) ist umgesetzt. Ohne Wert keine Amplitude (die Auswertung rechnet intern mit 52°,
  angezeigt wird das nicht). Werte des Nutzers: NH35 53°, ETA 2824 / PT5000 / ST2130 50°.
- **[Vorschlag]** Für Vergleiche muss „Watch Accuracy Meter“ mit **demselben Hebungswinkel** rechnen wie die Uhrenbox,
  sonst unterscheiden sich die Werte schon um 2 % je Grad.
- **[Vorschlag]** Omega Co-Axial vorerst ohne Amplitude: andere Hemmung, Tick und Tack klingen verschieden, Hebungswinkel
  unbekannt. Erst wenn eine Referenz zeigt, dass es passt.
- **[Vorschlag]** Später füllt die **Kaliber-Datenbank** das Feld vor (zusammen mit `bph`).

### Referenz-Aufnahmen (vom Nutzer)

Aufnehmen im Labor am Fold6 (`adb reverse`, Knopf „Letzte 30 s als WAV speichern“), Uhr wie gewohnt aufs untere
Mikrofon. Direkt davor oder danach in **derselben Lage** „Watch Accuracy Meter“ (Amplitude, Gang, Abfallfehler, dort
eingestellter Hebungswinkel). Ablage in `zeitwaage-labor/aufnahmen/`, Name z. B.
`2026-11-02-fold6-st2130-zo-voll-wam285.wav`. Je Aufnahme notieren: Uhr, Lage, wann zuletzt aufgezogen, Unterlage,
WAM-Werte.

| # | Uhr | Lage | Aufzug | prüft |
|---|---|---|---|---|
| 1 | Sea-Gull ST2130 | Zifferblatt oben | voll | woher die 330° kommen; lautestes Signal, beste Chance für alle drei Klicks |
| 2 | Sea-Gull ST2130 | Krone unten | voll, direkt nach 1 | Amplitude muss fallen (meist 20–50°), t muss also länger werden |
| 3 | PT5000 | Zifferblatt oben | voll | 140° oder ≈ 210°: welche Spitze das Entriegeln ist |
| 4 | PT5000 | Zifferblatt oben | 24–30 h nicht aufgezogen | **Aufzug-Versuch**: Die Spitze, deren Abstand zum Fall wächst, ist das Entriegeln. Entscheidet die Zuordnung auch ohne WAM |
| 5 | Seiko NH35 | Zifferblatt oben | voll | leise Uhr, Entriegeln nur auf einer Seite hörbar |
| 6 | Sea-Gull ST2130 | Zifferblatt oben | voll, Uhr abheben und neu auflegen, zweimal | Wiederholbarkeit am Handy |
| 7 (optional) | Omega Co-Axial | Zifferblatt oben | voll | nur, wenn WAM dort eine Amplitude zeigt |

Danach: jede Referenz als Test wie die vorhandenen echten Aufnahmen (Amplitude ±15° zu WAM), Schwellen einstellen,
erst dann an `pwa/zeitwaage.js`.

### Später

- **[Vorschlag]** Mit Amplitude und Abfallfehler im Verlauf bekommt die **Gang-Analyse in Worten** (KI-Premium) ihre
  Daten („Amplitude fällt seit 4 Monaten …“).

### Offen (Fragen an Markus zu M3)

1. **[offen]** Zeigt deine „Watch Accuracy Meter“-Version die Amplitude, und welcher Hebungswinkel ist dort eingestellt?
   Ohne Amplitude dort bleibt nur der Aufzug-Versuch (Referenz 4) als Prüfung.
2. **[offen]** Die 28.800-Aufnahme von heute: War das die PT5000, in welcher Lage und wie lange nach dem Aufziehen?
   Wären 140° für sie denkbar (z. B. fast abgelaufen)?
3. **[offen]** Sea-Gull 330°: Lage und Aufzug? Hattest du dort einen Vergleichswert aus WAM?
4. **[offen]** Soll die Amplitude bei „vorläufig“ überhaupt sichtbar sein (grau „≈“), oder lieber nur bei „gut“?
5. **[offen]** Gemittelter Schlag als Bild unter „Erweitert“: hilfreich oder zu viel?

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
2. ~~Premium oder Basis~~ **[fest, 28.10.2026]** Freeware: Die Zeitwaage (M2–M4) gehört in die Basis, ohne Schalter oder Kennzeichnung. Monetarisierung war nur eine vage Idee.
3. ~~Quarzuhr und Kontaktmikrofon~~ **[fest, 28.10.2026]** Quarz-Referenz ist die Moonswatch; das Handymikrofon reicht für
   alle gemessenen mechanischen Uhren, ein Kontaktmikrofon ist vorerst nicht nötig. Kalibrierung läuft gegen die Systemzeit.
