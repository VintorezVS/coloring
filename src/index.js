const fs = require("fs");
const { bitmap2vector } = require("bitmap2vector");
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

// (async function() {
//     const image = await loadImage('./images/simple.png');
//     const height = image.height;
//     const width = image.width;
//     const canvas = createCanvas(width, height);
//     const ctx = canvas.getContext('2d');
//
//     ctx.drawImage(image, 0, 0, width, height);
//
//     const canvasImageData = ctx.getImageData(0, 0, width, height);
//     const pixelMatrix = new PixelMatrix(canvasImageData);
//
//     pixelMatrix.addOutline();
//
//     ctx.putImageData(pixelMatrix.toImageData(), 0, 0);
//
//     const error = await writeCanvasAsFile(canvas, 'simple-copy.png');
//
//     if (error) {
//         console.error(error);
//     }
// })();

fs.readFile('./images/1.jpg', (err, input) => {
    bitmap2vector({
        input,
        // colorsampling: 0,
        // pal: [{"a":255,"r":255,"g":255,"b":255},{"a":255,"r":245,"g":212,"b":5},{"a":255,"r":36,"g":41,"b":32},{"a":255,"r":237,"g":167,"b":193},{"a":255,"r":140,"g":92,"b":79},{"a":255,"r":4,"g":147,"b":62},{"a":255,"r":5,"g":82,"b":147},{"a":255,"r":218,"g":36,"b":28},{"a":255,"r":16,"g":138,"b":207},{"a":255,"r":171,"g":172,"b":156},{"a":255,"r":204,"g":36,"b":44}],
        // help: true,
        // blurradius: 1,
        // colorsampling: 0,
        // numberofcolors: 11,
        strokewidth: 0,
        blurradius:5, blurdelta: 64,
        ltres:0.01, linefilter:true, rightangleenhance:false,
        colorsampling:0, numberofcolors:27
        // pathomit: 4,
    }).then((out) => {
        fs.writeFileSync('./images/output2.svg', out.content);
    })
});