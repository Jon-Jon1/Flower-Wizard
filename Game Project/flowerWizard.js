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
	firerate: 0,
	direction: "idle",
};
let enemies = [];
let keys = [];

//direction arrays
let right = [];
let left = [];
let up = [];
let down = [];
let upRight = [];
let upLeft = [];
let downRight = [];
let downLeft = [];

document.addEventListener("keydown", (e) => {
	keys[e.key.toLowerCase()] = true;
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
flowerImg.src = "sprites/flowerT.png";

let playerProjectiles = [];

gameCanvas.addEventListener("mousemove", (e) => {
	const rect = gameCanvas.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
});
let b = 0;
/* function checkPlayerColision(){

} */
function drawGame() {
	gameCtx.clearRect(-5, -5, gameCanvas.width + 10, gameCanvas.height + 10);
	gameCtx.drawImage(flowerImg, player.x, player.y);
	//draw projectiles
	for (let i = 0; i < playerProjectiles.length; i++) {
		for (let a = 0; a < 6; a++) {
			gameCtx.fillStyle = "#0000ff";
			gameCtx.fillRect(
				playerProjectiles[i].x,
				playerProjectiles[i].y,
				3,
				6,
			);
		}
	}
}

function playerMovement() {
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
		console.log(player.direction);
	}
	drawGame();
	requestAnimationFrame(playerMovement);
}

function movementAnimation() {
	let i = 1;
	let lastDirection = player.direction;
	function animateStep() {
		if (player.direction !== lastDirection) {
			i = 1;
			lastDirection = player.direction;
		}
		if (
			[
				"right",
				"left",
				"up",
				"down",
				"upRight",
				"upLeft",
				"downRight",
				"downLeft",
				"idle",
			].includes(player.direction) &&
			i < 11
		) {
			document.getElementById("output").textContent =
				`${player.direction} ${i}`;
			i++;
			setTimeout(animateStep, 100);
		} else {
			i = 1;
			setTimeout(animateStep, 0);
		}
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
}

function createProjectile() {
	if (player.lastshot <= 0) {
		if (mouse.down) {
			playerProjectiles.push({
				x: player.x + 86,
				y: player.y + 80,
				angle: Math.atan2(
					mouse.y - (player.y + 80),
					mouse.x - (player.x + 86),
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

drawGame();
movementAnimation();
requestAnimationFrame(playerMovement);
requestAnimationFrame(createProjectile);
requestAnimationFrame(moveProjectiles);
