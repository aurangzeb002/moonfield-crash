# Moonfield Crash

An animated collage I made in p5.js that mixes two old public domain artworks: Georges Méliès' A Trip to the Moon (1902) and Van Gogh's Wheat Field with Cypresses (1889). It's meant to look like a glitchy old film.

Live demo: https://aurangzeb002.github.io/moonfield-crash/

## What I used

- Blend modes to layer the two images on top of each other
- Posterize and blur filters on a copy of the Van Gogh painting
- The pixels array to swap colour channels between the two images
- A 3x3 edge detection kernel (convolution) to draw outlines
- Random strips of the images cut and shifted every frame for the glitch effect
- Small copies of the moon face rotating around the canvas
- Film holes drawn down both sides

## Controls

- R: make a new random version
- Space: pause or unpause
- S: save the current frame as a PNG

## Palettes project

The palettes-project folder has a smaller sketch I did on colour palettes in HSB. It has a slider for the hue and another for the gap between blocks.

Live demo: https://aurangzeb002.github.io/moonfield-crash/palettes-project/

## How to run

Because the sketch loads images, it needs to run on a local server. From the project folder run:

```
python3 -m http.server 8000
```

Then go to http://localhost:8000 in your browser.

## Image credits

Both images are public domain.

- Georges Méliès, Le Voyage dans la Lune (1902): https://commons.wikimedia.org/wiki/File:Melies_color_Voyage_dans_la_lune.jpg
- Vincent van Gogh, Wheat Field with Cypresses (1889)
