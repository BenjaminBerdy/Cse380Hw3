import { AnimatedSprite } from './sprite/AnimatedSprite'
import { SceneGraph } from './SceneGraph';
import {Game} from '../Game'

export class BugAI {
    private game : Game
    private sprite:AnimatedSprite;
    private radians:Array<number>;
    private scaleX:Array<number>;
    private scaleY:Array<number>;
    private rotationValue:number
    private type:string
    constructor(sprite:AnimatedSprite,game:Game, type:string){
        this.sprite = sprite
        this.type = type
        this.radians = [0, 0.785398, 1.5708, 2.35619, 3.14159, 3.92699, 4.71239,5.49779];
        this.scaleX = [1,1.3,1.7,1.3,1,1.3,1.7,1.3]
        this.scaleY = [1,.6,.6,.6,1,.6,.6,.6]
        if(this.type == "devil" || this.type == "flower"){
            this.rotate("devil");
        }
        this.game = game;
    }
    

    updateAI(scene:SceneGraph){
        if(this.sprite.getTypeString() != "map"){
        if(this.sprite.getStatus() != "dead"){
            if(this.type === "weedle"){
                if(this.sprite.getState() == "WALKING"){
                    this.moveWeedle(scene);
                }else{
                    this.weedleRun(scene);
                }
            }
            else if(this.type === "flower"){
                if(Math.sqrt(Math.pow(((scene.getMainCharacterX()+(scene.getMainCharacterX()+scene.getMainCharacterWidth()))/2)
                -((this.sprite.getPosition().getX()+(this.sprite.getPosition().getX()+this.sprite.getSpriteType().getSpriteWidth()))/2),2)
                + Math.pow(((scene.getMainCharacterY()+(scene.getMainCharacterY()+scene.getMainCharacterHeight()))/2)
                -((this.sprite.getPosition().getY()+(this.sprite.getPosition().getY()+this.sprite.getSpriteType().getSpriteHeight()))/2),2)
                ) < 200){
                    this.run(scene);
                }else{
                    let rand = Math.floor(Math.random()*100);
                    if(rand == 0){
                        this.rotate(this.type);
                    }else{
                        this.walk(scene);
                    }
                }
            }
            else if(this.type === "devil"){
                let rand = Math.floor(Math.random()*100);
                if(rand == 0){
                    this.rotate(this.type);
                }else{
                    this.walk(scene);
                }        
            }
        }
    }
    }

    walk(scene:SceneGraph){
       let rotation = Math.floor(this.sprite.getRotation().getThetaZ()*10); 
       if(rotation == 0){
            this.sprite.getPosition().set(this.sprite.getPosition().getX(),this.sprite.getPosition().getY()-1,0,1);
       }else if(rotation == 7){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()-1,this.sprite.getPosition().getY()-1,0,1);
       }else if(rotation == 15){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()-1,this.sprite.getPosition().getY(),0,1);
       }else if(rotation == 23){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()-1,this.sprite.getPosition().getY()+1,0,1);
       }else if(rotation == 31){
            this.sprite.getPosition().set(this.sprite.getPosition().getX(),this.sprite.getPosition().getY()+1,0,1);
       }else if(rotation == 39){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()+1, this.sprite.getPosition().getY()+1,0,1);
       }else if(rotation == 47){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()+1, this.sprite.getPosition().getY(),0,1);
       }else if(rotation == 54){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()+1,this.sprite.getPosition().getY()-1,0,1);
       }
       this.checkBounds(scene);
    }

    checkBounds(scene:SceneGraph){
        let world = scene.getTiledLayers();
        let worldWidth : number = world[0].getColumns() * world[0].getTileSet().getTileWidth();
        let worldHeight : number = world[0].getRows() * world[0].getTileSet().getTileHeight();
        if (this.sprite.getPosition().getX() < 0){
            this.sprite.getPosition().setX(this.sprite.getPosition().getX()+1);
            this.sprite.getRotation().setThetaZ(this.radians[6]);
            if(this.sprite.getStatus() == "flee"){
                this.sprite.setState("WALKING");
                this.sprite.setStatus("alive")
            }
        }
        else if(this.sprite.getPosition().getX() >= worldWidth-20){
            this.sprite.getPosition().setX(this.sprite.getPosition().getX()-1);
            this.sprite.getRotation().setThetaZ(this.radians[2]);
            if(this.sprite.getStatus() == "flee"){
                this.sprite.setState("WALKING");
                this.sprite.setStatus("alive")
            }
        }
        if(this.sprite.getPosition().getY() < 0){
            this.sprite.getPosition().setY(this.sprite.getPosition().getY()+1);
            this.sprite.getRotation().setThetaZ(this.radians[4]);
            if(this.sprite.getStatus() == "flee"){
                this.sprite.setState("WALKING");
                this.sprite.setStatus("alive")
            }
        }else if(this.sprite.getPosition().getY() >= worldHeight-20){
            this.sprite.getPosition().setY(this.sprite.getPosition().getY()-1);
            this.sprite.getRotation().setThetaZ(this.radians[0]);
            if(this.sprite.getStatus() == "flee"){
                this.sprite.setState("WALKING");
                this.sprite.setStatus("alive")
            }
        }
    }

    run(scene:SceneGraph){
        let spriteX = this.sprite.getPosition().getX();
        let spriteY = this.sprite.getPosition().getY();
        let weedleX = scene.getMainCharacterX();
        let weedleY = scene.getMainCharacterY();
        if(spriteX > weedleX && spriteY > weedleY){
            this.sprite.getRotation().setThetaZ(this.radians[5]);
            this.sprite.getPosition().set(spriteX+2,spriteY+2,0,1);

        }
        else if(spriteX > weedleX && spriteY <= weedleY){
            this.sprite.getRotation().setThetaZ(this.radians[7]);
            this.sprite.getPosition().set(spriteX+2,spriteY-2,0,1);
        }
        else if(spriteX <= weedleX && spriteY > weedleY){
            this.sprite.getRotation().setThetaZ(this.radians[3]);
            this.sprite.getPosition().set(spriteX-2,spriteY+2,0,1);
        }
        else if(spriteX <= weedleX && spriteY <= weedleY){
            this.sprite.getRotation().setThetaZ(this.radians[1]);
            this.sprite.getPosition().set(spriteX-2,spriteY-2,0,1);
        }
        this.sprite.getScale().set(1.3,.6,1,1);
        this.checkBounds(scene);
    }

    rotate(type:string){
        if(type == "flower"){
            if(this.rotationValue < 4){
                this.rotationValue = this.rotationValue+4;
            }else{
                this.rotationValue = this.rotationValue-4;
            }
        }else if(type == "devil"){
        this.rotationValue = Math.floor(Math.random()*8)
        }    
        this.sprite.getRotation().setThetaZ(this.radians[this.rotationValue]);
        this.sprite.getScale().setX(this.scaleX[this.rotationValue]);
        this.sprite.getScale().setY(this.scaleY[this.rotationValue]);
    }

    moveWeedle(scene:SceneGraph){
        let mouseX = this.game.getUiController().getMouseX();
        let mouseY = this.game.getUiController().getMouseY();
        if(mouseX != undefined && mouseY != undefined){
            let angle = - Math.atan2(this.sprite.getLocalPosition().getY()+(this.sprite.getSpriteType().getSpriteHeight()/2) - mouseY
                ,this.sprite.getLocalPosition().getX()+(this.sprite.getSpriteType().getSpriteWidth()/2)-mouseX) - (3*Math.PI/2);
            this.sprite.getRotation().setThetaZ(angle);
            if((this.sprite.getRotation().getThetaZ() <= -6.5 && this.sprite.getRotation().getThetaZ() > -7)
            || (this.sprite.getRotation().getThetaZ() >= -6 && this.sprite.getRotation().getThetaZ() < -5)
            || (this.sprite.getRotation().getThetaZ() >= -2.8 && this.sprite.getRotation().getThetaZ() < -2)
            || (this.sprite.getRotation().getThetaZ() <= 3.5 && this.sprite.getRotation().getThetaZ() > -4)
            ){
                this.sprite.getScale().set(1.1,.8,0,1);
            }else if((this.sprite.getRotation().getThetaZ() <= -4 && this.sprite.getRotation().getThetaZ() >= -5)
            || (this.sprite.getRotation().getThetaZ() >= -2 || this.sprite.getRotation().getThetaZ() <= -7)
            ){   
                this.sprite.getScale().set(1.15,.7,0,1);
            }else{
                this.sprite.getScale().set(1,1,0,1);
            }

            if(mouseX > this.sprite.getLocalPosition().getX()+this.sprite.getSpriteType().getSpriteWidth()){
                this.sprite.getPosition().setX(this.sprite.getPosition().getX()+3);
            }
            else if(this.sprite.getLocalPosition().getX() > mouseX){
                this.sprite.getPosition().setX(this.sprite.getPosition().getX()-3);
            }
            if(mouseY > this.sprite.getLocalPosition().getY()+this.sprite.getSpriteType().getSpriteWidth()){
                this.sprite.getPosition().setY(this.sprite.getPosition().getY()+3);
            }
            else if(this.sprite.getLocalPosition().getY() > mouseY){
                this.sprite.getPosition().setY(this.sprite.getPosition().getY()-3);
            }
            scene.setMainCharacterX(this.sprite.getPosition().getX());
            scene.setMainCharacterY(this.sprite.getPosition().getY());
            scene.setMainCharacterWidth(this.sprite.getSpriteType().getSpriteWidth());
            scene.setMainCharacterHeight(this.sprite.getSpriteType().getSpriteHeight());
            scene.setMainCharacter(this.sprite);
        }
    }


    weedleRun(scene:SceneGraph){
        if(this.sprite.getRotation().getThetaZ() >= -Math.PI){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()+3,this.sprite.getPosition().getY()+3,0,1)
        }else if(this.sprite.getRotation().getThetaZ() < -Math.PI && this.sprite.getRotation().getThetaZ() > -(3*Math.PI/2)){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()-3,this.sprite.getPosition().getY()+3,0,1)
        }else if(this.sprite.getRotation().getThetaZ() <= -(3*Math.PI/2) && this.sprite.getRotation().getThetaZ() > -2*Math.PI){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()-3,this.sprite.getPosition().getY()-3,0,1)
        }else if(this.sprite.getRotation().getThetaZ() <= -2*Math.PI){
            this.sprite.getPosition().set(this.sprite.getPosition().getX()+3,this.sprite.getPosition().getY()-3,0,1)

        }
        this.checkBounds(scene);
        if(this.sprite.getStatus() != "flee"){
            if(this.sprite.getRotation().getThetaZ() >= -Math.PI){
                this.sprite.getRotation().setThetaZ(-7*Math.PI/4);
            }else if(this.sprite.getRotation().getThetaZ() < -Math.PI && this.sprite.getRotation().getThetaZ() > -(3*Math.PI/2)){
                this.sprite.getRotation().setThetaZ(-9*Math.PI/4);
            }else if(this.sprite.getRotation().getThetaZ() <= -(3*Math.PI/2) && this.sprite.getRotation().getThetaZ() > -2*Math.PI){
                this.sprite.getRotation().setThetaZ(-3*Math.PI/4);
            }else if(this.sprite.getRotation().getThetaZ() <= -2*Math.PI){
                this.sprite.getRotation().setThetaZ(-5*Math.PI/4);    
            }
            this.sprite.setStatus("flee");
        setTimeout(function(){scene.getMainCharacter().setState("WALKING"); scene.getMainCharacter().setStatus("alive");},2000);
        }
    }


}
    