//define Sprite class
class Sprite{
    //constructor takes one object which contains a position and image source
    constructor({position, imageSrc}){
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image()
        this.image.src = imageSrc

    }
    //draw the Sprite
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    
    }

    //move the Sprite
    update(){
        this.draw()
    }

}

class Fighter{
    //constructor takes one object which contains a position obj and velocity var
    constructor({position, velocity, color, offset}){
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox= {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            offset,
            width:100,
            height:50
        }
        this.color = color;
        this.isAttacking = false;
        this.health=100;
    }
    //draw the Sprite
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        //attack box
        if (this.isAttacking===true){
            c.fillStyle='green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    //move the Sprite
    update(){
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height-96){
            this.velocity.y=0;
        }
        else this.velocity.y += gravity;
    }
    attack(){
        this.isAttacking=true;
        setTimeout(() =>{
            this.isAttacking = false
        },100)
    }
}