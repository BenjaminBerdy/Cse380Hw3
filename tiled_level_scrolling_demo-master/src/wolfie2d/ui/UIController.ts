/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {SceneGraph} from "../scene/SceneGraph"

export class UIController {
    private spriteToDrag : AnimatedSprite;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;
    private mouseX : number;
    private mouseY : number;

    public constructor(canvasId : string, initScene : SceneGraph) {
        this.spriteToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        document.addEventListener("keypress", this.keyPressHandler);
        this.mouseX = 0;
        this.mouseY = 0;
    }


    getMouseX(){
        return this.mouseX
    }

    getMouseY(){
        return this.mouseY
    }


    public keyPressHandler = (event : KeyboardEvent):void =>{
        if(event.keyCode === 119){
            this.changeView(0,-10);
        }
        else if(event.keyCode === 97){
            this.changeView(-10,0);
        }
        else if(event.keyCode === 115){
            this.changeView(0,10);
        }
        else if(event.keyCode === 100){
            this.changeView(10,0);
        }
    }

    public changeView(x:number,y:number){
        let world = this.scene.getTiledLayers();
        let worldWidth : number = world[0].getColumns() * world[0].getTileSet().getTileWidth();
        let worldHeight : number = world[0].getRows() * world[0].getTileSet().getTileHeight();
        if(this.scene.getViewport().getX() + x > worldWidth - this.scene.getViewport().getWidth()
        || this.scene.getViewport().getX() + x < 0
        || this.scene.getViewport().getY() + y > worldHeight - this.scene.getViewport().getHeight()
        || this.scene.getViewport().getY() + y < 0){
        ;
        }
        else{
            this.scene.getViewport().inc(x,y);
        }
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + sprite);
        if (sprite != null) {
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        /*if (this.spriteToDrag != null) {
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        }
        */
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        this.spriteToDrag = null;
    }
}