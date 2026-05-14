const { Jimp } = require('jimp');

Jimp.read('public/image.png')
  .then(image => {
    // Iterate through each pixel
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      const red = image.bitmap.data[idx];
      const green = image.bitmap.data[idx + 1];
      const blue = image.bitmap.data[idx + 2];
      const alpha = image.bitmap.data[idx + 3];

      // If pixel is white or very light (background), make it transparent
      if (red > 240 && green > 240 && blue > 240) {
        image.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      }
    });

    return image.write('public/image.png');
  })
  .then(() => {
    console.log('✅ Background removed successfully!');
  })
  .catch(err => {
    console.error('Error:', err);
  });
