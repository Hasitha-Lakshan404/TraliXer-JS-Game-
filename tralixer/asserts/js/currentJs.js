/*=== Page Loading =====*/
$(window).on('load', function () {
    //canvas Setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1600;
    canvas.height = 785;

    /*===== Track Specified user Inputs =====*/
    class InputHandler {
        constructor(game) {
            this.game = game;
            $(window).on('keydown', event => {
                if ((event.key === "ArrowUp" || event.key === "ArrowDown") && this.game.keys.indexOf(event.key) === -1) {
                    this.game.keys.push(event.key);
                } else if (event.key === " ") {
                    this.game.player.shootTop();
                }
                // console.log(this.game.keys);
            });

            $(window).on('keyup', event => {
                if (this.game.keys.indexOf(event.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(event.key, 1));
                }
                // console.log(this.game.keys);
            });

        }

    }

    /*===== Handle Player Lasers =====*/
    class ProjectTitle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;

        }

        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }

        draw(context) {
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }

    }

    /*===== Handle Falling Things that come from damaged enemies =====*/
    class Particle {

    }

    /*===== Control main Character /player Sprites =====*/
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.maxSpeed = 3;
            this.projectiles = [];
        }

        /*== for the player movement ==*/
        update() {
            if (this.game.keys.includes("ArrowUp")) {
                this.speedY = -this.maxSpeed;

            } else if (this.game.keys.includes("ArrowDown")) {
                this.speedY = this.maxSpeed;
            } else {
                this.speedY = 0;
            }
            this.y += this.speedY;

            //handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });

            //filter => get new Array and copy data and re
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }

        /*== for the draw graphics ==*/
        draw(context) { //context -> which canvas element  we want to draw
            context.fillStyle = 'black'
            context.fillRect(this.x, this.y, this.width, this.height);

            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });

        }

        shootTop() {
            if (this.game.ammo > 0) { //for the limit Ammo
                //at that time create new projectiles with given position.
                this.projectiles.push(new ProjectTitle(this.game, this.x + 80, this.y + 50));
                this.game.ammo--;
                // console.log(this.projectiles);
            }

        }


    }

    /*===== Handling Enemy types =====*/
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width; //catch the right edge if game area
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;

            this.lives=5;
            this.score=this.lives;

        }

        update() {
            this.x += this.speedX;
            if (this.x + this.width < 0) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            context.fillStyle = 'red';
            // context.fillRect(this.x,this.y,this.width,this.height);
            context.fillRect(this.x, this.y, 228 * 0.2, 169 * 0.2);

            context.fillStyle="black";
            context.font='20px Roboto'
            context.fillText(this.lives,this.x,this.y);

        }

    }

    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.heigth = 169;
            this.y = Math.random() * (this.game.height * 0.9 - this.heigth);
            //random -> 0 or more , *0.9 -> 90% from game height(top) , -this.height-> subtract img height cuz img wants to go up
        }
    }


    /*===== Handle individual Background Layers =====*/
    class Layer {

    }

    /*===== Handle All 'Layer Object' together to animate entire game =====*/
    class Background {

    }

    /*===== Draw Score timer ane other Display Information =====*/
    class Ui {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'White';
        }

        draw(context) {
            //Score
            context.save();
            context.fillStyle=this.color;
            context.shadowOffsetX=2;
            context.shadowOffsetY=2;
            context.shadowColor='black'
            context.font=this.fontSize+'px'+this.fontFamily;
            context.fillText("Score: "+this.game.score,20,40);

            //Ammo
            context.fillStyle = this.color;
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
                // console.log(i);
            }
            context.restore();
        }
    }

    /*===== All Game Logic =====*/
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this); //Create new Player Object and parse 'game' object to it
            this.input = new InputHandler(this);
            this.keys = []; //for the information what key are currently pressed

            this.maxAmmo = 50;
            this.ammo = 20;
            this.ammoTimer = 0;
            this.ammoInterval = 500;

            this.ui = new Ui(this);

            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;

            this.score=0;
            this.winningScore=10;
        }

        update(deltaTime) {
            this.player.update();

            //for the refile Ammo
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }

            //for the Enemy
            this.enemies.forEach(enemy => {
                enemy.update();
                if(this.checkCollision(this.player,enemy)){
                    enemy.markedForDeletion=true;
                    // console.log("Came")
                }

                this.player.projectiles.forEach(projectile=>{
                    if(this.checkCollision(projectile,enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion=true; //for the delete bullet

                        if(enemy.lives <=0){
                            enemy.markedForDeletion=true;
                            this.score+=enemy.score;

                            if(this.score>this.winningScore)this.gameOver=true;
                        }
                    }

                })
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

        }

        draw(context) { //to select which canvas
            this.player.draw(context);
            this.ui.draw(context); //ui draw

            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }

        addEnemy() {
            this.enemies.push(new Angler1(this));
            console.log(this.enemies);
        }

        checkCollision(rect1, rect2) {
            // return true -> collide
            //if horizontal(-) X position of rectangle 1 < horizontal position of rectangle 2 + its width (player left and enemy right side)
            //horizontal position of rectangle 1 + the width of rectangle 1 > horizontal position of rectangle 2 (player right side and enemy left side)
            //vertical(|) position of rectangle 1 < vertical position of rec2 +height of rect 2  (player top and enemy bottom)
            //height of rec 1 + its y position > vertical y position of rec 2 (player bottom and enemy top)

            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + 10 &&
                rect1.height + rect1.y > rect2.y

            /*rect1.x < rect2.x + rect2.width
            && rect1.x + rect1.width > rect2.x
            && rect1.y < rect2.y + rect2.height
            && rect1.height + rect1.y > rect2.y*/
            )

        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    //animation loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        // console.log(deltaTime)   //1000MS(1S)/8.3 = 120fps
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx); //wants to create this canvas
        requestAnimationFrame(animate); //RqAnimFrame -> adjust user Screen refreshRate , auto generate timeStamp argument/value
    }

    animate(0);


});