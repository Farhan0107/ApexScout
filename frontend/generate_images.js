import fs from 'fs';
import sharp from 'sharp';

const runnerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 100 100">
  <path fill="white" d="M40,20 C40,14.47 44.47,10 50,10 C55.53,10 60,14.47 60,20 C60,25.53 55.53,30 50,30 C44.47,30 40,25.53 40,20 Z M65,40 L60,80 L52,80 L50,55 L40,80 L32,80 L30,40 L20,35 L20,25 L40,35 L55,30 L65,40 Z"/>
</svg>`;

const basketballSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 100 100">
  <path fill="white" d="M50,10 C55.53,10 60,14.47 60,20 C60,25.53 55.53,30 50,30 C44.47,30 40,25.53 40,20 Z M35,40 L40,80 L48,80 L50,55 L60,80 L68,80 L70,40 L80,35 L80,25 L60,35 L45,30 L35,40 Z"/>
  <circle cx="85" cy="25" r="8" fill="white"/>
</svg>`;

async function generate() {
    await sharp(Buffer.from(runnerSvg)).webp({ quality: 80, alphaQuality: 100 }).toFile('./src/assets/athletes/runner.webp');
    await sharp(Buffer.from(basketballSvg)).webp({ quality: 80, alphaQuality: 100 }).toFile('./src/assets/athletes/basketball.webp');
    console.log('Images generated');
}
generate();
