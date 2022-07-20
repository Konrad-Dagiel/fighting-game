//initialize canvas and context
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
canvas.width=1024;
canvas.height=576;
c.fillRect(0,0,canvas.width,canvas.height);

 //set gravity
const gravity = 0.7;

//define Sprite class
class Sprite{
    //constructor takes one object which contains a position obj and velocity var
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.lastKey;
    }
    //draw the Sprite
    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }
    //move the Sprite
    update(){
        this.draw()
        this.position.x += this.velocity.x;
        
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y=0;
        }
        else this.velocity.y += gravity;
    }
}
//initialize player
const player = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    }
});

//initialize enemy
const enemy = new Sprite({
    position:{
        x: 400,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    }
});
//object containing wether keys are pressed or not
const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    }
}

//main loop
function animate(){
    //loop
    window.requestAnimationFrame(animate);
    //refresh frame
    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width,canvas.height);
    //move sprites
    player.update();
    enemy.update();
    //reset velocity to 0 on each new frame
    player.velocity.x=0;
    enemy.velocity.x=0;
    //move in the direction of the last pressed key
    if (keys.a.pressed && player.lastKey==='a'){
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey==='d'){
        player.velocity.x= 5;
    }

    if (keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight'){
        enemy.velocity.x= 5;
    }
}

animate();
//event listeners
window.addEventListener('keydown', (event) => {
    switch(event.key){
        //move player
        case 'd':
            keys.d.pressed=true;
            player.lastKey='d';
            break;
        case 'a':
            keys.a.pressed=true;
            player.lastKey='a';
            break;
        case 'w':
            player.velocity.y=-20;
            break;
        //move enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed=true;
            enemy.lastKey='ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true;
            enemy.lastKey='ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y=-20;
            break;
        
    }
});
//stop moving player and enemy
window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed=false;
            break;
        case 'a':
            keys.a.pressed=false;
            break;



        case 'ArrowRight':
            keys.ArrowRight.pressed=false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false;
            break;


    }
});