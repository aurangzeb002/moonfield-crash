let blocks = 10;
let blockW = 60;
let blockH = 60;
let startX = 40;
let startY = 90;

let hueSlider;
let gapSlider;


let sliderX = 740;
let sliderY1 = 570;
let sliderY2 = 620;

function setup() {
  createCanvas(1000, 700);
  colorMode(HSB, 360, 100, 100);

  hueSlider = createSlider(0, 359, 120, 1);
  gapSlider = createSlider(0, 30, 10, 1);

  hueSlider.position(sliderX, sliderY1);
  gapSlider.position(sliderX, sliderY2);
}

function draw() {
  background(30);

  let baseHue = hueSlider.value();
  let gap = gapSlider.value();

  // spacing between palette rows
  let gapBetween = 40;

  let y1 = startY;
  let y2 = y1 + blockH + gapBetween;
  let y3 = y2 + blockH + gapBetween;
  let y4 = y3 + blockH + gapBetween;

 

  // ---- Palette 1 name
  textSize(14);
  text("drawPalette", startX, y1 - 12);

  // Palette 1: colourful gradient
  let startCol = color(20, 90, 90);
  let endCol   = color(220, 90, 90);
  drawPalette(startCol, endCol, startX, y1, blocks, blockW, blockH);

  // ---- Palette 2 name
  text("Analogous palette", startX, y2 - 12);

  // Palette 2: analogous (slider one controls hue)
  let hueGap = 25;
  let aStart = color(baseHue - hueGap, 80, 90);
  let aEnd   = color(baseHue + hueGap, 80, 90);
  drawPalette(aStart, aEnd, startX, y2, blocks, blockW, blockH);

  // ---- Palette 3 name
  text("monoPalette", startX, y3 - 12);

  // Palette 3: monochrome
  monoPalette(280, 80, startX, y3, blocks, blockW, blockH);

  // ---- Palette 4 name
  text("rectPalette", startX, y4 - 12);

  // Palette 4: rectangles with spaces (slider two controls gap)
  rectPalette(60, 0, startX, y4, blocks, 45, 70, gap);
}

function drawPalette(startCol, endCol, x, y, count, w, h) {
  for (let i = 0; i < count; i++) {
    let t = i / (count - 1);
    let mixed = lerpColor(startCol, endCol, t);

    fill(mixed);
    rect(x + i * w, y, w, h);

    
    fill(255);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text(i + 1, x + i * w + w / 2, y - 3);
  }
}

function monoPalette(hueVal, satVal, x, y, count, w, hgt) {
  for (let i = 0; i < count; i++) {
    let b = map(i, 0, count - 1, 20, 100);

    fill(hueVal, satVal, b);
    rect(x + i * w, y, w, hgt);

    
    fill(255);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text(i + 1, x + i * w + w / 2, y - 3);
  }
}

function rectPalette(startHue, endHue, x, y, count, w, hgt, gap) {
  for (let i = 0; i < count; i++) {
    let t = i / (count - 1);
    let h = lerp(startHue, endHue, t);

    let xPos = x + i * (w + gap);

    fill(h, 90, 90);
    rect(xPos, y, w, hgt);

    
    fill(255);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text(i + 1, xPos + w / 2, y - 3);
  }
}

