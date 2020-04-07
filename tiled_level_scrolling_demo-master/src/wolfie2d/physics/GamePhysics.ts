import {SceneGraph} from '../scene/SceneGraph'

export class GamePhysics {
    
    private deadcount = 0;
    constructor() {

    }

    update(sceneGraph : SceneGraph) : void {
        let animatedSprites = sceneGraph.getAnimatedSprites()
        for(let i = 0; i < animatedSprites.length; i++){
            if(animatedSprites[i].getTypeString() != "map"){
            if((sceneGraph.getMainCharacterX()+sceneGraph.getMainCharacterWidth() > animatedSprites[i].getPosition().getX()
            && sceneGraph.getMainCharacterX()+sceneGraph.getMainCharacterWidth() < 
            animatedSprites[i].getPosition().getX()+animatedSprites[i].getSpriteType().getSpriteWidth()
            &&sceneGraph.getMainCharacterY()+sceneGraph.getMainCharacterHeight() > animatedSprites[i].getPosition().getY()
            &&sceneGraph.getMainCharacterY()+sceneGraph.getMainCharacterHeight() < 
            animatedSprites[i].getPosition().getY()+animatedSprites[i].getSpriteType().getSpriteHeight())
            ||(sceneGraph.getMainCharacterX() > animatedSprites[i].getPosition().getX()
            && sceneGraph.getMainCharacterX() < 
            animatedSprites[i].getPosition().getX()+animatedSprites[i].getSpriteType().getSpriteWidth()
            &&sceneGraph.getMainCharacterY() > animatedSprites[i].getPosition().getY()
            &&sceneGraph.getMainCharacterY() < 
            animatedSprites[i].getPosition().getY()+animatedSprites[i].getSpriteType().getSpriteHeight()))
            {
                if(animatedSprites[i].getStatus() == "alive"){
                    if(animatedSprites[i].getTypeString() == "devil"){
                        animatedSprites[i].setStatus("dead");
                        this.deadcount++;
                        animatedSprites[i].setState("DYING");
                        setTimeout(function(){animatedSprites[i].setState("DEAD")}, 500);      
                    }
                    else if(animatedSprites[i].getTypeString() == "flower"){
                    animatedSprites[animatedSprites.length-1].setState("RUNNING");
                    }
                }

            }
        }
    }
    }

    public getDeadCount(){
        return this.deadcount;
    }

}