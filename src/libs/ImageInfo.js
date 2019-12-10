const jimp = require('jimp');

export default async (file) => {

  // 1. check file size
  const { name, size } = file;
  if (size > 4 * 1024 * 1024) {
    throw new Error(`(${Math.round(size / 10000) / 100} MB) is oversize 4 MB`);
  }

  const url = URL.createObjectURL(file);
  const image = await jimp.read(url);

  // 2. check image type
  const type = image._originalMime;
  if (type !== 'image/jpeg') {
    throw new Error(`(${type}) should be JPG format`);
  }

  // 3. check image width and height
  const {width, height} = image.bitmap;
  if (width < 600 || width > 4200 || height < 100 || height > 4200) {
    throw new Error(`(${width}x${height}) is not in the range of 600x100 to 4200x4200`);
  }

  // 4. check black and white in each pixel
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const hex = image.getPixelColor(x, y);
      const rgb = jimp.intToRGBA(hex);

      const { r, g, b } = rgb;
      if (r !== g || g !== b) {
        throw new Error(`is not black and white image because pixel (${x},${y}) RGB is (${r},${g},${b})`);
      }
    }
  }

  // image info
  return {name, type, size, width, height, url, file};
}
