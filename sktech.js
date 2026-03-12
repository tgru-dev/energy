var hvx=[]  
var hvy=[]  
var hvan=[]
var hvs=[]
var hver, wkaerz

function setup() {
  createCanvas(1000, 600);
  textSize(24)
  
  hver=0
  wkaerz=0

  vorgabe = createButton('Prognose');
  vorgabe.position(20, 20);
  vorgabe.mousePressed(prognose);
  berechnung = createButton('Berechnung');
  berechnung.position(100, 20);
  berechnung.mousePressed(rechnen);
}

function draw() 
{
  background(220,220,220);
  fill(50,200,0)
  rect(0,200,width, height-200)
  fill(165,245,253)
  rect(0,0,width, 200)

  for (i=30; i<40; i++)
  {
    wka(hvx[i],hvy[i],hvan[i],hvs[i])
  } 
  
  for (i=0; i<30; i++)
  {
    haus(hvx[i],hvy[i],hvan[i],hvs[i])
  }

  fill(0)
  text('Summe Erzeugung ' +wkaerz, 200, 40)
  text('Summe Verbrauch ' +hver, 500, 40)
  
  if (wkaerz<hver)
    {
      push()
      textSize(200)
      fill(0)
      text('Blackout', 100, 300)
      pop()
    }
}

function haus(x2,y2,f2,s2)
{
  //x2-xPos, y2-yPos, f2-Farbe, s2-skalieren
  push();
  translate(x2, y2)
  fill(250,250,200)
  rect(0, 0, s2*100, -50*s2)
  fill(255,0,0)
  triangle(0, 0-50*s2, 0+s2*100, 0-50*s2, 0+(s2*100/2), 0-50*s2*2)
  if (f2==1)
    fill(255,255,0)
  else
    fill(100)
  ellipse(0+s2*50, 0-s2*30, s2*60, -30*s2)
  pop(); // Restore original state
}

function wka(x1, y1, on, sc)
{
  push();
  fill(220,140,5)
  translate(x1, y1);
  triangle(0, 0, -5*sc, 100*sc, 5*sc, 100*sc)
  rotate(frameCount / on);
  star(0, 0, 5*sc, 50*sc, 3); 
  pop();
}

function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function prognose()
{
  for (i=0; i<30; i++)
  {
    scHaus = random(0.3, 0.8)
    an = random(0, 1)
    an = round(an, 0)
    x1=random(0, 800)
    x1=round(x1, 0)
    y1=random(200, 600)
    y1=round(y1, 0)

    hvx[i]  =x1
    hvy[i]  =y1
    hvan[i] =an
    hvs[i] = scHaus
  }
  hver=0
  
  for (i=30; i<40; i++)
  {
    scHaus = random(0.5, 1.5)
    an = random(0, 1)
    an = round(an, 0)
    x1=random(0, 800)
    x1=round(x1, 0)
    y1=random(200, 400)
    y1=round(y1, 0)

    hvx[i]  =x1
    hvy[i]  =y1
    hvan[i] =an
    hvs[i] = scHaus
  }
  wkaerz=0
}

function rechnen()
{
  for (i=0; i<30; i++)
    {
      if (hvan[i]==1)
        hver=hver+1
    }
  hver=2*hver
  for (i=30; i<40; i++)
    {
      if (hvan[i]==1)
        wkaerz=wkaerz+1
    }
  wkaerz=6*wkaerz 
}

