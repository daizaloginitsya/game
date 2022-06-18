let GAME = {
    width: 600,
    height: 870,
    ifLost: false,
    bcgcolor: "red",
    pause: false,
    record: 0,
}

let InfoWindow = {
    width: 200,
    height: GAME.height,
    x: GAME.width,
    backgroundColor: "black",
    textColor: "white",
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canWidth = GAME.width;
var canHeight = GAME.height;

let PLAYER = {
    width: 45,
    height: 21,
    posX: 277.7,
    posY: 700,
    color: "white",
    score: 0,
    health: 3,
    xDirection: 25,
}

let maxMeteorSize = 55;
let maxMeteorSpeed = 8;
let minMeteorSpeed = 2;
let minMeteorSize = 30;


let METEOR = {
    posX: Math.floor(Math.random() * (GAME.width - maxMeteorSize)),
    width: Math.floor(Math.random() * maxMeteorSize + minMeteorSize),
    posY: -maxMeteorSize,
    size: Math.floor(Math.random() * maxMeteorSize + minMeteorSize),
    speed: Math.floor(Math.random() * maxMeteorSpeed + minMeteorSpeed),
    color: "black",
}

let METEORS = [];
let countMeteors = 3;
let meteorSize = 20;


let targetSize = 50;
let TARGET = {
    x: Math.floor(Math.random() * (GAME.width - targetSize)),
    y: -targetSize,
    speed: 2,
}

function initMeteors() {
    var i = 0;
    do {
        var initX = Math.floor(Math.random() * (GAME.width - meteorSize));
        var initSpeed = Math.floor(Math.random() * (maxMeteorSpeed + minMeteorSpeed) / 2 + 5);
        METEORS[i] = {
            x: initX,
            y: -20,
            speed: initSpeed,
            size: Math.floor(Math.random() * maxMeteorSize + minMeteorSize),
        }
        console.log(i);
        i++;
    }
    while (i < countMeteors)

}

let BulletsCount = 10;
let bullets = [];
let bulletSize = 25;
let bulletSpeed = 20;

function initBullets() {
    var i = 0;
    do {
        bullets[i] = {
            x: PLAYER.posX + PLAYER.width / 2,
            y: 10000,
            speed: bulletSpeed,
            size: bulletSize,
            uses: false,
        }
        console.log(i);
        i++;
    }
    while (i < BulletsCount)
}

initBullets();

let hero = new Image(), bg = new Image(), meteor = new Image(), live = new Image(), bul = new Image(), medkit = new Image(), target = new Image();

bg.src = 'img/bcg.png';
meteor.src = 'img/meteor.png';
hero.src = 'img/hero.png';
live.src = 'img/live.png';
bul.src = 'img/bullet.png';
medkit.src = 'img/medkit.png';
target.src = 'img/target.png';

target.onload = function () {
    TARGET.target = target;
}

bul.onload = function () {
    PLAYER.bullet = bul;
}

hero.onload = function () {
    PLAYER.hero = hero;
}

bg.onload = function () {
    GAME.bg = bg;
}
live.onload = function () {
    PLAYER.live = live;
}
meteor.onload = function () {
    METEOR.meteor = meteor;
}

medkit.onload = function () {
    GAME.medkit = medkit;
}

initMeteors();

function drawTarget() {
    if (TARGET.target) {
        ctx.drawImage(TARGET.target, TARGET.x, TARGET.y, targetSize, targetSize);
    }
    else {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(TARGET.x, TARGET.y, TARGET / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

function respawnTarget() {
    TARGET.x = Math.floor(Math.random() * (GAME.width - METEOR.width));
    TARGET.y = -targetSize;
}

function updateTarget() {
    TARGET.y += TARGET.speed;
    if (PLAYER.score % 15 === 0) {
        respawnTarget();
    }
    if (TARGET.y > GAME.height) {
        respawnTarget();
    }

}

function hideTarget() {
    TARGET.y = 10000;
}

function drawBullet() {
    for (let i in bullets) {
        ctx.fillStyle = "white";
        if (PLAYER.bullet) {
            ctx.drawImage(PLAYER.bullet, bullets[i].x, bullets[i].y, bulletSize, bulletSize * 1.4);
        } else {
            ctx.beginPath();
            ctx.arc(bullets[i].x, bullets[i].y, bulletSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }
}

function updateBullet() {
    for (let i in bullets) {
        if (bullets[i].uses === true) {
            bullets[i].y -= bulletSpeed;
            if (bullets[i].y <= 0) {
                respawnBullet(i);
            }

            var mx = TARGET.x;
            var my = TARGET.y;
            var mw = targetSize;
            var mh = targetSize;
            var xcheck = (bullets[i].x - bullets[i].size <= mx + mw / 2) && (bullets[i].x + bullets[i].size / 2 >= mx);
            var ycheck = (bullets[i].y + bullets[i].size >= my && bullets[i].y <= my + mh);

            if (xcheck && ycheck) {
                for (let i = 0; i<3; i++) {
                    PLAYER.score++;
                    if (PLAYER.score % 50 === 0) {
                        MED.resp = true;
                    }
                }
                respawnBullet(i);
                hideTarget();
            }

        }
        else {
            bullets[i].x = PLAYER.posX + PLAYER.width / 2
        }

    }
}

function respawnBullet(i) {
    bullets[i] = {
        x: PLAYER.posX + PLAYER.width / 2,
        y: 10000,
        speed: bulletSpeed,
        size: bulletSize,
        uses: false,
    }
}

function drawMeteor() {
    for (let i in METEORS) {
        ctx.fillStyle = METEOR.color;
        if (METEOR.meteor) {
            ctx.drawImage(METEOR.meteor, METEORS[i].x, METEORS[i].y, METEORS[i].size, METEORS[i].size * 1.7);
        }
        else {
            ctx.beginPath();
            ctx.arc(METEORS[i].x, METEORS[i].y, METEORS[i].size, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }

}

function updateMeteor() {
    for (let i in METEORS) {
        METEORS[i].y += METEORS[i].speed;
        var losePositionY = (METEORS[i].y + METEORS[i].size >= PLAYER.posY && METEORS[i].y <= PLAYER.posY + PLAYER.height);
        var losePositionX = (METEORS[i].x - METEORS[i].size <= PLAYER.posX + PLAYER.width / 2) && (METEORS[i].x + METEORS[i].size / 2 >= PLAYER.posX);
        var scoreUpdate = METEORS[i].y >= GAME.height + METEORS[i].size;


        if (scoreUpdate) {
            respawnMeteor(i);
            PLAYER.score++;
        }

        if (losePositionX && losePositionY) {
            respawnMeteor(i);
            PLAYER.health -= 1;
            if (PLAYER.health === 0) {
                GAME.ifLost = true;
            }
        }
    }

}

function respawnMeteor(i) {
    if (PLAYER.score > 0 && PLAYER.score % 10 === 0) {
        maxMeteorSpeed += 1;
        minMeteorSpeed += 1;
    }
    METEORS[i].x = Math.floor(Math.random() * (GAME.width - METEOR.width));
    METEORS[i].width = Math.floor(Math.random() * maxMeteorSize + minMeteorSize);
    METEORS[i].y = -METEOR.size;
    METEORS[i].size = Math.floor(Math.random() * maxMeteorSize + minMeteorSize);
    METEORS[i].speed = Math.floor(Math.random() * maxMeteorSpeed + 10);

}

let MED = {
    size: 50,
    x: Math.floor(Math.random() * (GAME.width - 50)),
    y: -50,
    speed: Math.floor(Math.random() * maxMeteorSpeed + minMeteorSpeed),
    resp: false,
}

function drawMed() {
    if (METEOR.meteor) {
        ctx.drawImage(GAME.medkit, MED.x, MED.y, MED.size, MED.size * 0.78);
    }
}

function updateMed() {

    MED.y += MED.speed;
    var losePositionY = (MED.y + MED.size >= PLAYER.posY && MED.y <= PLAYER.posY + PLAYER.height);
    var losePositionX = (MED.x - MED.size <= PLAYER.posX + PLAYER.width / 2) && (MED.x + MED.size / 2 >= PLAYER.posX);
    var scoreUpdate = MED.y >= GAME.height + MED.size;

    if (losePositionX && losePositionY) {
        if (PLAYER.health < 3) {
            PLAYER.health = 3;
        } else {
            PLAYER.health++
        }

        hideMed();
    }

    for (let i in bullets) {
        var cheky = (MED.y + MED.size >= bullets[i].y && MED.y <= bullets[i].y + bullets[i].size);
        var chekx = (MED.x - MED.size <= bullets[i].x + bullets[i].size / 2) && (MED.x + MED.size / 2 >= bullets[i].x);
        if (chekx && cheky) {
            PLAYER.health++
            hideMed();
        }
    }

    if ((PLAYER.score > 49 && PLAYER.score % 50 === 0) || MED.resp === true) {
        respawnMed();
        MED.resp = false;
    }

}

function respawnMed() {
    MED.x = Math.floor(Math.random() * (GAME.width - MED.size));
    MED.y = -MED.size;

}

function hideMed() {
    MED.y = 8000;
}


function drawInfo() {
    ctx.fillStyle = InfoWindow.backgroundColor;
    ctx.beginPath();
    ctx.rect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = InfoWindow.textColor;
    ctx.font = "30px serif";
    ctx.fillText("Yore scrore:", InfoWindow.x + 10, 50);
    ctx.fillText(PLAYER.score, InfoWindow.x + 10, 85);
    ctx.fillText("Your lives:", InfoWindow.x + 10, 120);
    if (PLAYER.live) {
        drawLives();
    }
    else {
        ctx.fillText(PLAYER.health, InfoWindow.x + 10, 155)
    }

    ctx.fillText("рестарт - R", InfoWindow.x + 10, 280)

}

function drawLives() {
    if (PLAYER.live) {
        for (let i = 0; i < PLAYER.health; i++) {
            ctx.drawImage(PLAYER.live, InfoWindow.x + 10 + i * 35, 155);
        }

    }
}

function drawBCG() {
    canvas.width = canWidth + InfoWindow.width;
    canvas.height = canHeight;

    if (GAME.bg) {
        ctx.drawImage(GAME.bg, 0, 0)
    }
    else {
        ctx.fillStyle = GAME.bcgcolor;
        ctx.fillRect(0, 0, GAME.width, GAME.height);
    }
}

function drawPlayer() {
    if (PLAYER.hero) {
        ctx.drawImage(PLAYER.hero, PLAYER.posX, PLAYER.posY)
    }
    else {
        ctx.fillStyle = PLAYER.color;
        ctx.fillRect(PLAYER.posX, PLAYER.posY, PLAYER.width, PLAYER.height);
    }

}

function drawFrame() {
    ctx.clearRect(0, 0, GAME.width, GAME.height);
    drawBCG();
    drawInfo();
    drawPlayer();
    drawMeteor();
    drawTarget();
    drawMed();
    drawBullet();
}

drawBCG();
function play() {
    if (GAME.ifLost == false && GAME.pause == false) {
        drawFrame();
        updateBullet();
        updateMeteor();
        updateMed();
        updateTarget();
        requestAnimationFrame(play);
    }
    else {
        if (GAME.ifLost == false && GAME.pause == true) {
            gameOverAlert("Игра приостановлена");
        } else {
            drawFrame();
            gameOverAlert("Лох");
        }
        if (PLAYER.score > GAME.record) {
            console.log(PLAYER.score)
            document.getElementById("record").innerHTML = "Рекорд: " + PLAYER.score;
            GAME.record = PLAYER.score;
        }
    }
}

function restart() {
    initMeteors();
    PLAYER.health = 3;
    
    PLAYER.posX = 277;
    maxMeteorSize = 55;
    maxMeteorSpeed = 8;
    minMeteorSpeed = 2;
    minMeteorSize = 30;
    PLAYER.score = 0;
    if (GAME.ifLost === true) {
        GAME.ifLost = false;
        play();
    }
    
}

function pause() {
    if (GAME.pause === false) {
        alert("нажмите esc для того чтоб родолжить");
        return false
    } else {
        return True
        play()
    }

}

lose = new Image()
lose.src = 'img/lose.jpg'
lose.onload = function() {
    GAME.loseimg = lose;
}

function gameOverAlert(text) {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, GAME.width, GAME.height)
    // ctx.font = "60px Arial";
    // ctx.fillStyle = "white";
    // ctx.fillText(text, 200, 400);
    if (GAME.loseimg) {
        ctx.drawImage(GAME.loseimg, 0, 200, 600, 600*0.5625)
    }
}

function drawCircle(color, radius, x, y) {
    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
}

function initEventListener() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", OnMouseClick);
}



function OnMouseClick() {
    for (let i in bullets) {
        uses = bullets[i].uses;
        if (uses === false) {
            bullets[i].y = PLAYER.posY + 10;
            bullets[i].uses = true;
            freebullet = true;
            break
        }
    }
}

function onMouseMove(event) {
    if ((event.clientX + PLAYER.width < GAME.width) && (event.clientX - PLAYER.width / 2 > 0)) {
        PLAYER.posX = event.clientX - PLAYER.width / 2
    } else {
        if (event.clientX + PLAYER.width > GAME.width) {
            PLAYER.posX = GAME.width - PLAYER.width
        } else {
            PLAYER.posX = 0
        }
    }
}

function onKeyDown(event) {
    if (event.key === "ArrowLeft") {
        PLAYER.posX = PLAYER.posX - PLAYER.xDirection
    }
    if (event.key === "ArrowRight") {
        PLAYER.posX = PLAYER.posX + PLAYER.xDirection
    }
    if (PLAYER.posX < 0) {
        PLAYER.posX = 0
    }
    if (PLAYER.posX + PLAYER.width > GAME.width) {
        PLAYER.posX = GAME.width - PLAYER.width
    }
    if (event.key === "r") {
        restart();
    }
    if (event.key == "Escape") {
        GAME.pause = pause()
    }
}



play();
initEventListener();