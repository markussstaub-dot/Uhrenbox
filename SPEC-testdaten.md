# Testdaten von anderen Nutzern – Specsheet

Aufnahmen und Vergleichswerte anderer Nutzer der Zeitwaage sammeln. Ohne Server: Die App erfasst nichts selbst, wer
spenden will, schickt eine Datei selbst ab. Wo und wie die Uhrenbox vorgestellt wird, steht nicht hier, sondern
getrennt außerhalb des Repos.

Bezug: `SPEC-zeitwaage.md` (M2 Gang/Abfallfehler umgesetzt, M3 Amplitude in Arbeit, „Offen 2“ Premium oder Basis),
`ROADMAP-privat.md` (Basis bleibt Freeware, Daten bleiben auf dem Gerät, „Anonyme Gangstatistik“ nur mit Server).

- **[fest, 28.10.2026]** Die Uhrenbox samt Zeitwaage ist **Freeware**: kostenlos, ohne Premium-Kennzeichnung, ohne
  Bezahlteil.

## Einschätzung vorab (einfacher Weg zuerst)

- **Stufe 0, sofort, ohne Programmierung**: Im Aufruf erklären, wie man unter „Erweitert“ die WAV speichert, und
  die Werte von Hand in die Mail schreiben lassen. Aufwand: nur der Aufruf. Reicht für die ersten 3–5 Leute, zeigt,
  ob überhaupt jemand mitmacht. Nachteil: Angaben fehlen oder sind uneinheitlich, jede Spende kostet Rückfragen.
- **Stufe 1, Knopf „Testdaten spenden“**: WAV plus Angaben in einem Rutsch übers Teilen-Menü. Aufwand: etwa eine halbe
  bis eine Session (Dialog mit Referenz-Feldern, WAV mit eingebetteten Angaben, Teilen/Download wie bei „Sichern“).
  Lohnt sich, sobald Stufe 0 zeigt, dass Spenden kommen.
- **Nicht** jetzt: eigener Server, Upload-Formular, anonyme Gangstatistik (Roadmap, eigener Zielkonflikt).

## 1. Ziel und wichtigste Daten

### Warum Referenzwerte das Wichtigste sind

- **[fest]** Eine Aufnahme allein zeigt nur, was die Uhrenbox daraus macht. Ob das stimmt, zeigt erst ein **zweiter,
  unabhängiger Wert an derselben Uhr in derselben Lage**. Ohne den ist jede Spende nur ein Test „läuft durch / läuft
  nicht durch“.
- **[fest]** Am meisten wert sind Leute mit einer **echten Zeitwaage** (z. B. Weishi 1000/1900, Timegrapher mit
  Körperschall-Mikrofon). Deren Mikrofon sitzt am Gehäuse, Raum und Handy spielen keine Rolle, der Takt kommt aus einem
  Quarz. Das ist die Grundwahrheit für:
  - **Gang**: zeigt, ob der Takt anderer Handys stimmt. Am Fold6 liegt er bei −1 … +1 ppm, bei anderen Handys sind ohne
    Kalibrierung ±1–4 s/Tag möglich. Nur mit Referenz lässt sich das je Handy-Modell erkennen.
  - **Abfallfehler**: Die Uhrenbox misst 0,3–0,8 ms; ob das stimmt oder systematisch daneben liegt, zeigt nur ein Gerät.
  - **Amplitude (M3)**: Der offene Kernpunkt. Welche Spitze das Entriegeln ist, entscheidet über 50–100°
    (PT5000: 140° oder ≈ 210°). Das lässt sich laut Befund **ohne Referenz nicht entscheiden**. Eine Zeitwaage zeigt
    die Amplitude direkt, dazu den eingestellten Hebungswinkel.
- **[fest]** „Watch Accuracy Meter“ (WAM) ist der zweitbeste Vergleich: auch eine Handy-App mit demselben Mikrofon,
  also keine Grundwahrheit, aber ein unabhängig entwickelter Algorithmus. Gut für Gang und Abfallfehler, bei der
  Amplitude nur, wenn WAM sie zeigt und mit demselben Hebungswinkel rechnet.
- **[Vorschlag]** Rangfolge der Spenden (so auch im Aufruf erklären):
  1. WAV + Werte einer **echten Zeitwaage** (direkt davor oder danach, dieselbe Lage).
  2. WAV + Werte aus **WAM**.
  3. WAV + **Gang per Tipp über 24 h** (M1) oder Gang aus der Erfahrung („geht seit Monaten +5 s/Tag“), nur für den Gang.
  4. WAV **ohne Referenz**, vor allem, wenn die Uhrenbox **nichts erkannt** hat (leise Werke, Quarz, laute Umgebung).
     Auch Fehlschläge sind wertvoll: Sie zeigen, woran die Erkennung scheitert.

### Was eine Spende enthält

- **[fest]** Die Aufnahme als WAV (gibt es schon: „Aufnahme speichern (WAV, letzte bis zu 2 min)“ unter „Erweitert“ im
  Messfenster; 16 Bit, Mono, eigene Abtastrate des Mikrofons, nicht umgerechnet).
- **[Vorschlag]** Angaben dazu:

| Gruppe | Feld | Quelle |
|---|---|---|
| Uhr | Kaliber (Freitext, z. B. „NH35“, „ETA 2824-2“), A/h, Hebungswinkel, Werk-Art, Gehäusematerial und Boden (Stahl/Titan/Kunststoff, Glas-/Vollboden) | aus der Uhr, änderbar |
| Uhr | Aufzug: voll / halb / fast abgelaufen, Stunden seit Aufziehen | Abfrage im Dialog |
| Messung | Lage, Unterlage (Tisch, Stoff, Hand), Uhr direkt aufs Mikrofon ja/nein | Lage aus dem Messfenster, Rest Abfrage |
| Uhrenbox | ruhiger Wert Gang, Abfallfehler, Amplitude (falls gezeigt), Güte, gehörte Frequenz, Messdauer, `calibPpm` | automatisch |
| Handy | Modell (`navigator.userAgentData.getHighEntropyValues(['model'])`, sonst Freitext), Browser und Version, Abtastrate, `getSettings()` des Mikrofons (Filter wirklich aus?), gewähltes Mikrofon | automatisch |
| Referenz | Gerät (Auswahl: Zeitwaage mit Name / WAM / Tipp 24 h / keine), Gang, Abfallfehler, Amplitude, dort eingestellter Hebungswinkel, Abstand zur Uhrenbox-Messung in Minuten | Eingabe |
| Sonst | App-Version (`VERSION` aus `sw.js`), Datum (nur Tag), Bemerkung (Freitext), Einwilligung „darf als Testdatei veröffentlicht werden“ ja/nein | automatisch / Eingabe |

- **[fest]** Referenz und Uhrenbox **in derselben Lage, im Abstand von höchstens wenigen Minuten**. Der Gang ändert sich
  mit Lage und Aufzug um mehrere s/Tag, die Amplitude um 20–50°; sonst vergleicht man Äpfel mit Birnen.
- **[Vorschlag]** Keine Marke/Modell und kein Uhrenname in der Spende; Kaliber reicht für die Auswertung. Der heutige
  WAV-Dateiname enthält den Uhrennamen (`slugName(z.w?.name)`), die Spende bekommt einen neutralen Namen
  (`uhrenbox-spende-2026-11-02-nh35-zo.wav`).
- **[offen]** Marke/Modell freiwillig erlauben? Hilft bei Co-Axial und Sonderwerken, verrät aber mehr über die Person.

## 2. Weg ohne Server

### Vorschlag: Knopf „Testdaten spenden“

- **[Vorschlag]** Im Messfenster unter „Erweitert“ neben „Aufnahme speichern“, aktiv sobald eine Aufnahme da ist.
  Öffnet einen kurzen Dialog: Referenz-Felder, Aufzug, Unterlage, Bemerkung, Einwilligung zur Veröffentlichung, darunter
  **im Klartext alles, was mitgeht**. Knopf „Senden …“.
- **[Vorschlag]** **Eine Datei statt zwei**: Die Angaben stehen als JSON in einem eigenen RIFF-Block der WAV (z. B.
  `ubox`, Abspielprogramme überspringen unbekannte Blöcke). Dazu dieselben Angaben als kurze `.txt` (lesbar für den
  Spender und für Mail-Programme, die nur Text zeigen). Begründung: Chrome erlaubt beim Teilen nur bestimmte Dateitypen;
  `.wav` und `.txt` stehen auf der Liste, `.json` nach meinem Stand nicht (am Fold prüfen).
- **[Vorschlag]** Am Handy `navigator.share({ files: [wav, txt], title, text })` wie bei „Sichern“ → Teilen-Menü (Gmail,
  Outlook, WhatsApp, Signal, Drive …). Im `text` steht die Zieladresse und ein Satz („Bitte an … schicken“), weil eine
  Web-App die Empfängeradresse nicht vorbelegen kann. Am PC oder wenn Teilen nicht geht: beide Dateien als Download plus
  ein `mailto:`-Link mit Betreff und Text (Anhängen muss der Nutzer selbst).
- **[Vorschlag]** Länge: die letzten **60 s** bei mechanischen Uhren (≈ 5,8 MB bei 48 kHz), **2 min** bei Quarz und bei
  hoher Streuung (≈ 11,5 MB). Passt in die üblichen 20–25 MB je Mail.
- **[Vorschlag]** Vor dem Senden Hinweis: „Die Aufnahme enthält alles, was das Mikrofon gehört hat. Beim Messen nicht
  sprechen.“ (Stimmen im Hintergrund wären personenbezogene Daten.)
- **[fest]** Nichts geht automatisch raus. Kein Netzwerkzugriff durch die App, keine Zählung, kein „Danke“-Ping.
- **[Vorschlag]** Labor bekommt einen Import: WAV mit `ubox`-Block lesen, Angaben anzeigen, als Test anlegen
  (Amplitude ±15° zur Referenz wie in „Referenz-Aufnahmen“ von `SPEC-zeitwaage.md`).

### Alternativen mit Aufwand

| Weg | Aufwand | Vorteil | Nachteil |
|---|---|---|---|
| **Nur Anleitung im Aufruf** (Stufe 0) | keiner | sofort, nichts zu bauen | Werte unvollständig, Tippfehler, Rückfragen; Handy-Daten fehlen meist |
| **Spenden-Knopf** (Vorschlag) | ½–1 Session | vollständige, einheitliche Angaben; passt zu „Daten bleiben auf dem Gerät“ | Mail-Postfach nötig, Spenden von Hand einsortieren |
| **GitHub-Issue mit Vorlage** | ca. 1 h (Issue-Vorlage) | Spenden öffentlich, nachvollziehbar, Diskussion an einem Ort | braucht GitHub-Konto (Hürde für viele Uhrenleute), WAV vermutlich nur gezippt anhängbar, alles sofort öffentlich |
| **Formular-Dienst** (z. B. Tally, Jotform; Google Forms nur mit Google-Konto beim Hochladen) | 1–2 h | bequem, Tabelle entsteht von selbst | Daten liegen bei einem Dritten, Datenschutzerklärung nötig, Upload-Grenzen und Kosten bei großen Dateien |
| **Werte öffentlich als Antwort auf den Aufruf** (ohne WAV) | keiner | Austausch, Sichtbarkeit | ohne Aufnahme kaum nachrechenbar |

- **[Vorschlag]** Reihenfolge: Stufe 0 im ersten Aufruf; Knopf, wenn innerhalb von 2–4 Wochen mehr als eine Handvoll
  Spenden kommen. GitHub-Issue als Zusatz für Technik-Interessierte möglich, nicht als Hauptweg.

## 3. Datenschutz und Recht (kurz, keine Rechtsberatung)

- **[fest]** Die App erfasst und sendet nichts. Die Spende entsteht auf dem Gerät, der Nutzer sieht den Inhalt und
  schickt sie selbst ab. **Einwilligung durch aktives Senden**, im Dialog in einem Satz erklärt: was drin ist, an wen es
  geht, wofür es genutzt wird (Prüfen und Verbessern der Zeitwaage), dass man die Löschung per Mail verlangen kann.
- **[fest]** In der Spende stehen: Aufnahme, technische Werte, Kaliber, Handy-Modell, Tagesdatum, freiwillige
  Bemerkung. **Nicht**: Seriennummer, Fotos, Kaufpreis, Uhrenname, Standort, Name oder Mailadresse in den Dateien.
- **[Vorschlag]** Eigene Einwilligung für **Veröffentlichung als Testdatei** im öffentlichen Repo (Häkchen, Voreinstellung
  aus). Ohne Häkchen bleibt die Aufnahme privat in `zeitwaage-labor/aufnahmen/`.
- **[fest]** Beim Empfang per Mail hat Markus die Mailadresse des Spenders, das ist ein personenbezogenes Datum. Spenden
  getrennt von der Adresse ablegen, Mails nach dem Einsortieren löschen.
- **[offen]** **Impressum und Datenschutzerklärung für GitHub Pages.** Heute privat und kostenlos; mit öffentlicher
  Vorstellung und Spendenaufruf wird „rein privat“ fraglich, auch ohne Bezahlteil. Dazu loggt GitHub als Hoster
  IP-Adressen der Besucher, auch ohne eigenen Server. Klären: Impressum (Name, ladungsfähige Anschrift, Mail) ja/nein,
  kurze Datenschutzseite in der App (Hoster GitHub, keine Erfassung, Spenden nur per eigener Mail).

## 4. Vor dem Aufruf fertig

- **[fest]** **M2 gepusht und am Fold6 über GitHub Pages ohne USB getestet** (laut Roadmap lokal committet, nicht
  gepusht; Live-Test über HTTPS steht in `SPEC-zeitwaage.md` noch offen). Dazu einmal als installierte PWA.
- **[fest]** **Leise Quarzuhren**: Die Moonswatch wird teils nicht erkannt. Vor dem Aufruf entweder die Erkennung
  verbessern oder eine klare Meldung „Ticks nicht erkannt: Boden direkt aufs untere Mikrofon, stiller Raum, 2 min
  warten“ statt Leere oder Fantasiewerten. Quarz in der App als „experimentell“ kennzeichnen; Mecaquartz (6 Schritte/s) ist
  für das Handymikrofon nicht hörbar, das auch so sagen.
- **[fest]** **Ehrlicher Hinweis im Messfenster**: „Handy-Zeitwaage: Trend und grober Wert, kein Witschi.“ Einmal
  sichtbar, nicht bei jeder Messung.
- **[fest]** **Kurzanleitung im Messfenster** (3–4 Zeilen, einklappbar): Uhr mit dem Boden aufs untere Mikrofon, weiche
  Unterlage, still sein, 20 s warten (Quarz 2 min); Lage wählen; „Übernehmen“ trägt die Werte ins Formular.
- **[fest]** **Sprache**: Die App ist nur deutsch; Aufrufe in anderen Sprachen erst mit englischer Fassung (Roadmap
  „Englische Version“).
- **[Vorschlag]** **Amplitude** nur zeigen, wenn M3 eine Güte „gut“ liefert; sonst ausblenden statt „experimentell“
  mit fragwürdigen Werten. Gerade die Amplitude ist aber das, wofür Referenzen gebraucht werden: Im Aufruf gezielt um
  Zeitwaagen-Werte bitten, auch wenn die Uhrenbox selbst noch keine Amplitude zeigt.
- **[Vorschlag]** **App-Version sichtbar** (z. B. unten neben dem Speicher-Hinweis), damit Rückmeldungen zuzuordnen sind.
- **[Vorschlag]** Getestet nur mit **Android/Chrome**; iPhone ungetestet, so auch in der App sagen.
- **[offen]** Kalibrier-Oberfläche (Takt gegen Systemzeit) vorher bauen? Für das Fold6 kaum nötig; bei fremden Handys
  zeigen erst die Spenden, ob sie gebraucht wird. Vorschlag: nicht vorher, sondern nach den ersten Referenzen.

## 5. Ablauf nach dem Aufruf

- **[Vorschlag]** Spenden in `zeitwaage-labor/aufnahmen/spenden/` ablegen, eine Tabelle (Markdown oder CSV) mit
  Handy, Kaliber, Uhrenbox-Werten, Referenz, Abweichung. Nach 5–10 Referenzen mit echter Zeitwaage die M3-Schwellen
  einstellen und in `SPEC-zeitwaage.md` eintragen.

## 6. Später, low prio: „Watch-Shazam“ (Kaliber am Klang erkennen)

- **[Vorschlag, low prio, 29.10.2026]** Nur falls Spenden zahlreich kommen. Ziel: das **Kaliber** (nicht die einzelne Uhr)
  am Tick erkennen. Stufe 1 Frequenz (trennt schon viel), Stufe 2 Fingerabdruck aus dem gemittelten Schlag (Abstände und
  Lautstärken der Teilgeräusche, Klangfarbe), Vergleich mit den nächsten bekannten Nachbarn, kein neuronales Netz nötig.
  Antwort ehrlich als Kandidaten („klingt am ehesten nach ETA-2824-Familie“), nie als Gewissheit.
- Anwendungsfall für Sammler: Steckt wirklich ein ETA drin oder ein Klon (PT5000, ST2130)? Nebenbei füllt es das
  Kaliberfeld aus.
- Grenze: Das Gehäuse schwingt mit, deshalb je Kaliber Aufnahmen von **mehreren verschiedenen Uhren** (grob 5–10),
  sonst lernt das Verfahren das Gehäuse statt des Kalibers. Darum Gehäusematerial und Boden schon jetzt in der Spende.

## Offen (Fragen an Markus)

1. ~~Freeware oder Premium?~~ **[fest, 28.10.2026]** Freeware. Die Zeitwaage (M2–M4) bekommt keine
   Premium-Kennzeichnung und keinen Bezahlteil; Monetarisierung war nur eine vage Idee.
2. **[offen]** **Wohin gehen Spenden?** Vorschlag: eigenes Postfach nur dafür (z. B. ein neues Gmail-Konto für die
   Uhrenbox), nicht die private Adresse; die Adresse steht dann öffentlich im Aufruf und in der App.
3. **[offen]** Stufe 0 (nur Anleitung) zuerst, oder gleich mit Knopf in den Aufruf?
4. **[offen]** Dürfen gespendete Aufnahmen mit Einwilligung als Testdateien ins öffentliche Repo?
5. **[offen]** Impressum und Datenschutzseite: selbst klären, oder die Vorstellung bewusst klein halten („privates
   Bastelprojekt“)?
6. **[offen]** Marke/Modell freiwillig in der Spende erlauben (siehe 1)?
