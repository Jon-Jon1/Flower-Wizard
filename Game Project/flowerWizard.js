const mainDisplay = document.getElementById("gameCanvas");
const gameSize = gameCanvas.getBoundingClientRect();
const gameCtx = gameCanvas.getContext("2d");

let player = {
	health: 100,
	x: 100,
	y: 100,
	dead: false,
	speed: 5,
	movement: "idle",
}
let enemies=[]
let keys=[]
document.addEventListener("keydown", (e) => {
	keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
	keys[e.key.toLowerCase()] = false;
	player.movement="idle"
});

const flowerImg = new Image();
flowerImg.src = "sprites/flowerT.png";

function drawGame(){
		gameCtx.clearRect(-5, -5, gameCanvas.width + 10, gameCanvas.height + 10);
        gameCtx.drawImage(flowerImg, player.x, player.y); 
}

function playerMovement() {
	if(player.dead == false){
	if (keys["w"]&& !keys["d"]&& !keys["a"]) {
		player.y -= player.speed;
		player.movement = "up"
	}
	if (keys["a"]&& !keys["s"]&& !keys["w"]) {
		player.x -= player.speed;
		player.movement = "left"
	}
	if (keys["s"]&& !keys["d"]&& !keys["a"]) {
		player.y += player.speed;
		player.movement = "down"
	}
	if (keys["d"]&& !keys["w"]&& !keys["s"]) {
		player.x += player.speed;
		player.movement = "right"
	}
	if (keys["w"]&&keys["d"]) {
		player.x += player.speed/3*2.5;
		player.y -= player.speed/3*2.5
		player.movement = "upRight"
	}
	if (keys["a"]&&keys["w"]) {
		player.x -= player.speed/3*2.5;
		player.y -= player.speed/3*2.5
		player.movement = "upLeft"
	}
	if (keys["s"]&&keys["a"]) {
		player.x -= player.speed/3*2.5;
		player.y += player.speed/3*2.5
		player.movement = "downLeft"
	}
	if (keys["d"]&&keys["s"]) {
		player.x += player.speed/3*2.5;
		player.y += player.speed/3*2.5;
		player.movement = "downRight"
	}
	console.log(player.movement)
	}
	drawGame();
	requestAnimationFrame(playerMovement);
}
function spawnEnemies(){
		enemies[1]={
			health: 50,
			get x() {
    		return Math.floor(Math.random()*600 + 200);
  			}		
	}
	console.log(enemies)
}
drawGame()
requestAnimationFrame(playerMovement)
spawnEnemies()