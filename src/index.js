import domready from "domready"
import "./style.css"
import SimplexNoise from "simplex-noise"

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;
let noise

const circleSize = 0.012
const circleDist = 0.066

function hexagon(x, y, a = 0, d)
{
    circle(x,y)

    const { width, height } = config

    const sym = 6

    for (let i = 1; i < 6; i++)
    {
        let a0 = a
        let step = TAU / sym
        for (let j = 0; j < sym; j++)
        {
            const num = i

            const a1 = a0 - TAU / 3
            let cos0 = Math.cos(a0)
            let sin0 = Math.sin(a0)
            let cos1 = Math.cos(a1)
            let sin1 = Math.sin(a1)

            for (let k = 0; k < num; k++)
            {
                let x0 = x + cos0 * i * d + cos1 * k * d
                let y0 = y + sin0 * i * d + sin1 * k * d
                circle(x0,y0)
            }
            a0 += step
        }
    }

}
function circle(x, y)
{
    const { width, height } = config
    const r = Math.round(Math.max(width, height) * circleSize)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arc(x,y,r,0,TAU, true)
    ctx.fill()
}


function newLength()
{
    return Math.round(300 + Math.random() * 200)
}

class Ptr
{
    x = 0
    y = 0
    dx = 0
    dy = 0
    steps = 0

    id = 0

    speed = 0.0004

    constructor(x0,y0,speed)
    {
        this.id = Math.random() * 10
        this.speed = speed
        this.init(x0,y0)
    }

    init(x0,y0)
    {
        this.x = x0
        this.y = y0

        const angle = Math.random() * TAU

        this.dx = Math.cos(angle) * this.speed
        this.dy = Math.sin(angle) * this.speed
        this.steps = newLength()
    }

    next()
    {
        this.x += this.dx
        this.y += this.dy

        this.steps--

        if (this.steps === 0)
        {
            this.init(this.x, this.y)
        }

        return noise.noise3D(this.x, this.y, this.id)
    }
}

let active = 0
let counter = 1

domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;

        const cx = width >> 1
        const cy = height >> 1

        const paint = () => {

            const id = active = counter++

            const ptrs = Array.from({length: 10}).map( (o,i) => new Ptr(Math.random(), Math.random(), i === 9 ? 0.0012 : 0.0004))

            noise = new SimplexNoise()

            const zoom = 0.5

            const animate = () => {

                const movement = Math.max(width,height) * 0.2
                const rotation = TAU/6

                ctx.globalCompositeOperation = "source-over"
                ctx.fillStyle = "#000";
                ctx.fillRect(0,0, width, height);


                const d = Math.round(Math.max(width, height) * circleDist)

                const nd0 =  d * (1 + ptrs[9].next() * zoom)

                const nx0 = ptrs[0].next() * movement
                const ny0 = ptrs[1].next() * movement
                const na0 = ptrs[2].next() * rotation

                const nx1 = ptrs[3].next() * movement
                const ny1 = ptrs[4].next() * movement
                const na1 = ptrs[5].next() * rotation

                const nx2 = ptrs[6].next() * movement
                const ny2 = ptrs[7].next() * movement
                const na2 = ptrs[8].next() * rotation

                ctx.globalCompositeOperation = "lighten"
                ctx.fillStyle = "#f00";
                hexagon(cx + nx0, cy + ny0, na0, nd0)

                ctx.fillStyle = "#0d0";
                hexagon(cx + nx1, cy + ny1, na1, nd0)

                ctx.fillStyle = "#22f";
                hexagon(cx + nx2, cy + ny2, na2, nd0)

                if (id === active)
                {
                    requestAnimationFrame(animate)
                }
                else
                {
                    console.log("stop")
                }
            }

            requestAnimationFrame(animate)
        }

        paint()

        canvas.addEventListener("click", paint, true)

    }
);
