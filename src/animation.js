// ! -----------------------------------------
// ! Make sure the script is operated AFTER onload.js

// Start-up message
console.log("Animation Script is operated.");

// ----------------------------------------------------------------
const { name, width, height } = Canvas;
const ctx = document.getElementById(name).getContext("2d");

const clearCtx = (fill = "#334567") => {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, width, height);
};

const area1 = Object.create({
    x: parseInt(width * 0.1),
    y: parseInt(height * 0.5),
    w: parseInt(width * 0.6),
    h: parseInt(height * 0.4),
});

const area2 = Object.create({
    x: parseInt(width * 0.75),
    y: parseInt(height * 0.2),
    w: parseInt(width * 0.2),
    h: parseInt(height * 0.7),
});

const renderImgSrc = (imgSrc, x, y, w, d) => {
    ctx.save();
    ctx.setTransform(1, 0, -0.2, 1, x, y);
    ctx.drawImage(imgSrc, 0, 0, w, d);
    ctx.restore();
    requestAnimationFrame(() => renderImgSrc(imgSrc, x, y, w, d));
};

const drawAreaHelper = (stroke = "white") => {
    ctx.strokeStyle = stroke;
    const lst = [area1, area2];

    for (let i = 0; i < lst.length; i++) {
        let a = lst[i];
        ctx.strokeRect(a.x, a.y, a.w, a.h);
    }
};

// ----------------------------------------------------------------
clearCtx();
drawAreaHelper();

let d0 = new Date();
const millisecond = () => {
    return new Date() - d0;
};

// ----------------------------------------------------------------
// Animation of Faces.
// The faces enter from left to right in area1.
// Since there are 5 faces by design, they stop aligning by x-axis with equal distances between them.
// The outlook likes following:
//
// >>>> --x----x----x----x----x----
// >>>> --|o|--|o|--|o|--|o|--|o|--
//
// Finally, they leave out to the bottom line of the area2.
// - @imgSrc: The image of the face;
// - @name: The title on the top of the face;
// - @timeExtentEnter: The lifetime of the Entering period;
// - @xDomainEnter: The domain used by scaling the x-position of the face;
// - @timeExtentEnter: The lifetime of the Leaving period.
const animationFaces = (
    imgSrc,
    name,
    timeExtentEnter,
    xDomainEnter,
    timeExtentLeave
) => {
    let t = millisecond();

    if (t < timeExtentEnter[0] || t > timeExtentLeave[1]) {
        return -1;
    }

    const xScaler = d3
        .scaleLinear()
        .domain(xDomainEnter)
        .range([area1.x, area1.x + (area1.w / 5) * 4]);

    if (t > timeExtentEnter[0] && t < timeExtentLeave[0]) {
        t = d3.min([t, timeExtentEnter[1]]);

        const x = xScaler(t);
        const y = area1.y + area1.h * 0.05;
        const w = (area1.w / 5) * 0.9;
        const h = area1.h * 0.9;

        ctx.save();
        ctx.setTransform(1, 0, -0.2, 1, x, y);
        ctx.drawImage(imgSrc, 0, 0, w, h);
        ctx.restore();

        if (t >= timeExtentEnter[1]) {
            ctx.fillStyle = "white";
            ctx.font = "48px serif";
            ctx.fillText(name, x, y - h * 0.1);
        }
    } else {
        const yScaler = d3
            .scaleLinear()
            .domain(timeExtentLeave)
            .range([area1.y + area1.h * 0.05, area1.y + area1.h * 1.01]);
        const x = xScaler(timeExtentEnter[1]);
        // const y = area1.y + area1.h * 0.05;
        const y = yScaler(t);
        const w = (area1.w / 5) * 0.9;
        const h = area1.h * 0.9;

        ctx.save();
        ctx.setTransform(1, 0, -0.2, 1, x, y);
        ctx.drawImage(imgSrc, 0, 0, w, h);
        ctx.restore();

        const oScaler = d3
            .scaleLinear()
            .domain(timeExtentLeave)
            .range([1, 0.2]);

        const white = d3.color("white");
        white.opacity = oScaler(t);
        ctx.fillStyle = white;
        ctx.font = "48px serif";
        ctx.fillText(name, x, y - h * 0.1);
    }
};

// Animation of Rockets: Phase 1
// It is accumulating and becoming shorter and wider in area2,
// - @timeExtent: The lifetime.
const animationRocket1 = (timeExtent) => {
    const t = millisecond();
    if (t < timeExtent[0] || t > timeExtent[1]) {
        return -1;
    }

    const img = Pics.rocket;

    const wScaler = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([area2.w * 0.8, area2.w * 1.2]);
    const w = wScaler(t);

    const hScaler = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([area2.h * 1.0, area2.h * 0.6]);
    const h = hScaler(t);

    const x = parseInt(area2.x + (area2.w - w) / 2);
    const y = parseInt(area2.y + area2.h - h);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
};

// Animation of Rockets: Phase 2
// It is releasing and becoming longer and thinner in area2,
// - @timeExtent: The lifetime.
const animationRocket2 = (timeExtent) => {
    let t = millisecond();
    if (t < timeExtent[0] || t > timeExtent[1]) {
        return -1;
    }
    t = d3.min([t, timeExtent[1]]);

    const img = Pics.rocket;

    const wScaler = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([area2.w * 1.5, area2.w * 1.0]);
    const w = wScaler(t);

    const hScaler = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([area2.h * 0.6, area2.h * 1.0]);
    const h = hScaler(t);

    const x = parseInt(area2.x + (area2.w - w) / 2) + d3.randomUniform(-5, 5)();
    const y = parseInt(area2.y + area2.h - h);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
};

// Animation of Rockets: Phase 3
// It arises until out of the top bound of the area2,
// -@timeExtent: The lifetime.
const animationRocket3 = (timeExtent) => {
    const t = d3.min([millisecond(), timeExtent[1]]);
    if (t < timeExtent[0] || t > timeExtent[1]) {
        return -1;
    }

    const img = Pics.rocket;

    const wScaler = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([area2.w * 1.2, area2.w * 1.0]);
    const w = wScaler(t);

    const h = area2.h;

    const x = parseInt(area2.x + (area2.w - w) / 2) + d3.randomUniform(-5, 5)();

    const yScaler = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([area2.y + area2.h - h, -h]);
    const y = yScaler(t);
    // const y = parseInt(area2.y + area2.h - h);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
};

// Animation of Stars
// It simulates the stars falling while the rocket is arising,
// there are several components.

// Generate stars using pre-installed pictures (Icons),
// it defines the imgSrc, speed and rad of the falling,
// it also maintenances the position to simulate a continuous falling trace.
const mkStar = (imgSrc) => {
    const rad = (Math.PI / 2) * 0.1;
    const param = Object.create({
        imgSrc: imgSrc,
        speed: d3.randomUniform(1, 10)(),
        rad: rad,
        x: d3.randomUniform(0, width)(),
        y: 0,
    });
    return param;
};

const stars = Icons.map((e) => mkStar(e));

// The stars are falling at their parameters,
// - @timeExtent: The lifetime.
const animationStars = (timeExtent) => {
    const t = millisecond();
    if (t < timeExtent[0] || t > timeExtent[1]) {
        return -1;
    }

    const pScaler = d3
        .scaleLinear()
        .domain([0, timeExtent[1] - timeExtent[0]])
        .range([0, height]);

    for (const star of stars) {
        let y = pScaler(t) * star.speed * Math.cos(star.rad);
        let x = star.x + pScaler(t) * star.speed * Math.sin(star.rad);
        y %= height;
        x %= width;
        y = parseInt(y);
        x = parseInt(x);

        const w = parseInt(width / 30),
            h = parseInt(height / 30);

        const img = star.imgSrc;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, x, y);
        ctx.drawImage(img, 0, 0, w, h);
        ctx.restore();
    }
};

// Animation of introducing the final scene
// It becomes more and more light to introduce the final scene
// -@timeExtent: The lifetime.
const animationIntro = (timeExtent) => {
    const t = millisecond();
    if (t < timeExtent[0] || t > timeExtent[1]) {
        return -1;
    }

    const oScaler = d3.scaleLinear().domain(timeExtent).range([0, 0.8]);

    const w = d3.color("white");
    w.opacity = oScaler(t);

    ctx.save();
    ctx.fillStyle = w;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
};

// The final Scene
const animationFinal = (timeExtent) => {
    const t = millisecond();
    if (t < timeExtent[0]) {
        return -1;
    }

    const img = Pics.final;
    ctx.save();
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();

    const oScaler = d3.scaleLinear().domain(timeExtent).range([0.8, 0]);
    const w = d3.color("white");
    w.opacity = oScaler(t);
    ctx.save();
    ctx.fillStyle = w;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
};

// Start Animation
const frames = () => {
    clearCtx();
    // drawAreaHelper();

    animationFaces(Pics.face1, "个", [0, 500], [500, 2500], [2500, 4000]);
    animationFaces(Pics.face2, "十", [0, 1000], [500, 2500], [2500, 4000]);
    animationFaces(Pics.face3, "百", [0, 1500], [500, 2500], [2500, 4000]);
    animationFaces(Pics.face4, "千", [0, 2000], [500, 2500], [2500, 4000]);
    animationFaces(Pics.face5, "万", [0, 2500], [500, 2500], [2500, 4000]);

    animationRocket1([0, 2500]);
    animationRocket2([2500, 4000]);
    animationRocket3([4000, 8000]);

    animationStars([4000, 9000]);

    animationIntro([6000, 8000]);

    animationFinal([8000, 10000]);

    requestAnimationFrame(() => frames());
};

frames();
