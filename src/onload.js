// Welcome Message
console.log("Welcome to the visualization project built by listenzcc.");

// Setups
// Setup Canvas Parameters
const Canvas = ((scaler = 0.5) => {
    const canvas = Object.create({
        name: "mainCanvas",
        width: parseInt(1920 * scaler),
        height: parseInt(1080 * scaler),
    });
    return canvas;
})();

// Setup Assets
const mkImageSrc = (src) => {
    const image = new Image();
    image.src = src;
    return image;
};

const Pics = (() => {
    const pics = Object.create({
        face1: mkImageSrc("./assets/faces/1.jpg"),
        face2: mkImageSrc("./assets/faces/2.jpg"),
        face3: mkImageSrc("./assets/faces/3.jpg"),
        face4: mkImageSrc("./assets/faces/4.jpg"),
        face5: mkImageSrc("./assets/faces/5.jpg"),
        rocket: mkImageSrc("./assets/rocket/R-C.png"),
        final: mkImageSrc("./assets/bigPics/final.jpg"),
    });
    return pics;
})();

// Add footnotes
((containerName = "#footnotes-container") => {
    let dom = d3.select(containerName);

    dom.selectAll("p")
        .data([
            "Author: listenzcc",
            "Load Date: " + new Date(),
            "D3: " + d3.version,
        ])
        .join("p")
        .attr("class", "SimpleMessage")
        .text((e) => {
            return e;
        });

    console.log(`Auto Script for adding footnotes works with ${containerName}`);
})();

// Init #mainCanvas
(() => {
    const { name, width, height } = Canvas;

    let dom = d3.select("#" + name);

    dom.attr("width", `${width}px`).attr("height", `${height}px`);

    console.log(
        `Auto Script for Init #mainCanvas works with ${name} -> ${width}, ${height}.`
    );
})();
