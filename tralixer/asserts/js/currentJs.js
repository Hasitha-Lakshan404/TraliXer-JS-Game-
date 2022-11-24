/*=== Page Loading =====*/
$(window).on('load',function () {
    //canvas Setup
    const canvas=document.getElementById('canvas1');
    const ctx =canvas.getContext('2d');
    canvas.width=1600;
    canvas.height=785;

    /*===== Track Specified user Inputs =====*/
    class InputHandler{
        constructor(game) {
            this.game=game;
            $(window).on('keydown', event => {
                if((event.key==="ArrowUp"||event.key==="ArrowDown") && this.game.keys.indexOf(event.key)===-1){
                    this.game.keys.push(event.key);
                }else if(event.key===" "){
                    this.game.player.shootTop();
                }
                // console.log(this.game.keys);
            });

            $(window).on('keyup', event => {
                if(this.game.keys.indexOf(event.key)>-1){
                    this.game.keys.splice(this.game.keys.indexOf(event.key,1));
                }
                // console.log(this.game.keys);
            });

        }

    }

    /*===== Handle Player Lasers =====*/
    class ProjectTitle{
        constructor(game,x,y) {
            this.game=game;
            this.x=x;
            this.y=y;
            this.width=10;
            this.height=3;
            this.speed=3;
            this.markedForDeletion=false;

        }
        update(){
            this.x+=this.speed;
            if(this.x>this.game.width*0.8)this.markedForDeletion=true;
        }

        draw(context){
            context.fillStyle='yellow';
            context.fillRect(this.x,this.y,this.width,this.height);
        }

    }

    /*===== Handle Falling Things that come from damaged enemies =====*/
    class Particle{

    }

    /*===== Control main Character /player Sprites =====*/
    class Player{
        constructor(game) {
            this.game=game;
            this.width=120;
            this.height=190;
            this.x=20;
            this.y=100;
            this.speedY=0;
            this.maxSpeed=3;
            this.projectiles=[];
        }

        /*== for the player movement ==*/
        update(){
            if(this.game.keys.includes("ArrowUp")){
                this.speedY=-this.maxSpeed;

            }else if(this.game.keys.includes("ArrowDown")){
                this.speedY=this.maxSpeed;
            }else{
                this.speedY=0;
            }
            this.y+=this.speedY;

            //handle projectiles
            this.projectiles.forEach(projectile=>{
                projectile.update();
            });

            //filter => get new Array and copy data and re
            this.projectiles=this.projectiles.filter(projectile=>!projectile.markedForDeletion);
        }

        /*== for the draw graphics ==*/
        draw(context){ //context -> which canvas element  we want to draw
            context.fillStyle='black'
            context.fillRect(this.x,this.y,this.width,this.height);

            this.projectiles.forEach(projectile=>{
                projectile.draw(context);
            });

        }

        shootTop(){
            if(this.game.ammo>0){ //for the limit Ammo
                //at that time create new projectiles with given position.
                this.projectiles.push(new ProjectTitle(this.game,this.x+80,this.y+50));
                this.game.ammo--;
                // console.log(this.projectiles);
            }

        }


    }

    /*===== Handling Enemy types =====*/
    class Enemy{

    }

    /*===== Handle individual Background Layers =====*/
    class Layer{

    }

    /*===== Handle All 'Layer Object' together to animate entire game =====*/
    class Background{

    }

    /*===== Draw Score timer ane other Display Information =====*/
    class Ui{
        constructor(game) {
            this.game=game;
            this.fontSize=25;
            this.fontFamily='Helvetica';
            this.color='white';
        }
        draw(context){
            //Ammo
            context.fillStyle=this.color;
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20+5*i,50,3,20);
            }
        }

    }

    /*===== All Game Logic =====*/
    class Game{
        constructor(width,height) {
            this.width=width;
            this.height=height;
            this.player=new Player(this); //Create new Player Object and parse 'game' object to it
            this.input=new InputHandler(this);
            this.keys=[]; //for the information what key are currently pressed
            this.maxAmmo=50;
            this.ammo=20;
            this.ammoTimer=0;
            this.ammoInterval=500;

            this.ui=new Ui(this);
        }
        update(deltaTime){
            this.player.update();

            //for the refile Ammo
            if(this.ammoTimer>this.ammoInterval){
                if(this.ammo<this.maxAmmo)this.ammo++;
                this.ammoTimer=0;
            }else{
                this.ammoTimer+=deltaTime;
            }
        }

        draw(context){ //to select which canvas
            this.player.draw(context);
            this.ui.draw(context); //ui draw
        }
    }

    const game=new Game(canvas.width,canvas.height);
    let lastTime=0;

    //animation loop
    function animate(timeStamp){
        const deltaTime=timeStamp-lastTime;
        // console.log(deltaTime)   //1000MS(1S)/8.3 = 120fps
        lastTime=timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(deltaTime);
        game.draw(ctx); //wants to create this canvas
        requestAnimationFrame(animate); //RqAnimFrame -> adjust user Screen refreshRate , auto generate timeStamp argument/value
    }
    animate(0);


});