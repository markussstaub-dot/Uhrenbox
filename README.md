# Uhrenbox

Eine kleine Web-App für die eigene Uhrensammlung: Uhren mit Fotos, Zeitwaagen-Messungen mit Gangverlauf, Tragetagebuch und Vergleich.

- **Alle Daten bleiben auf deinem Gerät** (im Browser-Speicher). Kein Konto, kein Server, keine Cloud.
- **Sichern / Laden** speichert die ganze Sammlung samt Fotos in eine Datei bzw. spielt sie wieder ein. Am Handy öffnet sich dafür das Teilen-Menü (OneDrive, Drive, Mail …).
- Die App erinnert ans Sichern (nach 14 Tagen oder 10 Änderungen) und zeigt unten, ob der Speicher dauerhaft ist.
- Am Handy in Chrome öffnen und über das Menü **„App installieren“** wählen, am iPhone in Safari **Teilen → Zum Home-Bildschirm**. Läuft danach auch offline.
- Lange aufs App-Icon drücken: Kurzbefehle **Messung erfassen**, **Heute getragen** und **Was trage ich?**.
- **📷 Was trage ich?** (Sammlung und Tragetagebuch): Foto vom Handgelenk machen, die App schlägt drei Uhren vor (gestern getragen, oft an diesem Wochentag, länger nicht am Arm), ein Tipp trägt den Tag mit Foto ein. Ohne Foto geht es auch. Alles bleibt auf dem Gerät, keine KI.

Tipp: Ab und zu sichern. Wer die Browserdaten löscht, löscht auch die Sammlung.

## Neue Version veröffentlichen

In `sw.js` die `VERSION` hochzählen (z. B. `uhrenbox-v2` → `uhrenbox-v3`) und mit hochladen. Sonst bekommen installierte Apps die Änderung nicht. Offene Apps zeigen dann „Neue Version der Uhrenbox ist da – Neu laden“.
