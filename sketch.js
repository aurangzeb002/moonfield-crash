/*
THEME: old cinema + painting mashup
TITLE: MOONFIELD CRASH


refs (public domain):
1) Georges Méliès, "Le Voyage dans la Lune" (A Trip to the Moon), 1902 (hand-coloured frame)
   https://commons.wikimedia.org/wiki/File:Melies_color_Voyage_dans_la_lune.jpg

2) Vincent van Gogh, "Wheat Field with Cypresses", 1889 
   https://orchardviewcolor.com/public-domain-collections/
*/

/*
what i did:
- SCREEN blend + tint: van gogh sits on top of melies so both show.
- Crop loop: i copy random thin strips and paste them shifted to make glitch bands.
- Filters: posterize + blur on a copy to make it look more “paint/film”.
- pixels[]: sometimes i copy van gogh green channel into melies + random swap red/blue.
- Convolution: 3x3 edge kernel on van gogh then ADD it on top like outlines.
*/


let meliesOriginal;
let vangoghOriginal;

let baseImg;       // melies scaled to canvas
let vangoghImg;    // van gogh scaled to canvas

let posterImg;     // filtered copy (from van gogh)
let channelImg;    // pixel edits (mostly melies + van gogh channel)
let edgeImg;       // convolution edges (from van gogh)

let stripeSeed = 1;
let freeze = false;

function preload() {
  pixelDensity(1);

  meliesOriginal = loadImage('assets/melies_color.jpg');
  vangoghOriginal = loadImage('assets/vangogh_wheat.jpg');
}

function setup() {
  
  const maxW = 900;
  const s = min(1, maxW / meliesOriginal.width);

  createCanvas(floor(meliesOriginal.width * s), floor(meliesOriginal.height * s));

  buildLayers();
}

function draw() {
  if (!freeze) stripeSeed += 1;
  randomSeed(stripeSeed);

  background(5);

  // base melies
  blendMode(BLEND);
  image(baseImg, 0, 0);

  // van gogh on top 
  push();
  blendMode(SCREEN);
  tint(255, 85);
  image(vangoghImg, 0, 0);
  pop();

  // filtered copy layer (posterize+blur)
  push();
  blendMode(SOFT_LIGHT);
  tint(255, 70);
  image(posterImg, 0, 0);
  pop();

  // pixel channel remix layer
  push();
  blendMode(DIFFERENCE);
  tint(255, 60);
  image(channelImg, 0, 0);
  pop();

  // glitch strips from BOTH
  drawGlitchStrips(baseImg);
  drawGlitchStrips(vangoghImg);

  // edge outlines
  push();
  blendMode(ADD);
  tint(255, 60);
  image(edgeImg, 0, 0);
  pop();

  // little repeated stamps (still uses melies so the moon face repeats)
  drawMoonStamps(baseImg);

  // frame holes
  drawFilmPerforations();
}

function buildLayers() {
  // melies  canvas size
  let g1 = createGraphics(width, height);
  g1.image(meliesOriginal, 0, 0, width, height);
  baseImg = g1.get();

  // van gogh  canvas size
  let g2 = createGraphics(width, height);
  g2.image(vangoghOriginal, 0, 0, width, height);
  vangoghImg = g2.get();

  // filter layer from van gogh
  posterImg = vangoghImg.get();
  posterImg.filter(POSTERIZE, 6);
  posterImg.filter(BLUR, 1);

  // pixel layer start as melies then steal channel bits from van gogh
  channelImg = baseImg.get();
  replaceChannel(channelImg, vangoghImg, 1, 0.60); 

  // edges from van gogh
  const edgeKernel = [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1
  ];
  edgeImg = convolveLuma(vangoghImg, edgeKernel, 3);
}

// glitch strips 
function drawGlitchStrips(src) {
  const strips = 24;

  for (let i = 0; i < strips; i++) {
    const sh = floor(random(6, 26));
    const sy = floor(random(0, src.height - sh));

    const sw = floor(random(src.width * 0.45, src.width));
    const sx = floor(random(0, src.width - sw));

    const dx = floor(random(-src.width * 0.08, src.width * 0.08));
    const dy = sy + floor(random(-18, 18));

    push();
    blendMode(DARKEST);
    tint(255, random(25, 120));
    image(src, dx, dy, sw, sh, sx, sy, sw, sh);
    pop();
  }
}


function drawMoonStamps(src) {
  const cropW = floor(src.width * 0.42);
  const cropH = floor(src.height * 0.42);
  const cropX = floor(src.width * 0.29);
  const cropY = floor(src.height * 0.12);

  push();
  blendMode(LIGHTEST);

  const stamps = 10;
  for (let i = 0; i < stamps; i++) {
    const angle = (TWO_PI * i) / stamps;
    const r = min(width, height) * 0.42;

    const x = width / 2 + cos(angle) * r;
    const y = height / 2 + sin(angle) * r;

    push();
    translate(x, y);
    rotate(angle + frameCount * 0.003);
    tint(255, 55);

    image(
      src,
      -cropW * 0.14,
      -cropH * 0.14,
      cropW * 0.28,
      cropH * 0.28,
      cropX,
      cropY,
      cropW,
      cropH
    );
    pop();
  }

  pop();
}


function replaceChannel(targetImg, donorImg, channelIndex, probability) {
  targetImg.loadPixels();
  donorImg.loadPixels();

  for (let y = 0; y < targetImg.height; y++) {
    for (let x = 0; x < targetImg.width; x++) {
      const idx = (y * targetImg.width + x) * 4;

     
      if (random(1) < probability) {
        targetImg.pixels[idx + channelIndex] = donorImg.pixels[idx + channelIndex];
      }

      // random red/blue swap sometimes (glitch)
      if (random(1) < 0.02) {
        const r = targetImg.pixels[idx + 0];
        targetImg.pixels[idx + 0] = targetImg.pixels[idx + 2];
        targetImg.pixels[idx + 2] = r;
      }
    }
  }

  targetImg.updatePixels();
}

// convolution on luminance
function convolveLuma(srcImg, kernel, kSize) {
  const result = createImage(srcImg.width, srcImg.height);
  srcImg.loadPixels();
  result.loadPixels();

  const half = floor(kSize / 2);

  for (let y = 0; y < srcImg.height; y++) {
    for (let x = 0; x < srcImg.width; x++) {
      let sum = 0;

      for (let ky = 0; ky < kSize; ky++) {
        for (let kx = 0; kx < kSize; kx++) {
          const ix = constrain(x + kx - half, 0, srcImg.width - 1);
          const iy = constrain(y + ky - half, 0, srcImg.height - 1);
          const idx = (iy * srcImg.width + ix) * 4;

          const r = srcImg.pixels[idx + 0];
          const g = srcImg.pixels[idx + 1];
          const b = srcImg.pixels[idx + 2];

          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          sum += luma * kernel[ky * kSize + kx];
        }
      }

      const v = constrain(abs(sum), 0, 255);
      const outIdx = (y * srcImg.width + x) * 4;

      result.pixels[outIdx + 0] = v;
      result.pixels[outIdx + 1] = v;
      result.pixels[outIdx + 2] = v;
      result.pixels[outIdx + 3] = 255;
    }
  }

  result.updatePixels();
  return result;
}

function drawFilmPerforations() {
  const holeW = 18;
  const holeH = 30;
  const gap = 18;

  push();
  noStroke();
  fill(240, 220);

  for (let y = gap; y < height - gap; y += holeH + gap) {
    rect(8, y, holeW, holeH, 5);
    rect(width - holeW - 8, y, holeW, holeH, 5);
  }

  pop();
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    stripeSeed = floor(random(100000));
    randomSeed(stripeSeed);
    buildLayers();
  }

  if (key === ' ') {
    freeze = !freeze;
  }

  if (key === 's' || key === 'S') {
    saveCanvas('moonfield_crash', 'png');
  }
}