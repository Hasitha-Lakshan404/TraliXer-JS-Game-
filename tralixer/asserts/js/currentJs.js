/*=== Page Loading =====*/
$(window).on('load', function () {
    //canvas Setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1536;
    canvas.height = 686;

    let con;
    let playerX;
    let playerY;

    /*===== Track Specified user Inputs =====*/
    class InputHandler {
        constructor(game) {
            this.game = game;

            $(window).on('keydown', event => {
                if ((event.key === "ArrowUp" || event.key === "ArrowDown") && this.game.keys.indexOf(event.key) === -1) {
                    this.game.keys.push(event.key);
                } else if (event.key === " ") {
                    this.game.player.shootTop();
                    this.game.isPlayerShoot=!this.game.isPlayerShoot;

                    // console.log("Player X :",playerX," PlayerY : ",playerY);
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
            this.width = 190;
            this.height = 120;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.maxSpeed = 3;
            this.projectiles = [];

            this.count=0;

            this.image=document.getElementById("player");
            this.image2=document.getElementById("player2");
        }

        /*== for the player movement ==*/
        update() {
            this.count++;
            // console.log(this.count);
            if(this.count===3){
                this.count=1;
            }
            playerX=this.x;
            playerY=this.y;


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
            // context.fillStyle = 'black'
            // context.fillRect(this.x, this.y, this.width, this.height);

            con=context; //getting to the global

            if(this.count===1){
                context.drawImage(this.image,this.x,this.y,this.width,this.height);
            }else if(this.count===2){
                context.drawImage(this.image2,this.x,this.y,this.width,this.height);
            }

            if(this.game.isPlayerShoot){
                let img=document.getElementById("pShoot1")
                context.drawImage(img,this.x,this.y,this.width,this.height)
            }


            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });

        }

        shootTop() {
            if (this.game.ammo > 0) { //for the limit Ammo
                //at that time create new projectiles with given position.
                this.projectiles.push(new ProjectTitle(this.game, this.x + 136, this.y + 86));
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
        constructor(game,image,image2,speedModifier) {
            this.game=game;
            this.image=image;
            this.image2=image2;
            this.speedModifier=speedModifier;
            this.width=1768;
            this.height=1000;
            this.x=0;
            this.y=0;
            this.selector=1;
            this.count=0;
        }
        update(){
            // console.log("x : "+this.x +"     width : "+(-this.width)*2);

            if(this.count=== 1){

            }else if(this.count===2){

            }

            if(this.x <= -this.width*2){
                this.x=0; //if the image area is over. image 1 is start from before that white space display on screen
                // this.selector=2;
                // console.log("x : "+this.x +"     width : "+(-this.width)*2);
                this.selector++;
                // console.log(this.selector);
                if(this.selector===3){
                    this.selector=1;
                }
            }
            // else{
                this.x -=this.game.speed*this.speedModifier;
            // }
        }

        draw(context){
            if(this.selector===1){
                context.drawImage(this.image,this.x,this.y);
                context.drawImage(this.image,this.x+this.width,this.y); //create new Image ane position it behind the image 1(end point)
                context.drawImage(this.image,this.x+this.width*2,this.y); //create new Image ane position it behind the image 1(end point)
                // this.selector=2;
            }else {
                context.drawImage(this.image2,this.x,this.y);
                // this.image2.css('transform','scaleX(-1)');
                context.drawImage(this.image2,this.x+this.width,this.y);
                // $().css()
                context.drawImage(this.image2,this.x+this.width*2,this.y);
                // this.selector=1;
            }
        }

    }

    /*===== Handle All 'Layer Object' together to animate entire game =====*/
    class Background {
        constructor(game) {
            this.game=game;
            // this.image1=document.getElementById('layer1');
            // this.image2=document.getElementById('layer2');
            // this.image3=document.getElementById('layer3');
            // this.image4=document.getElementById('layer4');

            this.image5=document.getElementById('layer5');
            this.image6=document.getElementById('layer6');

            // this.layer1=new Layer(this.game,this.image1,1);
            // this.layer2=new Layer(this.game,this.image2,1);
            // this.layer3=new Layer(this.game,this.image3,1);
            // this.layer4=new Layer(this.game,this.image4,1);

            this.layer5=new Layer(this.game,this.image5,this.image6,3);
            this.layer6=new Layer(this.game,this.image6,this.image6,3);


            // this.layers=[this.layer1,this.layer2,this.layer3,this.layer4];
            this.layers=[this.layer5];
        }

        update(){
            this.layers.forEach(layer=>{
                layer.update();
            })
        }
        draw(context){
            this.layers.forEach(layer=>{
                layer.draw(context);
            })
        }

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

            //Timer
            const formattedTime=(this.game.gameTime*0.001).toFixed(1); //first no=*0.001 / second No -> .toFixed
            context.fillText('Timer: '+formattedTime,20,100);

            //game Over Msg
            if(this.game.gameOver){
                context.textAlign='center';
                let msg1;
                let msg2;
                if(this.game.score>this.game.winningScore){
                    msg1='you win';
                    msg2='well done !'
                }else{
                    msg1='You Lose !';
                    msg2='Try again next Time !'
                }

                context.font='100px Ubuntu';
                context.fillText(msg1,this.game.width*0.5,this.game.height*0.4);

                context.font='50px '+this.fontFamily;
                context.fillText(msg2,this.game.width*0.5,this.game.height*0.55);
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

            this.gameTime=0;
            this.timelimit=5000;
            this.speed=1;

            this.background=new Background(this);

            this.isPlayerShoot=true;
        }

        update(deltaTime) {

            if(!this.gameOver){
                this.gameTime+=deltaTime;
            }
            if(this.gameTime>this.timelimit)this.gameOver=true;

            this.player.update();

            this.background.update();


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
                            if(!this.gameOver)this.score+=enemy.score;

                            if(this.score>this.winningScore)this.gameOver=true; //when the game over
                        }
                    }

                })
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) { //when the game over stop added enemy
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

        }

        draw(context) { //to select which canvas

            //draw the queue

            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context); //ui draw

            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }

        addEnemy() {
            this.enemies.push(new Angler1(this));
            // console.log(this.enemies);
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