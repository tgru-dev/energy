// Energiesimulation – erweitert mit Gas, Wasser, Solar & Speicher

// Häuser (Verbraucher)
var hvx=[], hvy=[], hvan=[], hvs=[]

// Windkraftanlagen
var wkax=[], wkay=[], wkaan=[], wkas=[]

// Gaskraftwerke
var gasx=[], gasy=[], gason=[], gass=[]

// Wasserkraftwerke
var hydrox=[], hydroy=[], hydroon=[], hydros=[]

// Solaranlagen
var solax=[], solay=[], solaon=[], solas=[]

// Energiebilanz
var hver=0, wkaErz=0, gasErz=0, hydroErz=0, solaErz=0, gesamtErz=0

// Speicher
var speicherLevel=0, speicherMax=100

// Wetter (beeinflusst Solar)
var sonnig=true
var wetterBtn

// Zeitraffer
var zeitrafferStufen = [1, 2, 5, 10]
var zeitrafferIdx = 0
var gameSpeed = 1
var zeitrafferBtn
var simTick = 0

// ─────────────────────────────────────────────
function setup() {
  createCanvas(1200, 680)
  textAlign(LEFT)
  textSize(13)

  createButton('Prognose').position(20, 645).mousePressed(prognose)
  createButton('Berechnen').position(120, 645).mousePressed(rechnen)

  wetterBtn = createButton('☀ Sonnig')
  wetterBtn.position(230, 645)
  wetterBtn.mousePressed(function() {
    sonnig = !sonnig
    wetterBtn.html(sonnig ? '☀ Sonnig' : '☁ Bewölkt')
    if (gesamtErz > 0 || hver > 0) rechnen()
  })

  createButton('Laden').position(340, 645).mousePressed(function() {
    var u = gesamtErz - hver
    if (u > 0) speicherLevel = min(speicherMax, speicherLevel + u)
  })

  createButton('Entladen').position(405, 645).mousePressed(function() {
    var d = hver - gesamtErz
    if (d > 0) speicherLevel = max(0, speicherLevel - d)
  })

  createButton('Reset').position(490, 645).mousePressed(resetAll)

  zeitrafferBtn = createButton('⏩ 1×')
  zeitrafferBtn.position(570, 645)
  zeitrafferBtn.mousePressed(function() {
    zeitrafferIdx = (zeitrafferIdx + 1) % zeitrafferStufen.length
    gameSpeed = zeitrafferStufen[zeitrafferIdx]
    zeitrafferBtn.html('⏩ ' + gameSpeed + '×')
  })
}

function resetAll() {
  hvx=[];hvy=[];hvan=[];hvs=[]
  wkax=[];wkay=[];wkaan=[];wkas=[]
  gasx=[];gasy=[];gason=[];gass=[]
  hydrox=[];hydroy=[];hydroon=[];hydros=[]
  solax=[];solay=[];solaon=[];solas=[]
  hver=0; wkaErz=0; gasErz=0; hydroErz=0; solaErz=0; gesamtErz=0
  speicherLevel=0; simTick=0
}

// ─────────────────────────────────────────────
function draw() {
  textAlign(LEFT)

  // Himmel
  if (sonnig) {
    background(165, 245, 253)
    noStroke()
    fill(255, 240, 0, 100); ellipse(1100, 70, 130, 130)
    fill(255, 240, 0);       ellipse(1100, 70,  90,  90)
  } else {
    background(175, 180, 200)
    noStroke(); fill(210, 210, 225)
    ellipse(1040, 65, 150, 70)
    ellipse(1100, 55, 115, 65)
    ellipse(1158, 65, 148, 70)
  }

  // Boden
  noStroke()
  fill(50, 200, 0)
  rect(0, 450, width, height - 450)

  // Wasser (links, für Wasserkraft)
  fill(30, 100, 200, 190)
  rect(0, 408, 215, 47)

  // Alle Elemente
  for (var i=0; i<wkax.length;  i++) wka(wkax[i], wkay[i], wkaan[i], wkas[i])
  for (var i=0; i<hvx.length;   i++) haus(hvx[i], hvy[i], hvan[i], hvs[i])
  for (var i=0; i<gasx.length;  i++) gasPflanze(gasx[i], gasy[i], gason[i], gass[i])
  for (var i=0; i<hydrox.length;i++) hydroWerk(hydrox[i], hydroy[i], hydroon[i], hydros[i])
  for (var i=0; i<solax.length; i++) solarPanel(solax[i], solay[i], solaon[i], solas[i])

  // Speicher auto-simulieren im Zeitraffer
  if (gameSpeed > 1 && (gesamtErz > 0 || hver > 0)) {
    simTick++
    if (simTick >= floor(30 / gameSpeed)) {
      simTick = 0
      var diff = gesamtErz - hver
      if (diff > 0) speicherLevel = min(speicherMax, speicherLevel + diff * 0.1)
      else if (diff < 0) speicherLevel = max(0, speicherLevel + diff * 0.1)
    }
  }

  speicherAnzeigen()
  infoAnzeigen()
}

// ─────────────────────────────────────────────
// ZEICHENFUNKTIONEN
// ─────────────────────────────────────────────

function haus(x2, y2, f2, s2) {
  push()
  translate(x2, y2)
  noStroke()
  fill(250, 250, 200)
  rect(0, 0, s2*80, -40*s2)
  fill(180, 60, 60)
  triangle(0, -40*s2, s2*80, -40*s2, s2*40, -80*s2)
  fill(f2 == 1 ? color(255,255,0) : color(70))
  ellipse(s2*40, -s2*20, s2*40, s2*20)
  pop()
}

function wka(x1, y1, on, sc) {
  push()
  translate(x1, y1)
  noStroke()
  fill(190, 190, 190)
  triangle(0, 0, -4*sc, 100*sc, 4*sc, 100*sc)
  if (on == 1) { fill(220, 140, 5); rotate(frameCount * gameSpeed / 20) }
  else fill(150)
  star(0, 0, 5*sc, 45*sc, 3)
  pop()
}

function gasPflanze(x, y, on, sc) {
  push()
  translate(x, y)
  noStroke()
  // Gebäude
  fill(150, 150, 165); rect(0, 0, 80*sc, -70*sc)
  fill(120, 120, 140); rect(0, -70*sc, 80*sc, -10*sc)
  // Schornsteine
  fill(110, 110, 125)
  rect( 8*sc, -80*sc, 14*sc, -90*sc)   // links  → Top bei -170*sc
  rect(54*sc, -80*sc, 14*sc, -75*sc)   // rechts → Top bei -155*sc
  // Rauch wenn aktiv
  if (on == 1) {
    fill(110, 110, 110, 185)
    ellipse(15*sc, -175*sc, 22*sc, 22*sc)
    ellipse(20*sc, -193*sc, 15*sc, 15*sc)
    ellipse(61*sc, -160*sc, 20*sc, 20*sc)
    ellipse(66*sc, -175*sc, 13*sc, 13*sc)
    fill(0, 220, 0)
  } else {
    fill(220, 0, 0)
  }
  ellipse(70*sc, -60*sc, 10*sc, 10*sc)
  pop()
}

function hydroWerk(x, y, on, sc) {
  push()
  translate(x, y)
  noStroke()
  // Gebäude
  fill(90, 120, 190);  rect(0, 0, 60*sc, -55*sc)
  fill(60, 90, 160);   rect(-5*sc, -55*sc, 70*sc, -12*sc)
  // Turbine (rotierendes Rad)
  push()
  translate(30*sc, -28*sc)
  if (on == 1) { rotate(frameCount * gameSpeed / 12); fill(0, 80, 200) }
  else fill(100, 120, 170)
  star(0, 0, 6*sc, 20*sc, 6)
  noStroke(); fill(30, 60, 150)
  ellipse(0, 0, 12*sc, 12*sc)
  pop()
  // Status-LED
  noStroke()
  fill(on == 1 ? color(0,220,0) : color(220,0,0))
  ellipse(30*sc, -5*sc, 9*sc, 9*sc)
  pop()
}

function solarPanel(x, y, on, sc) {
  push()
  translate(x, y)
  noStroke()
  // Ständer
  fill(130); rect(-2*sc, -25*sc, 4*sc, 25*sc)
  // Panel (geneigt)
  push()
  translate(0, -25*sc); rotate(-0.35)
  if (on == 1) fill(sonnig ? color(20,40,200) : color(60,60,150))
  else fill(90, 90, 110)
  rect(-22*sc, -20*sc, 44*sc, 20*sc)
  // Gitterlinien
  stroke(80, 80, 180); strokeWeight(sc * 0.5)
  line(-7*sc, -20*sc, -7*sc, 0)
  line( 7*sc, -20*sc,  7*sc, 0)
  line(-22*sc, -10*sc, 22*sc, -10*sc)
  // Glanz bei Sonne
  if (on == 1 && sonnig) {
    noStroke(); fill(255, 255, 255, 70)
    ellipse(-5*sc, -13*sc, 8*sc, 4*sc)
  }
  pop()
  pop()
}

function speicherAnzeigen() {
  var bx=width-155, by=70, bw=120, bh=280
  noStroke()
  fill(30, 30, 40); rect(bx, by, bw, bh, 8)
  // Füllung
  var h = map(speicherLevel, 0, speicherMax, 0, bh - 16)
  if      (speicherLevel > speicherMax * 0.6)  fill(0, 200, 80)
  else if (speicherLevel > speicherMax * 0.25) fill(255, 180, 0)
  else                                          fill(220, 50, 50)
  rect(bx+5, by+bh-8-h, bw-10, h, 4)
  // Beschriftung
  fill(255); textAlign(CENTER)
  textSize(12); text('SPEICHER', bx+bw/2, by+17)
  textSize(22); text(round(speicherLevel / speicherMax * 100) + '%', bx+bw/2, by+bh/2+10)
  textSize(11); text(round(speicherLevel) + ' / ' + speicherMax + ' MWh', bx+bw/2, by+bh-10)
  textAlign(LEFT)
}

function infoAnzeigen() {
  noStroke()
  fill(0, 0, 0, 165); rect(0, 0, width-160, 62)

  fill(200, 200, 255); textSize(12)
  text('Wind: '   + wkaErz  + ' MW',  10, 18)
  text('Gas: '    + gasErz  + ' MW', 140, 18)
  text('Wasser: ' + hydroErz+ ' MW', 260, 18)
  text('Solar: '  + solaErz + ' MW', 400, 18)

  var diff = gesamtErz - hver
  fill(100, 255, 120); text('Erzeugung: ' + gesamtErz + ' MW',  10, 42)
  fill(255, 150, 100); text('Verbrauch: ' + hver       + ' MW', 200, 42)

  if (diff >= 0) {
    fill(100, 255, 120)
    text('Überschuss: +' + diff + ' MW  → Speicher laden möglich', 390, 42)
  } else {
    var nochFehlt = abs(diff) - speicherLevel
    if (nochFehlt <= 0) {
      fill(255, 220, 50)
      text('Speicher deckt Defizit: ' + abs(diff) + ' MW', 390, 42)
    } else {
      fill(255, 80, 80)
      text('Defizit: ' + diff + ' MW  →  BLACKOUT!', 390, 42)
      push()
      textSize(110); fill(255, 0, 0, 210)
      stroke(180, 0, 0); strokeWeight(3)
      text('BLACKOUT', 90, 420)
      pop()
    }
  }
}

// Hilfsfunktion: Stern / Rotor
function star(x, y, r1, r2, np) {
  var a = TWO_PI / np, ha = a / 2
  beginShape()
  for (var ang = 0; ang < TWO_PI; ang += a) {
    vertex(x + cos(ang)    * r2, y + sin(ang)    * r2)
    vertex(x + cos(ang+ha) * r1, y + sin(ang+ha) * r1)
  }
  endShape(CLOSE)
}

// ─────────────────────────────────────────────
// LOGIK
// ─────────────────────────────────────────────

function prognose() {
  resetAll()

  // 25 Häuser
  for (var i=0; i<25; i++) {
    hvx.push(round(random(220, 1130)))
    hvy.push(round(random(455, 620)))
    hvan.push(round(random(0, 1)))
    hvs.push(random(0.3, 0.7))
  }

  // 8 Windkraftanlagen
  for (var i=0; i<8; i++) {
    wkax.push(round(random(280, 1080)))
    wkay.push(round(random(250, 400)))
    wkaan.push(round(random(0, 1)))
    wkas.push(random(0.6, 1.3))
  }

  // 3 Gaskraftwerke
  for (var i=0; i<3; i++) {
    gasx.push(round(random(380, 1050)))
    gasy.push(round(random(450, 478)))
    gason.push(round(random(0, 1)))
    gass.push(random(0.5, 0.9))
  }

  // 2 Wasserkraftwerke (links, am Wasser)
  for (var i=0; i<2; i++) {
    hydrox.push(round(random(10, 130)))
    hydroy.push(round(random(413, 453)))
    hydroon.push(round(random(0, 1)))
    hydros.push(random(0.6, 1.0))
  }

  // 12 Solaranlagen
  for (var i=0; i<12; i++) {
    solax.push(round(random(230, 1080)))
    solay.push(round(random(460, 570)))
    solaon.push(round(random(0, 1)))
    solas.push(random(0.4, 0.9))
  }
}

function rechnen() {
  hver=0; wkaErz=0; gasErz=0; hydroErz=0; solaErz=0

  // Hausverbrauch: 2 MW pro aktivem Haus
  for (var i=0; i<hvx.length;   i++) if (hvan[i]  ==1) hver    += 2

  // Wind: 6 MW pro aktiver WKA
  for (var i=0; i<wkax.length;  i++) if (wkaan[i] ==1) wkaErz  += 6

  // Gas: 15 MW pro aktivem Gaskraftwerk
  for (var i=0; i<gasx.length;  i++) if (gason[i] ==1) gasErz  += 15

  // Wasser: 10 MW pro aktivem Wasserkraftwerk
  for (var i=0; i<hydrox.length;i++) if (hydroon[i]==1) hydroErz += 10

  // Solar: 4 MW (sonnig) / 1 MW (bewölkt) pro aktiver Anlage
  for (var i=0; i<solax.length; i++) if (solaon[i] ==1) solaErz += (sonnig ? 4 : 1)

  gesamtErz = wkaErz + gasErz + hydroErz + solaErz
}
