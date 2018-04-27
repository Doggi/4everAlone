var groundY = 0;
var maxZombie = 100;
var maxZombiesAtGround = 5;
var houseLife = 500;
var end = false;

var player = {
    x: 300,
    y: 150,
    height: 150,
    width: 50,
    speedDown: 20,
    speedUp: 300,
    speedAutoDown: 2
};

var zombie = function() {
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 50;
    this.life = 100;
};

var zombies = [];
var shoot = [];

function setup() {
    groundY = windowHeight - 50;
    createCanvas(windowWidth, windowHeight);
    background(51);
}

function draw() {
    if (!end) {
        background(51);

        var distanceToGround = groundY - (groundY - player.y + player.height);

        if (keyIsPressed === true) {
            switch (key) {
                case "d":
                    if (player.x + player.width <= windowWidth) {
                        player.x = player.x + 10;
                    }
                    break;
                case "a":
                    if (player.x >= 10) {
                        player.x = player.x - 10;
                    }
                    break;
                case "w":
                    if (distanceToGround <= 0) {
                        player.y = player.y + player.speedUp;
                    }
                    break;
                case "s":
                    if ((groundY - player.y + player.height) < groundY) {
                        if (distanceToGround > player.speedDown) {
                            player.y = player.y - player.speedDown;
                        } else {
                            player.y = player.y - distanceToGround;
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        if ((groundY - player.y + player.height) < groundY) {
            player.y = player.y - player.speedAutoDown;
        }

        zombies.forEach(z => { z.x = z.x - 2; });
        shoot.forEach(s => {
            s.y = (s.x - s.startX) * tan(asin(s.sinAlpha)) * s.dir;

            s.distance = s.distance + s.speed * s.dir;
            s.x = sqrt(pow(s.distance, 2) - pow(s.sinAlpha * s.distance, 2));
        });
        
                if (random(200) > 180 && zombies.length <= maxZombiesAtGround && maxZombie > 0) {
                    zombies.push(createZombie());
                    maxZombie = maxZombie - 1;
                }
        
        zombies = zombies.filter(zombie => zombie.x > 0);
        zombies = zombies.filter(zombie => zombie.life > 0);
        //shoot = shoot.filter(s => (s.x > 0 && s.x < windowWidth && s.y > 0 && s.y < windowHeight));

        zombies.forEach(zombie => {
            shoot.forEach(shot => {
                if (shot.x > zombie.x && shot.x < zombie.x + zombie.width) {
                    zombie.life = zombie.life - 5;
                }
            });

            if (zombie.x == 200) {
                houseLife = houseLife - 250;
            }
        });

        if (maxZombie == 0 && zombies.length == 0) {
            //gewonnen
            textSize(40);
            stroke("white");
            fill("white");
            text("Gewonnen", windowWidth / 2, windowHeight / 2);
            end = true;
        }

        if (houseLife <= 0) {
            //verloren
            textSize(40);
            stroke("white");
            fill("white");
            text("Verloren", windowWidth / 2, windowHeight / 2);
            end = true;
        }

    }

    // ground
    stroke("#800000");
    line(0, groundY, windowWidth, groundY);
    drawHouse();
    drawPlayer(player.x, player.y, player.height, player.width, "white");
    drawCrosshair(40, 40);
    drawHelpLineCrosshair();
    drawZombies();
    drawShoot();
    drawHub();
}

function mousePressed() {
    if (mouseButton === LEFT) {
        //console.log(mouseX, mouseY);
        var d = 0;
        if (mouseX - player.x > 0) {
            d = +1;
        } else {
            d = -1;
        }

        var a = mouseY - (groundY - player.y + player.height / 2);
        var b = mouseX - player.x;
        var c = sqrt(a * a + b * b);

        var sinAlpha = a / c;

        shoot.push({
            startX: player.x,
            startY: groundY - player.y + player.height / 2,
            x: player.x,
            y: groundY - player.y + player.height / 2,
            speed: 30,
            length: 5,
            dir: d,
            distance: 0,
            sinAlpha: sinAlpha
        });
    }
}

function drawZombies() {
    zombies.forEach(zombie => {
        drawPlayer(zombie.x, zombie.y, zombie.height, zombie.width, "green");
        stroke("white");
        fill("white");
        textSize(12);
        text('Zombie', zombie.x, groundY - zombie.height);
        text(zombie.life, zombie.x, groundY - zombie.height / 2);
    });
}

function drawHouse() {
    fill("white");
    rect(50, windowHeight - 250, 200, 200);
    triangle(50, windowHeight - 250, 150, windowHeight - 400, 250, windowHeight - 250);
    textSize(20);
    stroke("black");
    fill("black");
    text(houseLife, 150, windowHeight - 200);
}

function drawPlayer(x, y, height, width, color) {
    fill(color);
    stroke(color);
    rect(x, windowHeight - y, width, height - 50);
    ellipse(x + 25, windowHeight - y - 20, height - 100, height - 100);
}

function drawCrosshair(width, height) {
    stroke("green");
    line(mouseX - width / 2, mouseY, mouseX + width / 2, mouseY);
    line(mouseX, mouseY - height / 2, mouseX, mouseY + height / 2);
}

function drawHelpLineCrosshair() {
    line(player.x, groundY - player.y + player.height / 2, mouseX, mouseY);
}

function createZombie() {
    var z = new zombie();
    z.x = windowWidth - 100;
    z.y = 150;
    z.height = 150;
    z.width = 50;

    return z;
}

function drawShoot() {
    shoot.forEach(shot => {
        //console.log(shot.x + shot.startX, shot.y + y);
        console.log(shot.x, shot.y);
        ellipse(shot.x + shot.startX, shot.y + shot.startY, 10, 10);
    });
}

function drawHub() {
    textSize(20);
    stroke("white");
    fill("white");
    text("Zombies left: " + maxZombie, windowWidth - 200, 100);
}