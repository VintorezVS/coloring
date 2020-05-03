const Pixel = require('./Pixel');
const { createImageData } = require('canvas');

class PixelMatrix {
    data = [];

    constructor(imageData) {
        if (imageData.width === 0 || imageData.height === 0) {
            throw new Error('Cannot create PixelMatrix for empty ImageData');
        }

        this.data = this.fromImageData(imageData);
    }

    toImageData() {
        const data = [];

        for (let i = 0; i < this.data.length; i++) {
            const row = this.data[i];

            for (let j = 0; j < row.length; j++) {
                const pixel = row[j];

                data.push(pixel.r, pixel.g, pixel.b, pixel.a);
            }
        }

        return createImageData(new Uint8ClampedArray(data), this.data[0].length - 1, this.data.length - 1);
    }

    fromImageData(imageData) {
        const pixelMatrix = [];
        const { width, height, data } = imageData;

        for (let i = 0; i < height; i++) {
            const row = [];

            for (let j = 0; j < width; j++) {
                const offset = i * j;
                row.push(new Pixel(data[offset], data[offset + 1], data[offset + 2], data[offset + 3]));
            }

            pixelMatrix[i] = row;
        }

        return pixelMatrix;
    }

    addOutline() {
        const outlinePixel = new Pixel(0, 0, 0, 1);

        for (let i = 0; i < this.data.length; i++) {
            const row = this.data[i];
            let currentPixel = this.data[i][0];
            let sameRightPixelCount = 1;
            let sameDownPixelCount = 1;

            for (let j = 1; j < row.length; j++) {
                const rightPixel = row[j];
                const downPixel = this.data[i + 1] ? this.data[i + 1][j] : new Pixel();

                if (currentPixel.isTransparent()) {
                    currentPixel = rightPixel;
                    sameRightPixelCount++;
                    continue;
                }

                if (currentPixel.isEqual(rightPixel)) {
                    sameRightPixelCount++;
                } else {
                    if (sameRightPixelCount > 1) {
                        row[j - 1] = outlinePixel.clone();
                    } else {
                        row[j] = outlinePixel.clone();
                    }
                }

                if (currentPixel.isEqual(downPixel)) {
                    sameDownPixelCount++;
                } else {
                    if (sameDownPixelCount <= 1 && this.data[i + 1]) {
                        this.data[i + 1][j] = outlinePixel.clone();
                    } else {
                        row[j] = outlinePixel.clone();
                    }
                }

                currentPixel = rightPixel;
            }
        }
    }
}

module.exports = PixelMatrix;