const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const PixelMatrix = require("./PixelMatrix");


function writeCanvasAsFile(canvas, fileName) {
    return new Promise((resolve, reject) => {
        const fd = fs.openSync(`./images/${fileName}`, 'w');

        canvas.toBuffer((bufferError, buffer) => {
            if (bufferError) {
                fs.closeSync(fd);
                reject(bufferError)
            }
            fs.write(fd, buffer, (writeError) => {
                if (writeError) {
                    reject(writeError);
                }
                fs.closeSync(fd);
                resolve();
            });
        });
    });
}

(async function() {
    const image = await loadImage('./images/simple.png');
    const height = image.height;
    const width = image.width;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, width, height);

    const canvasImageData = ctx.getImageData(0, 0, width, height);
    const pixelMatrix = new PixelMatrix(canvasImageData);

    pixelMatrix.addOutline();

    ctx.putImageData(pixelMatrix.toImageData(), 0, 0);

    const error = await writeCanvasAsFile(canvas, 'simple-copy.png');

    if (error) {
        console.error(error);
    }
})();