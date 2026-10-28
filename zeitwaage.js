// Akustische Zeitwaage: aus einer Aufnahme Frequenz, Gang, Abfallfehler und (experimentell) Amplitude bestimmen.
// Reine Funktionen ohne Oberfläche (SPEC-zeitwaage.md, M2). Jede Stufe gibt ihr Zwischenergebnis mit zurück,
// damit die Labor-Seite sie zeichnen kann. Eine Quelle für beide: die Uhrenbox lädt diese Datei beim Öffnen des
// Messfensters, das Labor (../zeitwaage-labor) und seine Tests importieren sie von hier.
//
// Ablauf:  Rohsignal → Hochpass → Hüllkurve → Frequenz (Autokorrelation) → Ticks verfolgen → Gerade durch die
//          Tick-Zeiten (Gang, Abfallfehler) → gemittelter Schlag (Teilgeräusche, Amplitude)

export const FREQUENZEN = [18000, 19800, 21600, 25200, 28800, 36000];   // übliche Halbschwingungen pro Stunde
export const QUARZ = 3600;   // Quarzuhr: der Schrittmotor springt einmal pro Sekunde

export const STANDARD = {
  hochpass: 1500,     // Hz: darunter Brummen, Stimmen, Trittschall; Uhrenklicks sind heller
  glaettung: 0.2,     // ms: Zeitkonstante der Hüllkurve
  schwelle: 0.3,      // Anteil der Spitze, ab dem ein Schlag „beginnt“ (Zeitpunkt des Ticks)
  fenster: 0.3,       // Suchfenster um die erwartete Tick-Zeit, als Anteil der Schlagdauer
  mindestAbstand: 4,  // Spitze muss so viel über dem Grundrauschen liegen, sonst gilt der Tick als verpasst
  verwerfen: 0.5,     // s am Anfang ignorieren (Uhr wurde gerade abgelegt)
  bph: null,          // bekannte Frequenz der Uhr; null = erkennen
  nurMech: false,     // Werk ist bekannt mechanisch: Quarz-Erkennung (1 Tick/s) gar nicht erst prüfen
  kalibPpm: 0,        // Abweichung der Handy-Abtastrate (aus der Kalibrierung)
  hebung: 52,         // Hebungswinkel in ° für die Amplitude
};

// ---------- Stufe 1: Hochpass (Biquad nach R. Bristow-Johnson, 2. Ordnung) ----------
export function hochpass(x, sr, fc) {
  const w = 2 * Math.PI * fc / sr, cos = Math.cos(w), alpha = Math.sin(w) / (2 * Math.SQRT1_2);
  const a0 = 1 + alpha;
  const b0 = (1 + cos) / 2 / a0, b1 = -(1 + cos) / a0, b2 = b0, a1 = -2 * cos / a0, a2 = (1 - alpha) / a0;
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}

// ---------- Stufe 2: Hüllkurve = Betrag, geglättet (Tiefpass 1. Ordnung) ----------
export function huellkurve(x, sr, tauMs) {
  const k = 1 - Math.exp(-1 / (tauMs / 1000 * sr)), y = new Float32Array(x.length);
  let v = 0;
  for (let i = 0; i < x.length; i++) { v += k * (Math.abs(x[i]) - v); y[i] = v; }
  return y;
}

// Hüllkurve auf 1 kHz verkleinern (Maximum je Block): reicht für die Frequenz und spart Rechenzeit
export function verkleinern(env, sr, ziel = 1000) {
  const b = Math.max(1, Math.round(sr / ziel)), y = new Float32Array(Math.floor(env.length / b));
  for (let i = 0; i < y.length; i++) { let m = 0; for (let j = i * b; j < (i + 1) * b; j++) if (env[j] > m) m = env[j]; y[i] = m; }
  return { y, sr: sr / b };
}

const median = a => { const s = Float64Array.from(a).sort(); return s.length ? s[s.length >> 1] : 0; };

// ---------- Stufe 3: Frequenz per Autokorrelation ----------
// Das Ticken wiederholt sich alle 3600/bph Sekunden. Verschiebt man die Hüllkurve um genau diese Zeit, passt sie
// am besten auf sich selbst: dort hat die Autokorrelation ihre Spitze. Gesucht wird zwischen 0,09 und 0,21 s.
// Vorher aufbereiten (gefunden an der ersten echten Aufnahme vom Fold6): langsame Lautstärke-Schwankungen
// (Hand, Raum) abziehen und einzelne laute Stöße kappen, sonst überdecken sie das Ticken und die Kurve wird flach.
export function aufbereiten(x, dsSr) {
  const w = Math.round(0.25 * dsSr), summe = new Float64Array(x.length + 1);
  for (let i = 0; i < x.length; i++) summe[i + 1] = summe[i] + x[i];
  const y = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const a = Math.max(0, i - w), b = Math.min(x.length, i + w);
    y[i] = Math.max(0, x[i] - (summe[b] - summe[a]) / (b - a));
  }
  const deckel = 10 * (median(y.filter(v => v > 0)) || 1);
  return y.map(v => Math.min(v, deckel));
}
export function frequenz(ds, dsSr, nurMech = false) {
  const x = aufbereiten(ds.y ?? ds, dsSr), mittel = x.reduce((a, b) => a + b, 0) / x.length;
  const lagMin = Math.floor(0.09 * dsSr), lagMax = Math.ceil(0.21 * dsSr), qMin = Math.floor(0.95 * dsSr), qMax = Math.ceil(1.05 * dsSr);
  const akf = new Float32Array(qMax + 1);
  const rechne = lag => { let s = 0; for (let i = 0; i + lag < x.length; i++) s += (x[i] - mittel) * (x[i + lag] - mittel); akf[lag] = s / (x.length - lag); };
  for (let lag = lagMin; lag <= lagMax; lag++) rechne(lag);
  // Quarzuhr? Dann wiederholt sich das Signal erst nach einer Sekunde. Mechanische Uhren passen auch bei 1 s
  // (ganze Zahl von Schlägen pro Sekunde), aber zusätzlich schon nach einem Schlag; Quarzuhren nur bei 1 s.
  if (!nurMech && x.length > 3 * qMax) {
    for (let lag = qMin; lag <= qMax; lag++) rechne(lag);
    let mech = lagMin, quarz = qMin;
    for (let l = lagMin; l <= lagMax; l++) if (akf[l] > akf[mech]) mech = l;
    for (let l = qMin; l <= qMax; l++) if (akf[l] > akf[quarz]) quarz = l;
    if (akf[mech] < 0.3 * akf[quarz]) {
      const a = akf[quarz - 1], b = akf[quarz], c = akf[quarz + 1];
      const bphRoh = 3600 / ((quarz + (a - c) / (2 * (a - 2 * b + c) || 1)) / dsSr);
      return { akf, lagMin, lagMax, bphRoh, bph: QUARZ, quarz: true };
    }
  }
  let max = lagMin; for (let l = lagMin; l <= lagMax; l++) if (akf[l] > akf[max]) max = l;
  // Oktavfehler vermeiden: Sind Tick und Tack verschieden laut, passt die Verschiebung um zwei Schläge oft etwas
  // besser als um einen. Deshalb die kürzeste Verschiebung nehmen, deren Spitze fast so hoch ist wie die höchste.
  let best = max;
  for (let l = lagMin + 1; l < max; l++) {
    if (akf[l] >= 0.6 * akf[max] && akf[l] >= akf[l - 1] && akf[l] >= akf[l + 1]) { best = l; break; }
  }
  // Spitze zwischen zwei Stützstellen genauer bestimmen (Parabel durch drei Punkte)
  const a = akf[best - 1] ?? akf[best], b = akf[best], c = akf[best + 1] ?? akf[best];
  const fein = best + (a - c) / (2 * (a - 2 * b + c) || 1);
  const bphRoh = 3600 / (fein / dsSr);
  const bph = FREQUENZEN.reduce((p, f) => Math.abs(f - bphRoh) < Math.abs(p - bphRoh) ? f : p);
  return { akf, lagMin, lagMax, bphRoh, bph };
}

// ---------- Stufe 4: Ticks verfolgen ----------
// Von Schlag zu Schlag: dort suchen, wo der nächste erwartet wird. Zeitpunkt = wo die Hüllkurve vor der Spitze die
// Schwelle (z. B. 30 % der Spitze) kreuzt. Das ist stabiler als die Spitze selbst, weil die Spitze je nach Klick wandert.
export function ticksFinden(env, sr, bph, o) {
  const p = 3600 / bph, pS = p * sr, halb = Math.round(pS * o.fenster);
  const boden = median(env.subarray(0, Math.min(env.length, sr * 5)).filter((_, i) => i % 16 === 0));
  const start = Math.round(o.verwerfen * sr);
  // Phase per Faltung: die ersten Sekunden im Takt übereinanderlegen (Summe der Hüllkurve je Stelle im Schlag).
  // Ticks addieren sich, Rauschen und einzelne Störklicks mitteln sich weg; die Spitze ist der Schlag.
  const faltung = new Float32Array(Math.round(pS)), ende = Math.min(env.length, start + Math.round(6 * sr));
  const deckel = 30 * boden;   // ein einzelner Stoß soll die Faltung nicht bestimmen
  for (let i = start; i < ende; i++) faltung[Math.floor((i - start) % pS) % faltung.length] += Math.min(env[i], deckel);
  let phase = 0; for (let i = 1; i < faltung.length; i++) if (faltung[i] > faltung[phase]) phase = i;
  const erster = start + phase;
  const ticks = []; let erwartet = erster, periode = pS, n = 0;
  const zurueck = Math.round(0.002 * sr);   // Anstieg eines Klicks: höchstens 2 ms vor seiner Spitze
  const anfang = (sp, von) => {   // Schwellen-Kreuzung vor der Spitze sp, zwischen zwei Samples interpoliert
    const schwelle = o.schwelle * env[sp]; let i = sp;
    while (i > von && env[i - 1] >= schwelle) i--;
    const vor = env[i - 1] ?? 0, frac = i > von ? (env[i] - schwelle) / ((env[i] - vor) || 1) : 0;
    return { i, t: (i - frac) / sr };
  };
  while (erwartet + halb < env.length) {
    const von = Math.max(0, Math.round(erwartet - halb)), bis = Math.min(env.length - 1, Math.round(erwartet + halb));
    // Kandidaten: Spitzen im Fenster, die mindestens halb so laut sind wie ein typischer Tick. Davon gewinnt die,
    // die der Erwartung am nächsten liegt – nicht die lauteste, sonst schnappt sich ein lauter Störklick den Platz.
    let max = von; for (let i = von; i <= bis; i++) if (env[i] > env[max]) max = i;
    const bisher = ticks.filter(k => k.ok && k.nah).slice(-8).map(k => k.spitze);
    const typisch = bisher.length >= 4 ? median(bisher) : env[max];
    let sp = max;
    // Kandidat ist nur eine Spitze, die im Umkreis von ±2 ms die höchste ist. Sonst zählen die kleinen Zacken auf der
    // ansteigenden Flanke mit, und weil sie der Erwartung am nächsten liegen, gewinnen sie (gefunden an der Moonswatch).
    const umkreis = Math.round(0.002 * sr);
    for (let i = von + 1; i < bis; i++) {
      if (env[i] < 0.5 * typisch || env[i] < env[i - 1] || env[i] < env[i + 1]) continue;
      let hoechste = true; for (let j = Math.max(0, i - umkreis); j <= Math.min(env.length - 1, i + umkreis); j++) if (env[j] > env[i]) { hoechste = false; break; }
      if (!hoechste) continue;
      if (Math.abs(i - erwartet) < Math.abs(sp - erwartet) || env[sp] < 0.5 * typisch) sp = i;
    }
    const spitze = env[sp];
    if (spitze < o.mindestAbstand * boden) { ticks.push({ n, ok: false, t: erwartet / sr, spitze }); erwartet += periode; n++; continue; }
    // Gemessen wird am lautesten Klick (meist der Fall, 3. Teilgeräusch): der ist bei jedem Schlag derselbe und hebt
    // sich am deutlichsten vom Rauschen ab. Für Gang und Abfallfehler ist egal, welcher Klick es ist, solange es immer
    // derselbe ist. Die früheren Teilgeräusche zeigt erst der gemittelte Schlag (Stufe 6).
    const t = anfang(sp, Math.max(von, sp - zurueck)).t, ab = t * sr - erwartet;
    const gut = ticks.filter(k => k.ok && k.nah);
    ticks.push({ n, ok: true, t, spitze, ab });
    // Nur wer nah an der Erwartung liegt, setzt den Takt neu (ein Störklick im Fenster soll die Spur nicht verziehen).
    // Periode aus den letzten Treffern über zwei Schläge (Tick + Tack), so fällt der Abfallfehler heraus; höchstens
    // ±1 % von der Sollperiode (±864 s/Tag), mehr kann eine laufende Uhr nicht.
    // Neu einrasten, wenn die letzten drei Treffer alle gleich weit daneben lagen: dann war die Spur selbst falsch.
    const letzte = ticks.filter(k => k.ok).slice(-3);
    const versetzt = letzte.length === 3 && letzte.every(k => !k.nah || k === letzte[2]) && Math.max(...letzte.map(k => k.ab)) - Math.min(...letzte.map(k => k.ab)) < 0.001 * sr;
    const nah = !gut.length || versetzt || Math.abs(ab) < 0.04 * pS;
    const a = gut.at(-2);
    // Die Periode ändert sich bei einer Uhr kaum von Schlag zu Schlag: neue Schätzung höchstens 0,05 % von der alten
    // entfernt, sonst verwerfen (ein Störklick knapp neben dem Tick würde sie sonst verstellen).
    const neu = a && n - a.n === 2 ? (t - a.t) / 2 * sr : null;
    if (nah && !versetzt && neu && Math.abs(neu / periode - 1) < 0.0005) periode = Math.min(pS * 1.01, Math.max(pS * 0.99, 0.8 * periode + 0.2 * neu));
    ticks.at(-1).nah = nah;
    erwartet = (nah ? t * sr : erwartet) + periode; n++;
  }
  return { ticks, boden };
}

// ---------- Stufe 4b: Template-Matching ----------
// Gefunden an der Moonswatch (28.10.2026): Ein Tick besteht aus mehreren fast gleich lauten Stößen. „Lautester Klick“
// springt dann von Tick zu Tick zwischen ihnen, Fehler mehrere ms. Deshalb: alle Ticks (getrennt nach gerade/ungerade,
// also Tick/Tack bzw. Plus/Minus-Puls des Schrittmotors) zu einem Muster mitteln und jeden Tick so verschieben, dass er
// als ganze Form am besten darauf passt (Kreuzkorrelation). Zwei Runden, das Muster wird dabei schärfer.
export function verfeinern(env, sr, ticks, bph, runden = 2) {
  const dez = 4, er = sr / dez, p = 3600 / bph;
  const e = new Float32Array(Math.floor(env.length / dez)); for (let i = 0; i < e.length; i++) e[i] = env[i * dez];
  const vor = Math.round(0.005 * er), nach = Math.round(Math.min(0.03, 0.4 * p) * er), len = vor + nach;
  const S = Math.round(Math.min(0.008, 0.15 * p) * er);
  const ok = ticks.filter(k => k.ok);
  for (let runde = 0; runde < runden; runde++) {
    const muster = [new Float32Array(len), new Float32Array(len)], anz = [0, 0];
    for (const k of ok) {
      const a = Math.round(k.t * er) - vor; if (a < 0 || a + len > e.length) continue;
      const z = k.n % 2; for (let j = 0; j < len; j++) muster[z][j] += e[a + j]; anz[z]++;
    }
    for (const k of ok) {
      const m = muster[k.n % 2], c = Math.round(k.t * er) - vor, guete = new Float32Array(2 * S + 1);
      if (c - S < 0 || c + S + len > e.length) continue;
      for (let s = -S; s <= S; s++) {   // Kosinus-Ähnlichkeit: unabhängig davon, wie laut der Tick gerade ist
        let d = 0, q = 0; for (let j = 0; j < len; j++) { const v = e[c + s + j]; d += m[j] * v; q += v * v; }
        guete[s + S] = q > 0 ? d / Math.sqrt(q) : 0;
      }
      let b = 0; for (let i = 1; i < guete.length; i++) if (guete[i] > guete[b]) b = i;
      const x = guete[b - 1] ?? guete[b], y = guete[b], z = guete[b + 1] ?? guete[b];
      const fein = b + (x - z) / (2 * (x - 2 * y + z) || 1);
      k.t += (fein - S) / er;
    }
  }
  return ticks;
}

// ---------- Stufe 5: Gerade durch die Tick-Zeiten ----------
// t_n = a + b·n + c·(n ungerade).  b = gemessene Schlagdauer → Gang,  c = Versatz Tack gegen Tick → Abfallfehler.
// Ausreißer (Störklicks, falscher Klick erwischt) werden in drei Durchgängen aussortiert.
function loese3(m, v) {   // 3×3-Gleichungssystem, Gauß
  const a = m.map((r, i) => [...r, v[i]]);
  for (let i = 0; i < 3; i++) {
    let p = i; for (let j = i + 1; j < 3; j++) if (Math.abs(a[j][i]) > Math.abs(a[p][i])) p = j;
    [a[i], a[p]] = [a[p], a[i]];
    for (let j = i + 1; j < 3; j++) { const f = a[j][i] / a[i][i]; for (let k = i; k < 4; k++) a[j][k] -= f * a[i][k]; }
  }
  const x = [0, 0, 0];
  for (let i = 2; i >= 0; i--) { let s = a[i][3]; for (let k = i + 1; k < 3; k++) s -= a[i][k] * x[k]; x[i] = s / a[i][i]; }
  return x;
}
export function gerade(ticks) {
  let nutz = ticks.filter(k => k.ok), fit = null;
  for (let runde = 0; runde < 3 && nutz.length >= 6; runde++) {
    const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], v = [0, 0, 0];
    for (const k of nutz) { const z = [1, k.n, k.n % 2]; for (let i = 0; i < 3; i++) { v[i] += z[i] * k.t; for (let j = 0; j < 3; j++) m[i][j] += z[i] * z[j]; } }
    const [a, b, c] = loese3(m, v);
    const rest = k => k.t - (a + b * k.n + c * (k.n % 2));
    const mad = median(nutz.map(k => Math.abs(rest(k)))) * 1.4826;
    fit = { a, b, c, rest, streuung: Math.sqrt(nutz.reduce((s, k) => s + rest(k) ** 2, 0) / nutz.length) };
    nutz = nutz.filter(k => Math.abs(rest(k)) <= Math.max(4 * mad, 0.00005));
  }
  return fit && { ...fit, genutzt: new Set(nutz.map(k => k.n)) };
}

// ---------- Stufe 6: gemittelter Schlag ----------
// Alle Ticks (und getrennt alle Tacks) am Startzeitpunkt übereinanderlegen und mitteln. Rauschen mittelt sich weg,
// die drei Teilgeräusche bleiben stehen. Daraus Abstand Klick 1 → letzter Klick und die Amplitude (experimentell).
// Ausgerichtet ist auf den lautesten Klick (Zeitpunkt 0), deshalb reicht das Fenster 25 ms zurück.
export function gemittelt(env, sr, ticks, genutzt, vorMs = 25, nachMs = 5) {
  const vor = Math.round(vorMs / 1000 * sr), len = vor + Math.round(nachMs / 1000 * sr);
  const summe = [new Float32Array(len), new Float32Array(len)], anzahl = [0, 0];
  for (const k of ticks) {
    if (!k.ok || !genutzt.has(k.n)) continue;
    const s = Math.round(k.t * sr) - vor; if (s < 0 || s + len > env.length) continue;
    const z = k.n % 2; for (let i = 0; i < len; i++) summe[z][i] += env[s + i]; anzahl[z]++;
  }
  return { tick: summe[0].map(v => v / (anzahl[0] || 1)), tack: summe[1].map(v => v / (anzahl[1] || 1)), vorMs, sr, anzahl };
}
// Klicks im gemittelten Schlag: lokale Spitzen über 25 % des Maximums, mindestens 0,5 ms auseinander
export function teilgeraeusche(kurve, sr, vorMs) {
  const max = kurve.reduce((m, v) => Math.max(m, v), 0), abstand = Math.round(0.0005 * sr), spitzen = [];
  for (let i = 1; i < kurve.length - 1; i++) {
    if (kurve[i] < 0.25 * max || kurve[i] < kurve[i - 1] || kurve[i] < kurve[i + 1]) continue;
    const letzte = spitzen.at(-1);
    if (letzte && i - letzte.i < abstand) { if (kurve[i] > letzte.v) Object.assign(letzte, { i, v: kurve[i] }); continue; }
    spitzen.push({ i, v: kurve[i] });
  }
  return spitzen.map(s => ({ ms: s.i / sr * 1000 - vorMs, v: s.v / max }));
}

// ---------- alles zusammen ----------
export function analyse(samples, sr, opts = {}) {
  const o = { ...STANDARD, ...opts };
  const srKorr = sr * (1 + o.kalibPpm * 1e-6);   // so schnell tastet das Handy laut Kalibrierung wirklich ab
  const hp = hochpass(samples, sr, o.hochpass), env = huellkurve(hp, sr, o.glaettung);
  const ds = verkleinern(env, sr);
  const fq = frequenz(ds.y, ds.sr, o.nurMech);
  const spur = b => {
    const { ticks, boden } = ticksFinden(env, sr, b, o);
    // Template-Matching (Stufe 4b): senkt die Streuung, verschiebt beim Quarz aber den Gang (30-s-Abschnitte +2,6…+6,6
    // statt um 0), deshalb nur auf Wunsch
    if (o.verfeinern) verfeinern(env, sr, ticks, b);
    const f = gerade(ticks);
    return { ticks, boden, f, guete: f ? f.genutzt.size / ticks.length : 0 };
  };
  let bph = o.bph || fq.bph, s = spur(bph);
  // Gegenprobe Quarz (gefunden an Quarzuhren am Fold6, Güte nie über 20 %):Unter ≈ 20 s Aufnahme hält die Autokorrelation eine
  // Quarzuhr oft für mechanisch (18.000 / 36.000), weil für die Spitze bei 1 s nur wenige Tick-Paare da sind. Dann passt
  // höchstens jeder 5. bis 10. erwartete Tick, die Güte bleibt unter 20 %. Ist die Güte schlecht, mit 1 Tick/s nachrechnen.
  if (!o.bph && !o.nurMech && bph !== QUARZ && s.guete < 0.5) {
    const q = spur(QUARZ);
    if (q.guete >= GUETE_MIN && q.guete > s.guete) { bph = QUARZ; s = q; fq.quarz = true; fq.gegenprobe = true; }
  }
  const { ticks, boden, f } = s;
  const erg = { sr, hp, env, ds, frequenz: fq, bph, ticks, boden, gefunden: ticks.filter(k => k.ok).length, erwartet: ticks.length };
  if (!f) return { ...erg, fehler: 'Zu wenige Ticks erkannt' };
  // Zeiten in Samples gerechnet: mit der kalibrierten Abtastrate in echte Sekunden umrechnen
  const k = sr / srKorr, pSoll = 3600 / bph, pIst = f.b * k;
  const gang = (pSoll - pIst) / pIst * 86400;
  const abfall = Math.abs(f.c) * k * 1000;
  if (!Number.isFinite(gang) || !Number.isFinite(abfall)) return { ...erg, fehler: 'Ticks nicht eindeutig' };
  const mitte = gemittelt(env, sr, ticks, f.genutzt);
  const klicks = teilgeraeusche(mitte.tick, sr, mitte.vorMs);
  let t13 = null, amplitude = null;
  if (klicks.length >= 2) {
    t13 = klicks.at(-1).ms - klicks[0].ms;
    const s = Math.sin(Math.PI * t13 / 1000 / (2 * pSoll));
    if (s > 0) amplitude = o.hebung / (2 * s);
  }
  // Zeitwaagen-Streifen: Abstand jedes Ticks zum Soll-Raster in ms. Steigung = Gang, zwei Linien = Abfallfehler.
  const t0 = f.a;
  const streifen = ticks.filter(k => k.ok).map(t => ({ t: t.t, ms: (t.t - t0 - t.n * pSoll) * 1000, n: t.n, genutzt: f.genutzt.has(t.n) }));
  const guete = f.genutzt.size / ticks.length;
  return { ...erg, fit: f, gang, abfall, streuung: f.streuung * 1000, guete, streifen, mitte, klicks, t13, amplitude };
}

// ---------- live am Mikrofon (Uhrenbox und Labor) ----------
// AudioWorklet reicht die Rohdaten in Blöcken an die Seite. Jeder Block nimmt die Systemzeit mit, gemessen im
// Audio-Thread selbst: Im Hauptprogramm kommen die Blöcke verspätet an, wenn die Auswertung gerade rechnet, und die
// Takt-Messung zeigte dann bis zu −1000 ppm, die es gar nicht gab.
export const WORKLET = `registerProcessor('sammler', class extends AudioWorkletProcessor {
  process(inp) { const k = inp[0]?.[0]; if (k) this.port.postMessage({ k: k.slice(), t: Date.now(), f: currentFrame }); return true; } });`;
// Ohne diese drei Filter aus dämpft Chrome genau die Ticks bzw. verzerrt ihre Lautstärke
export const MIKRO = { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 };

// Messung gilt als unsicher (Störung: Feuerzeug, Hand, Geräusch), wenn zu wenige Ticks passen oder sie stark streuen.
// Unsichere Werte werden angezeigt, aber markiert und gehen nicht in den ruhigen Live-Wert ein.
// Quarz: Ein Tick besteht aus mehreren fast gleich lauten Stößen, die Streuung liegt deshalb bei 1–2 ms (Moonswatch).
// Bei 1 Tick/s über 120 s macht das nur ≈ ±0,3 s/Tag am Gang, darum dort eine weitere Grenze.
export const GUETE_MIN = 0.8, STREUUNG_MAX = 0.5, STREUUNG_MAX_QUARZ = 2;   // Anteil, ms, ms
export const unsicher = r => !r.fehler && (r.guete < GUETE_MIN || r.streuung > (r.bph === QUARZ ? STREUUNG_MAX_QUARZ : STREUUNG_MAX));

// Takt-Messung (Kalibrierung gegen die Systemuhr): takt = [[Systemzeit ms, Samples bis dahin], …], etwa einmal pro
// Sekunde. Gerade durch (Zeit, Samples): Steigung = echte Samples pro ms; ihre Abweichung von der angegebenen Abtastrate
// verfälscht den Gang (1 ppm = 0,0864 s/Tag). Erst nach 30 Punkten, vorher zu ungenau.
export function taktPpm(takt, sr) {
  if (takt.length < 30) return null;
  const n = takt.length, t0 = takt[0][0], s0 = takt[0][1];
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [t, s] of takt) { const x = t - t0, y = s - s0; sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const steigung = (n * sxy - sx * sy) / (n * sxx - sx * sx);   // Samples pro ms
  return (steigung * 1000 / sr - 1) * 1e6;
}

// ---------- Quarz: Faltung im bekannten Takt (Befund VH31, 28.10.2026) ----------
// Schrittmotoren sind oft so leise, dass einzelne Ticks im Rauschen verschwinden. Ein Quarzwerk läuft aber so gleichmäßig,
// dass man einige Sekunden im Soll-Takt übereinanderlegen kann (5 s bei 4 Schritten/s = 20 Schritte, Rauschen sinkt um
// ≈ √20). Je Abschnitt: Lage der gefalteten Spitze gegen das Muster aller ANDEREN Abschnitte (sonst passt Rauschen immer
// auf sich selbst), nur ±10 ms um die vorige Lage (Quarz driftet kaum, ein Schritt kann zwei ähnliche Teilgeräusche haben).
// Gerade durch die Lagen: Steigung = Gang. Streuung der Lagen um die Gerade ist das Gütemaß.
export function analyseQuarz(samples, sr, opts = {}) {
  const o = { hochpass: 4000, abschnitt: 5, kalibPpm: 0, ...opts }, P = o.periode;
  const env = huellkurve(hochpass(samples, sr, o.hochpass), sr, 0.3);
  const dez = 4, er = sr / dez, e = new Float32Array(Math.floor(env.length / dez));
  for (let i = 0; i < e.length; i++) e[i] = env[i * dez];
  const pE = P * er, L = Math.floor(pE), seg = Math.round(o.abschnitt * er);
  const falte = (von, bis) => { const f = new Float32Array(L); for (let i = von; i < bis; i++) f[Math.floor((i - von) % pE) % L] += e[i]; return f; };
  const erg = { sr, bph: Math.round(3600 / P), frequenz: { bph: Math.round(3600 / P), bphRoh: 3600 / P, quarz: true }, gefunden: 0, erwartet: Math.floor(e.length / seg) };
  if (erg.erwartet < 3) return { ...erg, fehler: 'Zu kurz für die Faltung' };
  const ganz = falte(0, erg.erwartet * seg), w = Math.round(0.010 * er), punkte = [];
  let vorher = null;
  for (let a = 0; a < erg.erwartet; a++) {
    const von = a * seg, f = falte(von, von + seg), off = von % pE, verschub = Math.round(off) % L;
    const ohne = ganz.map((v, j) => v - f[((j - verschub) % L + L) % L]);
    const k = new Float32Array(L);
    for (let sh = 0; sh < L; sh++) { let q = 0; for (let j = 0; j < L; j++) q += ohne[(j + sh) % L] * f[j]; k[sh] = q; }
    const erw = vorher == null ? null : ((off - vorher) % L + L) % L;
    let best = -1;
    for (let sh = 0; sh < L; sh++) {
      const d = erw == null ? 0 : Math.min(Math.abs(sh - erw), L - Math.abs(sh - erw));
      if (d <= (erw == null ? L : w) && (best < 0 || k[sh] > k[best])) best = sh;
    }
    const x = k[(best - 1 + L) % L], y = k[best], z = k[(best + 1) % L], fein = best + (x - z) / (2 * (x - 2 * y + z) || 1);
    const ph = ((off - fein) % L + L) % L; vorher = ph;
    punkte.push({ t: (von + seg / 2) / er, ms: ph / er * 1000 });
  }
  for (let i = 1; i < punkte.length; i++) {   // Lagen auswickeln (Sprung über das Periodenende)
    while (punkte[i].ms - punkte[i - 1].ms > P * 500) punkte[i].ms -= P * 1000;
    while (punkte[i].ms - punkte[i - 1].ms < -P * 500) punkte[i].ms += P * 1000;
  }
  const n = punkte.length, mt = punkte.reduce((q, p) => q + p.t, 0) / n, mm = punkte.reduce((q, p) => q + p.ms, 0) / n;
  const steig = punkte.reduce((q, p) => q + (p.t - mt) * (p.ms - mm), 0) / punkte.reduce((q, p) => q + (p.t - mt) ** 2, 0);   // ms je s
  const rest = p => p.ms - (mm + steig * (p.t - mt));
  const streuung = Math.sqrt(punkte.reduce((q, p) => q + rest(p) ** 2, 0) / n);
  // Lage wandert zu späteren Zeiten = Uhr geht nach; Kalibrierung wie in analyse(): echte Sekunden sind um ppm länger
  const gang = -steig / 1000 * 86400 + o.kalibPpm * 0.0864;
  const gut = punkte.filter(p => Math.abs(rest(p)) < 1);
  const ms0 = punkte[0].ms;
  return { ...erg, gang, abfall: null, streuung, guete: gut.length / n, gefunden: gut.length, faltung: true,
    streifen: punkte.map(p => ({ t: p.t, ms: p.ms - ms0, n: 0, genutzt: Math.abs(rest(p)) < 1 })) };
}

// ---------- Kaliber: welcher Takt ist zu erwarten? ----------
// Schlüssel ist das Kaliber (Uhrenfeld „Kaliber“), nicht die Werk-Art: Daraus folgt, welche Ticks wie oft kommen sollten.
// Erste Einträge aus der eigenen Sammlung, am Fold6 gemessen bzw. mit den Werten des Nutzers.
export const KALIBER = [
  { muster: /^nh3[56]/, name: 'Seiko NH35/NH36', art: 'Automatik', bph: 21600, hebung: 53 },
  { muster: /^2824|^pt5000/, name: 'ETA 2824 / PT5000', art: 'Automatik', bph: 28800, hebung: 50 },
  { muster: /^st2130/, name: 'Sea-Gull ST2130', art: 'Automatik', bph: 28800, hebung: 50 },
  { muster: /^vh31/, name: 'Seiko VH31', art: 'Quarz', periode: 0.25 },   // 4 Schritte/s, sehr leise: nur per Faltung
  { muster: /^vk63/, name: 'Seiko VK63', art: 'Mecaquartz', nichtHoerbar: true },
];
export function kaliber(text) {
  const s = String(text || '').toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^(seiko|eta|seagull|tianjin|caliber|kaliber|cal)+/, '');
  return s ? KALIBER.find(k => k.muster.test(s)) || null : null;
}
