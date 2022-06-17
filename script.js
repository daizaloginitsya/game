let GAME = {
    width: 600,
    height: 870,
    ifLost: false,
    bcgcolor: "red",
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

let hero = new Image(), bg = new Image(), meteor = new Image(), live = new Image();

bg.src = 'img/bcg.png';
meteor.src = 'img/meteor.png';
hero.src = 'img/hero.png';
live.src = 'img/live.png';

hero.onload = function() {
    PLAYER.hero = hero;
}

bg.onload = function() {
    GAME.bg = bg;
}
live.onload = function() {
    PLAYER.live = live;
}
meteor.onload = function() {
    METEOR.meteor = meteor;
}

let maxMeteorSize = 50;
let maxMeteorSpeed = 20;
let minMeteorSpeed = 10;
let minMeteorSize = 30;

let METEOR = {
    posX: Math.floor(Math.random() * (GAME.width - maxMeteorSize)),
    width: Math.floor(Math.random() * maxMeteorSize + minMeteorSize), 
    posY: -maxMeteorSize,
    size: Math.floor(Math.random() * maxMeteorSize + minMeteorSize),
    speed: Math.floor(Math.random() * maxMeteorSpeed + minMeteorSpeed),
    color: "black",
}

function drawMeteor() {
    ctx.fillStyle = METEOR.color;
    if (METEOR.meteor) {
        ctx.drawImage(METEOR.meteor, METEOR.posX, METEOR.posY, METEOR.width, METEOR.width * 1.7);
    }
    else{
        ctx.beginPath();
        ctx.arc(METEOR.posX, METEOR.posY, METEOR.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    
}

function updateMeteor() {
    METEOR.posY += METEOR.speed;
    var losePositionY = (METEOR.posY + METEOR.size >= PLAYER.posY);
    var losePositionX = (METEOR.posX - METEOR.size <= PLAYER.posX + PLAYER.width) && (METEOR.posX + METEOR.size >= PLAYER.posX);
    var scoreUpdate = METEOR.posY >= GAME.height + METEOR.size;

     
    if (scoreUpdate) {
        respawnMeteor();
        PLAYER.score++;
    }

    if (losePositionX && losePositionY) {
        respawnMeteor();
        PLAYER.health -=1;
        if (PLAYER.health === 0){
            GAME.ifLost = true;
        }
    }
}

function respawnMeteor() {
    METEOR.posX = Math.floor(Math.random() * (GAME.width - METEOR.width));
    METEOR.width = Math.floor(Math.random() * maxMeteorSize + minMeteorSize);
    METEOR.posY = -METEOR.size;
    METEOR.size = Math.floor(Math.random() * maxMeteorSize + 15);
    METEOR.speed = Math.floor(Math.random() * maxMeteorSpeed + 10);

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
            ctx.drawImage(PLAYER.live, InfoWindow.x  + 10 + i * 35, 155);
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
    else{
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
}

drawBCG();
function play() {
    if (GAME.ifLost == false) {
        drawFrame();
        updateMeteor();
        requestAnimationFrame(play);
    }
    else {
        drawFrame();
        gameOverAlert();
        alert("ЛОХ ЕБАТЬ")
    }
}




function gameOverAlert() {
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Ты лох", 200, 400);
}
 
function drawCircle(color, radius, x, y) {
    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
}

function initEventListener() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
}

function onMouseMove(event) {
    if ((event.clientX + PLAYER.width < GAME.width) && (event.clientX - PLAYER.width/2 > 0)) {
        PLAYER.posX = event.clientX - PLAYER.width/2
    } else{
        if(event.clientX + PLAYER.width > GAME.width) {
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
}



play();
initEventListener();