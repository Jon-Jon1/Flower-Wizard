const mainDisplay = document.getElementById("gameCanvas");
const gameSize = gameCanvas.getBoundingClientRect();
const gameCtx = gameCanvas.getContext("2d");

let player = {
    health: 100,
    x: 100,
    y: 100,
    dead: false,
    speed: 5,
    lastshot: 15,
    firerate: 10,
    direction: "idle",
    width: 100,
    height: 100,
    animationFrame: 0,
    dashing: false,
    dashDirection: null,
    dashDuration: 0,
    dashMaxDuration: 10,
    dashSpeed: 20,
    dashCooldown: 0,
    dashMaxCooldown: 15,
};

let orb = {
    width: 50,
    height: 50,
    animationFrame: 0,
    energy: 1.0,
    radius: 100, // distance from player center
};
let enemies = [];
let keys = [];
let keyPressTime = {};
const DOUBLE_PRESS_THRESHOLD = 250; // milliseconds

//direction arrays
let left = [];
let up = [];
let down = [];
let upRight = [];
let upLeft = [];
let downRight = [];
let downLeft = [];
let drips = [];

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const cardinalKeys = ["w", "a", "s", "d"];

    if (cardinalKeys.includes(key) && !e.repeat && !player.dashing && player.dashCooldown <= 0) {
        const now = Date.now();
        if (keyPressTime[key] && now - keyPressTime[key] < DOUBLE_PRESS_THRESHOLD) {
            player.dashing = true;
            player.dashDirection = key;
            player.dashDuration = player.dashMaxDuration;
            keyPressTime[key] = 0;
        } else {
            keyPressTime[key] = now;
        }
    }

    keys[key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
    player.direction = "idle";
});

document.addEventListener("mousedown", () => {
    mouse.down = true;
});
document.addEventListener("mouseup", () => {
    mouse.down = false;
});

const mouse = {
    x: 0,
    y: 0,
    down: false,
};

const flowerImg = new Image();
flowerImg.src = "Sprites/flowerT.png";
flowerImg.onload = function () {
    drawGame();
};


//movement sheets
let rightSheet = new Image();
rightSheet.src = "Sprites/right/right.png";
let leftSheet = new Image();
leftSheet.src = "Sprites/left/left.png";
let upSheet = new Image();
upSheet.src = "Sprites/up/up.png";
let downSheet = new Image();
downSheet.src = "Sprites/down/down.png";
let upRightSheet = new Image();
upRightSheet.src = "Sprites/upRight/upRight.png";
let upLeftSheet = new Image();
upLeftSheet.src = "Sprites/upLeft/upLeft.png";
let downRightSheet = new Image();
downRightSheet.src = "Sprites/downRight/downRight.png";
let downLeftSheet = new Image();
downLeftSheet.src = "Sprites/downLeft/downLeft.png";
let idleSheet = new Image();
idleSheet.src = "Sprites/idle/idle.png";

// Load orb sprite sheet
let orbFullSheet = new Image();
orbFullSheet.src = "Sprites/orb/full.png";

//drip sheet
let dripSheet = new Image();
dripSheet.src = "Sprites/drip/drip.png";

let directionFrames = {
    right: 4,
    left: 4,
    up: 4,
    down: 4,
    upRight: 4,
    upLeft: 4,
    downRight: 4,
    downLeft: 4,
    idle: 10,
    orbFull: 15
};

let frameWidth = 254;
let frameHeight = 254;

let playerProjectiles = [];

document.addEventListener("mousemove", (e) => {
    const rect = gameCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

let lastOrbAngle = 0;

function getOrbPosition() {
    let playerCenterX = player.x + 127;
    let playerCenterY = player.y + 127;
    if (mouse.down) {
        lastOrbAngle = Math.atan2(mouse.y - playerCenterY, mouse.x - playerCenterX);
    }
    return {
        x: playerCenterX + Math.cos(lastOrbAngle) * orb.radius,
        y: playerCenterY + Math.sin(lastOrbAngle) * orb.radius,
    };
}

function drawGame() {
    gameCtx.clearRect(-5, -5, gameCanvas.width + 10, gameCanvas.height + 10);
    let playerImg = flowerImg;
    let sheet = null;
    if (player.direction === "right" && rightSheet.complete && rightSheet.naturalHeight !== 0) {
        sheet = rightSheet;
    } else if (player.direction === "left" && leftSheet.complete && leftSheet.naturalHeight !== 0) {
        sheet = leftSheet;
    } else if (player.direction === "up" && upSheet.complete && upSheet.naturalHeight !== 0) {
        sheet = upSheet;
    } else if (player.direction === "down" && downSheet.complete && downSheet.naturalHeight !== 0) {
        sheet = downSheet;
    } else if (player.direction === "upRight" && upRightSheet.complete && upRightSheet.naturalHeight !== 0) {
        sheet = upRightSheet;
    } else if (player.direction === "upLeft" && upLeftSheet.complete && upLeftSheet.naturalHeight !== 0) {
        sheet = upLeftSheet;
    } else if (player.direction === "downRight" && downRightSheet.complete && downRightSheet.naturalHeight !== 0) {
        sheet = downRightSheet;
    } else if (player.direction === "downLeft" && downLeftSheet.complete && downLeftSheet.naturalHeight !== 0) {
        sheet = downLeftSheet;
    } else if (player.direction === "idle" && idleSheet.complete && idleSheet.naturalHeight !== 0) {
        sheet = idleSheet;
    }

    if (sheet) {
        let numFrames = directionFrames[player.direction] || 4;
        let frame = player.animationFrame % numFrames;
        gameCtx.drawImage(sheet, frame * frameWidth, 0, frameWidth, frameHeight, player.x, player.y, frameWidth, frameHeight);
    } else {
        gameCtx.drawImage(playerImg, player.x, player.y);
    }


    //Draw drips
    for (let i = drips.length - 1; i >= 0; i--) {
        if (dripSheet.complete && dripSheet.naturalHeight !== 0) {
            let numFrames = dripSheet.width / dripSheet.height; // assumes square frames
            let frameW = dripSheet.height;
            drips[i].frameCounter++;
            drips[i].frame = Math.floor(drips[i].frameCounter / 5); // slower animation
            gameCtx.drawImage(dripSheet, drips[i].frame * frameW, 0, frameW, frameW,
                drips[i].x - frameW / 2, drips[i].y - 100, frameW, frameW);
            if (drips[i].frame >= numFrames) {
                drips.splice(i, 1); // delete once animation is done
            }
        }
    }




    // Draw orb
    let orbSheet = orbFullSheet;
    let { x: orbX, y: orbY } = getOrbPosition();

     for (let i = 0; i < playerProjectiles.length; i++) {
        gameCtx.fillStyle = "#ADD8E6"; // light blue for bubble
        gameCtx.strokeStyle = "#00008B"; // dark blue outline
        gameCtx.lineWidth = 1;
        gameCtx.beginPath();
        gameCtx.arc(playerProjectiles[i].x + 1.5, playerProjectiles[i].y + 3, 5, 0, Math.PI * 2);
        gameCtx.fill();
        gameCtx.stroke();
    }

    if (orbSheet && orbSheet.complete && orbSheet.naturalHeight !== 0) {
        let numFrames = directionFrames.orbFull || 15;
        let orbFrameWidth = orbSheet.width / numFrames;
        let orbFrameHeight = orbSheet.height;
        let frame = orb.animationFrame % numFrames;
        gameCtx.drawImage(orbSheet, frame * orbFrameWidth, 0, orbFrameWidth, orbFrameHeight,
            orbX - orbFrameWidth / 2, orbY - orbFrameHeight / 2, orbFrameWidth, orbFrameHeight);
    } else {
        // Fallback circle only when sheet isn't loaded
        gameCtx.fillStyle = "#FF0000";
        gameCtx.beginPath();
        gameCtx.arc(orbX, orbY, orb.width / 2, 0, Math.PI * 2);
        gameCtx.fill();
    }

    // Draw projectiles
   

    // Draw dash cooldown bar (only show while on cooldown)
    if (player.dashCooldown > 0) {
        let barWidth = 200;
        let barHeight = 8;
        let barX = (gameCanvas.width - barWidth) / 2;
        let barY = gameCanvas.height - 20;
        let cooldownPercent = 1 - (player.dashCooldown / player.dashMaxCooldown);

        gameCtx.fillStyle = "#333333";
        gameCtx.fillRect(barX, barY, barWidth, barHeight);
        gameCtx.fillStyle = "#00FF00";
        gameCtx.fillRect(barX, barY, barWidth * cooldownPercent, barHeight);
        gameCtx.strokeStyle = "#FFFFFF";
        gameCtx.lineWidth = 1;
        gameCtx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

function playerMovement() {
    if (player.dashCooldown > 0) {
        player.dashCooldown--;
    }

    if (player.dashing) {
        const dashMoveAmount = player.dashSpeed;

        if (player.dashDirection === "w") {
            player.y -= dashMoveAmount;
        } else if (player.dashDirection === "s") {
            player.y += dashMoveAmount;
        } else if (player.dashDirection === "a") {
            player.x -= dashMoveAmount;
        } else if (player.dashDirection === "d") {
            player.x += dashMoveAmount;
        }

        player.dashDuration--;
        if (player.dashDuration <= 0) {
            player.dashing = false;
            player.dashDirection = null;
            player.dashCooldown = player.dashMaxCooldown;
        }
    }

    if (player.dead == false) {
        if (keys["w"] && !keys["d"] && !keys["a"] && !keys["s"]) {
            player.y -= player.speed;
            player.direction = "up";
        }
        if (keys["a"] && !keys["s"] && !keys["w"] && !keys["d"]) {
            player.x -= player.speed;
            player.direction = "left";
        }
        if (keys["s"] && !keys["d"] && !keys["a"] && !keys["w"]) {
            player.y += player.speed;
            player.direction = "down";
        }
        if (keys["d"] && !keys["w"] && !keys["s"] && !keys["a"]) {
            player.x += player.speed;
            player.direction = "right";
        }
        if (keys["w"] && keys["d"]) {
            player.x += (player.speed / 3) * 2.5;
            player.y -= (player.speed / 3) * 2.5;
            player.direction = "upRight";
        }
        if (keys["a"] && keys["w"]) {
            player.x -= (player.speed / 3) * 2.5;
            player.y -= (player.speed / 3) * 2.5;
            player.direction = "upLeft";
        }
        if (keys["s"] && keys["a"]) {
            player.x -= (player.speed / 3) * 2.5;
            player.y += (player.speed / 3) * 2.5;
            player.direction = "downLeft";
        }
        if (keys["d"] && keys["s"]) {
            player.x += (player.speed / 3) * 2.5;
            player.y += (player.speed / 3) * 2.5;
            player.direction = "downRight";
        }
        if (keys["a"] && keys["d"]) {
            player.direction = "idle";
        }
        if (keys["w"] && keys["s"]) {
            player.direction = "idle";
        }
        if (keys["a"] && keys["d"] && keys["w"]) {
            player.direction = "up";
        }
        if (keys["a"] && keys["d"] && keys["s"]) {
            player.direction = "down";
        }
        if (keys["w"] && keys["s"] && keys["a"]) {
            player.direction = "left";
        }
        if (keys["w"] && keys["s"] && keys["d"]) {
            player.direction = "right";
        }
    }
    col("player", "wall");
    drawGame();
    requestAnimationFrame(playerMovement);
}

function movementAnimation() {
    let animationCounter = 0;
    let lastDirection = player.direction;
    function animateStep() {
        if (player.direction !== lastDirection) {
            animationCounter = 0;
            lastDirection = player.direction;
        }
        player.animationFrame = animationCounter % 10;
        orb.animationFrame = animationCounter % 10;
        animationCounter++;
        setTimeout(animateStep, 100);
    }
    animateStep();
}

function moveProjectiles() {
    for (let i = 0; i < playerProjectiles.length; i++) {
        playerProjectiles[i].x +=
            Math.cos(playerProjectiles[i].angle) * playerProjectiles[i].speed;
        playerProjectiles[i].y +=
            Math.sin(playerProjectiles[i].angle) * playerProjectiles[i].speed;
    }
    drawGame();
    requestAnimationFrame(moveProjectiles);
    col("playerProj", "wall");
}

function spawnDrip() {
    if (Math.random() < 1 / 250) {
        let { x: orbX, y: orbY } = getOrbPosition();
        drips.push({
            x: orbX,
            y: orbY,
            frame: 0,            frameCounter: 0,        });
    }
    requestAnimationFrame(spawnDrip);
}

function createProjectile() {
    if (player.lastshot <= 0) {
        if (mouse.down) {
            let { x: orbCenterX, y: orbCenterY } = getOrbPosition();
            playerProjectiles.push({
                x: orbCenterX,
                y: orbCenterY,
                angle: Math.atan2(
                    mouse.y + 16 - orbCenterY,
                    mouse.x + 16 - orbCenterX,
                ),
                speed: 15,
            });
            player.lastshot = player.firerate;
            drawGame();
        }
    } else {
        player.lastshot--;
    }
    requestAnimationFrame(createProjectile);
}

function col(entity, colType) {
    if (entity == "player") {
        if (colType == "wall") {
            if (player.x + 50 < 0) player.x = -50;
            if (player.y + 50 < 0) player.y = -50;
            if (player.x + 204 > gameCanvas.width) player.x = gameCanvas.width - 204;
            if (player.y + 254 > gameCanvas.height) player.y = gameCanvas.height - 254;
        }
    }
    if (entity == "playerProj") {
        if (colType == "wall") {
            for (let i = 0; i < playerProjectiles.length; i++) {
                const element = playerProjectiles[i];
                if (element.x > gameCanvas.width || element.x < 0 || element.y > gameCanvas.height || element.y < 0) {
                    playerProjectiles.splice(i, 1);
                }
            }
        }
    }
}

drawGame();
movementAnimation();
requestAnimationFrame(playerMovement);
requestAnimationFrame(createProjectile);
requestAnimationFrame(moveProjectiles);
requestAnimationFrame(spawnDrip);
