//initialize canvas and context
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
canvas.width=1024;
canvas.height=576;
c.fillRect(0,0,canvas.width,canvas.height);

 //set gravity
const gravity = 0.7;

//initialize background

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})
//initialize player
const player = new Fighter({
    position:{
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    color:"red",
    offset:{
        x:0,
        y:0
    }
});

//initialize enemy
const enemy = new Fighter({
    position:{
        x: 400,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    color:"blue",
    offset:{
        x:-50,
        y:0
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
    background.update();
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
    // collisions
    if (rectangularCollision({rectangle1:player, rectangle2:enemy})
        && player.isAttacking)
        {
            console.log("you attack successfully");
            enemy.health -= 20;
            document.querySelector('#enemyHealth').style.width = enemy.health + '%';
            player.isAttacking=false;
        }
    if (rectangularCollision({rectangle1:enemy, rectangle2:player})
    && enemy.isAttacking)
    {
        console.log("enemy attacks successfully");
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
        enemy.isAttacking=false;
        
    }
    //end game based on hp
    if (enemy.health <=0 || player.health <=0){
        determineWinner({player, enemy, timerId})
    }
}


decreaseTimer()

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
        case 's':
            player.attack()
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
        case 'ArrowDown':
            enemy.attack();
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