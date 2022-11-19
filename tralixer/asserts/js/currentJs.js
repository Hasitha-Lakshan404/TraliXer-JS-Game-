/*=== Page Loading =====*/
$(window).on('load',function () {
    //canvas Setup
    const canvas=document.getElementById('canvas1');
    const ctx =canvas.getContext('2d');
    canvas.width=500;
    canvas.height=500;

    /*===== Track Specified user Inputs =====*/
    class InputHandler{
        constructor(game) {
            this.game=game;
            $(window).on('keydown', event => {
                if((event.key==="ArrowUp"||event.key==="ArrowDown") && this.game.keys.indexOf(event.key)===-1){
                    this.game.keys.push(event.key);
                }
                console.log(this.game.keys);
            });

            $(window).on('keyup', event => {
                if(this.game.keys.indexOf(event.key)>-1){
                    this.game.keys.splice(this.game.keys.indexOf(event.key,1));
                }
                console.log(this.game.keys);
            });

        }

    }

    /*===== Handle Player Lasers =====*/
    class ProjectTitle{

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
        }

        /*== for the player movement ==*/
        update(){
            if(this.game.keys.includes("ArrowUp")){
                this.speedY=-1;

            }else if(this.game.keys.includes("ArrowDown")){
                this.speedY=1;
            }else{
                this.speedY=0;
            }
            this.y+=this.speedY;
        }

        /*== for the draw graphics ==*/
        draw(context){ //context -> which canvas element  we want to draw
            context.fillRect(this.x,this.y,this.width,this.height);
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

    }

    /*===== All Game Logic =====*/
    class Game{
        constructor(width,height) {
            this.width=width;
            this.height=height;
            this.player=new Player(this); //Create new Player Object and parse 'game' object to it
            this.input=new InputHandler(this);
            this.keys=[]; //for the information what key are currently pressed
        }
        update(){
            this.player.update();
        }

        draw(context){ //to select which canvas
            this.player.draw(context);
        }
    }

    const game=new Game(canvas.width,canvas.height);

    //animation loop
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update();
        game.draw(ctx); //wants to create this canvas
        requestAnimationFrame(animate); //RqAnimFrame -> adjust user Screen refreshRate , auto generate timeStamp argument
    }
    animate();


});