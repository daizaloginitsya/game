let GAME = {
    width: 600,
    height: 870,
    ifLost: false,
    bcgcolor: "red",
    pause: false,
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

// let bullet = {
//     size
// }

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
let hero = new Image(), bg = new Image(), meteor = new Image(), live = new Image(), bul = new Image(), medkit = new Image();

bg.src = 'img/bcg.png';
meteor.src = 'img/meteor.png';
hero.src = 'img/hero.png';
live.src = 'img/live.png';
bul.src = 'img/bullet.png';
medkit.src = 'img/medkit.png';

bul.onload = function () {
    PLAYER.bullet = bullet;
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
        METEOR.posY += METEOR.speed;
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
    x:  Math.floor(Math.random() * (GAME.width - 50)),
    y: -50,
    speed: Math.floor(Math.random() * maxMeteorSpeed + minMeteorSpeed),
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
    if (PLAYER.score > 49 && PLAYER.score % 50 === 0) {
        respawnMed();
    }

}

function respawnMed() {
    MED.x = Math.floor(Math.random() * (GAME.width - MED.size));
    MED.y = -MED.size;
    MED.speed = Math.floor(Math.random() * maxMeteorSpeed + 10);

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
    // if (PLAYER.live) {
    //     drawLives();
    // }
    // else{
    //     ctx.fillStyle = InfoWindow.backgroundColor;
    //     ctx.beginPath();
    //     ctx.rect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    //     ctx.fill();
    //     ctx.fillStyle = InfoWindow.textColor;
    //     ctx.font = "30px serif";
    //     ctx.fillText("Yore scrore:", InfoWindow.x + 10, 50);
    //     ctx.fillText(PLAYER.score, InfoWindow.x + 10, 85);
    //     ctx.fillText("Your lives:", InfoWindow + 10, 120);
    //     ctx.fillText(PLAYER.health, InfoWindow.x + 10, 155)
    // }

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
    drawMed();
}

drawBCG();
function play() {
    if (GAME.ifLost == false && GAME.pause == false) {
        drawFrame();
        updateMeteor();
        updateMed();
        requestAnimationFrame(play);
    }
    else {
        if (GAME.ifLost == false && GAME.pause == true){
            gameOverAlert("Игра приостановлена");
        } else {
            gameOverAlert("Лох");
            alert("ЛОХ");
        }
    }
}

function restart() {
    initMeteors();
    PLAYER.health = 3;
    PLAYER.score = 0;
    PLAYER.posX = 277;
    GAME.ifLost = false;
    maxMeteorSize = 55;
    maxMeteorSpeed = 8;
    minMeteorSpeed = 2;
    minMeteorSize = 30;
    play();
}

function pause() {
    if (GAME.pause === false){
        alert("нажмите esc для того чтоб родолжить");
        return false
    } else{
        return True
        play()
    }
    
}


function gameOverAlert(text) {
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, 200, 400);
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

let bullets = []

function OnMouseClick() {

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