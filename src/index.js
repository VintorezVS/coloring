const fs = require("fs");
const { bitmap2vector } = require("bitmap2vector");
const { createSVGWindow } = require('svgdom');
const window = createSVGWindow();
const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
require('@svgdotjs/svg.topoly.js');

registerWindow(window, document);

(async function() {
    const file = fs.readFileSync('./images/1.jpg');
    const svgOutput = await bitmap2vector({
        input: file,
        strokewidth: 0,
        blurradius:3, blurdelta: 256,
        ltres:0.01, qtres:0.01, linefilter:true, rightangleenhance:false,
        colorsampling:0, numberofcolors:27,
        pathomit: 6, roundcoords:2,
    });
    let svgString = svgOutput.content;

    const strokeWidthRegex = /stroke-width=".+?"/g;
    const strokeRegex = /stroke=".+?"/g;
    const fillRegexString = 'fill="(.+?)"';
    const fillRegexLocal = new RegExp(fillRegexString);
    const fillRegexGlobal = new RegExp(fillRegexString, 'g');
    const colors = svgString.match(fillRegexGlobal).map((fillString) => fillString.match(fillRegexLocal)[1])
        .reduce((acc, colorString) => acc.includes(colorString) ? acc : [...acc, colorString], []);

    console.log(`COLORS (${colors.length}): `, colors);

    svgString = svgString.replace(strokeWidthRegex, 'stroke-width="0.25"');
    svgString = svgString.replace(strokeRegex, 'stroke="rgb(127,127,127)"');
    svgString = svgString.replace(fillRegexGlobal, 'fill="none"');

    // const canvas = SVG(document.documentElement);
    // const svgContent = svgString.replace(/<svg.+?>/, '<g id="polygons">').replace('</svg>', '</g>');

    // canvas.svg(svgContent).size(svgOutput.width, svgOutput.height);
    // canvas.findOne('#polygons').children().forEach((element) => {
        // todo: using polygons' points and Google search results of "Алгоритм определения попадания точки в контур"
        //       find good position for writing color number there
        // element.array().toPoly();
    // });

    fs.writeFileSync('./images/output.svg', svgString);
})();
