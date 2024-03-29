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

const shop = new Sprite({
    position:{
        x:610,
        y:128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax:6
})
//initialize player
const player = new Fighter({
    position:{
        x: 165,
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
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax:8,
    scale:2.5,
    offset: {
        x:215,
        y:155
    },
    sprites:{
        idle:{
            imageSrc:'./img/samuraiMack/Idle.png',
            framesMax:8
        },
        run:{
            imageSrc:'./img/samuraiMack/Run.png',
            framesMax:8
        },
        jump:{
            imageSrc:'./img/samuraiMack/Jump.png',
            framesMax:2
        },
        fall:{
            imageSrc:'./img/samuraiMack/Fall.png',
            framesMax:2
        },
        attack1:{
            imageSrc:'./img/samuraiMack/Attack11.png',
            framesMax:4
        },
        takeHit:{
            imageSrc:'./img/samuraiMack/Take Hit - white silhouette.png',
            framesMax:4
        },
        death:{
            imageSrc:'./img/samuraiMack/Death.png',
            framesMax:6
        }
    },
    attackBox:{
        offset:{
            x:100,
            y:50
        },
        width:150,
        height:50
    }
});

//initialize enemy
const enemy = new Fighter({
    position:{
        x: 800,
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
    },
    imageSrc:'./img/kenji/Idle.png',
    framesMax:4,
    scale:2.5,
    offset: {
        x:215,
        y:167
    },
    sprites:{
        idle:{
            imageSrc:'./img/kenji/Idle.png',
            framesMax:4
        },
        run:{
            imageSrc:'./img/kenji/Run.png',
            framesMax:8
        },
        jump:{
            imageSrc:'./img/kenji/Jump.png',
            framesMax:2
        },
        fall:{
            imageSrc:'./img/kenji/Fall.png',
            framesMax:2
        },
        attack1:{
            imageSrc:'./img/kenji/Attack1.png',
            framesMax:4
        },
        takeHit:{
            imageSrc:'./img/kenji/Take hit.png',
            framesMax:3
        },
        death:{
            imageSrc:'./img/kenji/Death.png',
            framesMax:7
        }
    },
    attackBox:{
        offset:{
            x:-170,
            y:50
        },
        width:170,
        height:50
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
    shop.update();
    c.fillStyle='rgba(255,255,255, 0.2)'
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();
    //reset velocity to 0 on each new frame
    player.velocity.x=0;
    enemy.velocity.x=0;
    //move in the direction of the last pressed key
    if (keys.a.pressed && player.lastKey==='a'&& inFrameLeft(player)){
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey==='d'&& inFrameRight(player)){
        player.velocity.x= 5;
        player.switchSprite('run');
    } else{
        player.switchSprite('idle');
    }

    if (player.velocity.y<0 ){
        player.switchSprite('jump');

    } else if (player.velocity.y>0){
        player.switchSprite('fall');
    }
    

    if (keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft' && inFrameLeft(enemy)){
        enemy.switchSprite('run');
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight' && inFrameRight(enemy)){
        enemy.switchSprite('run');
        enemy.velocity.x= 5;
    }else{
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y<0 ){
        enemy.switchSprite('jump');

    } else if (enemy.velocity.y>0){
        enemy.switchSprite('fall');
    }
    // collisions

    //player attacks
    if (rectangularCollision({rectangle1:player, rectangle2:enemy})
        && player.isAttacking && player.framesCurrent === 2)
        {
            console.log("you attack successfully");
            enemy.takeHit(10);

            gsap.to('#enemyHealth', {
                width:enemy.health + '%'
            })
            player.isAttacking=false;
        }

    //if player misses
    if (player.isAttacking && player.framesCurrent ===2){
        player.isAttacking=false;
    }

    //enemy attacks
    if (rectangularCollision({rectangle1:enemy, rectangle2:player})
    && enemy.isAttacking && enemy.framesCurrent === 2)
    {
        console.log("enemy attacks successfully");
        player.takeHit(10);
        gsap.to('#playerHealth', {
            width:player.health + '%'
        })
        enemy.isAttacking=false;
        
    }

    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent ===2){
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
    if (!player.dead){
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
                if (player.position.y+player.height===canvas.height-96){
                    player.velocity.y=-20;
                }
                break;
            case 's':
                player.attack()
                break;
        }
    }
    //move enemy
    if (!enemy.dead){
        switch(event.key){

        case 'ArrowRight':
            keys.ArrowRight.pressed=true;
            enemy.lastKey='ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true;
            enemy.lastKey='ArrowLeft';
            break;
        case 'ArrowUp':
            if (enemy.position.y+enemy.height===canvas.height-96){
                enemy.velocity.y=-20;
            }
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
        }
    
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