class Pixel {
    constructor(r = 0, g = 0, b = 0, a = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    isEqual(pixel) {
        return this.r === pixel.r && this.g === pixel.g && this.b === pixel.b && this.a === pixel.a;
    }

    isTransparent() {
        return this.a === 0;
    }

    clone() {
        return new Pixel(this.r, this.g, this.b, this.a);
    }
}

module.exports = Pixel;