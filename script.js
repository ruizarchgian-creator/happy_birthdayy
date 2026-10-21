const balloons = document.querySelector(".balloons");

const colors = [
    "#ff6b81",
    "#ff9ff3",
    "#54a0ff",
    "#feca57",
    "#1dd1a1"
];

/* Balloon counter */

let popped = 0;

const counter = document.createElement("div");
counter.className = "counter";
counter.textContent = "Balloons popped: 0 🎈";
document.body.appendChild(counter);


/* Letter challenge */

const goal = 5;   // change this number to make it easier or harder
let unlocked = false;

const letterBtn = document.querySelector(".letter-btn");
letterBtn.classList.add("locked");

function updateLetterBtn(){

    if(unlocked) return;

    if(popped >= goal){

        unlocked = true;
        letterBtn.classList.remove("locked");
        letterBtn.textContent = "💌 Open My Letter";

        const r = letterBtn.getBoundingClientRect();
        burstAt(r.left + r.width / 2, r.top + r.height / 2, 40, 80, 220);

    }else{

        const left = goal - popped;
        letterBtn.textContent = "🔒 Pop " + left + " more balloon" + (left === 1 ? "" : "s");
    }
}

letterBtn.addEventListener("click", (e) => {

    if(unlocked) return;

    e.preventDefault();

    letterBtn.classList.remove("shake");
    void letterBtn.offsetWidth;   // restarts the shake animation
    letterBtn.classList.add("shake");
});


/* Confetti pieces (used by the pop, the candle and taps) */

function burstAt(x, y, count, minDist, maxDist, color){

    for(let i = 0; i < count; i++){

        const p = document.createElement("div");
        p.className = "burst";
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.background = color || colors[Math.floor(Math.random() * colors.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = minDist + Math.random() * (maxDist - minDist);

        p.style.setProperty("--x", Math.cos(angle) * distance + "px");
        p.style.setProperty("--y", Math.sin(angle) * distance + "px");

        document.body.appendChild(p);

        setTimeout(() => p.remove(), 1300);
    }
}


/* Balloons */

function createBalloon(){

    const b = document.createElement("div");

    b.className = "balloon";

    b.style.left = Math.random() * 100 + "vw";

    b.style.background = colors[Math.floor(Math.random() * colors.length)];

    b.style.animationDuration = (6 + Math.random() * 5) + "s";

    b.style.animationDelay = (Math.random() * 5) + "s";

    b.addEventListener("click", (e) => {

        e.stopPropagation();

        const rect = b.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        burstAt(x, y, 14, 40, 110, b.style.background);

        b.remove();

        popped++;
        counter.textContent = "Balloons popped: " + popped + " 🎈";
        updateLetterBtn();

        setTimeout(createBalloon, 2000);
    });

    balloons.appendChild(b);
}

for(let i = 0; i < 20; i++){
    createBalloon();
}

updateLetterBtn();

const style = document.createElement("style");

style.innerHTML = `

.balloon{
    position:fixed;
    bottom:-100px;
    width:50px;
    height:65px;
    border-radius:50%;
    animation:float linear infinite;
}

.balloon::after{
    content:"";
    position:absolute;
    left:50%;
    top:65px;
    width:2px;
    height:80px;
    background:white;
}

@keyframes float{
    from{
        transform:translateY(0);
    }
    to{
        transform:translateY(-120vh);
    }
}

`;

document.head.appendChild(style);


/* Interactive candle */

const cake = document.querySelector(".cake");
const flame = document.querySelector(".flame");
const hint = document.querySelector(".hint");

cake.addEventListener("click", () => {

    if(flame.classList.contains("out")) return;

    flame.classList.add("out");
    hint.textContent = "Make a wish! 🌟";

    const rect = flame.getBoundingClientRect();
    burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, 80, 260);
});


/* Tap anywhere for confetti */

document.addEventListener("click", (e) => {

    // skip the cake (it has its own burst) and links like the letter button
    if(e.target.closest(".cake, a")) return;

    burstAt(e.clientX, e.clientY, 20, 60, 180);
});