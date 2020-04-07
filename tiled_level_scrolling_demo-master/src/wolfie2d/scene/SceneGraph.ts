import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import {TiledLayer} from './tiles/TiledLayer'
import {TileSet} from './tiles/TileSet'
import {Viewport} from './Viewport';

export class SceneGraph {
    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<AnimatedSprite>;

    // WE ARE ALSO USING A TILING ENGINE FOR RENDERING OUR LEVEL
    // NOTE THAT WE MANAGE THIS HERE BECAUSE WE MAY INVOLVE THE TILED
    // LAYERS IN PHYSICS AND PATHFINDING AS WELL
    private tiledLayers : Array<TiledLayer>;
    private tileSets : Array<TileSet>;

    // THE VIEWPORT IS USED TO FILTER OUT WHAT IS NOT VISIBLE
    private viewport : Viewport;

    private mainCharacterX : number = 200;
    private mainCharacterY : number = 200;
    private mainCharacterWidth: number = 50;
    private mainCharacterHeight: number = 50;
    private mainCharacter:AnimatedSprite;
        

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.clear();
    }

    public clear() : void {
        this.animatedSprites = [];
        this.visibleSet = [];
        this.tiledLayers = [];
        this.tileSets = [];
    }

    public addTileSet(tileSetToAdd : TileSet) : number {
        return this.tileSets.push(tileSetToAdd) - 1;
    }

    public getNumTileSets() : number {
        return this.tileSets.length;
    }

    public getTileSet(index : number) : TileSet {
        return this.tileSets[index];
    }

    public addLayer(layerToAdd : TiledLayer) : void {
        this.tiledLayers.push(layerToAdd);
    }

    public getNumTiledLayers() : number {
        return this.tiledLayers.length;
    }

    public getTiledLayers() : Array<TiledLayer> {
        return this.tiledLayers;
    }

    public getTiledLayer(layerIndex : number) : TiledLayer {
        return this.tiledLayers[layerIndex];
    }

    public getNumSprites() : number {
        let k = 0;
        for(let i = 0; i < this.animatedSprites.length; i++){
            if(this.animatedSprites[i].getTypeString() != "map"){
                k++;
            }
        }
        return k;
    }

    public setViewport(initViewport : Viewport) : void {
        this.viewport = initViewport;
    }

    public getViewport() : Viewport { 
        return this.viewport;
    }

    public getVisibleSet() : Array<AnimatedSprite>{
        return this.visibleSet;
    }

    public getAnimatedSprites(){
        return this.animatedSprites;
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public getSpriteAt(testX : number, testY : number) : AnimatedSprite {
        for (let sprite of this.animatedSprites) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }
    
    setMainCharacterX(mainCharacterX:number){
        this.mainCharacterX = mainCharacterX;
    }
    setMainCharacterY(mainCharacterY:number){
        this.mainCharacterY = mainCharacterY;
    }

    getMainCharacterX(){
        return this.mainCharacterX;
    }
    getMainCharacterY(){
        return this.mainCharacterY;
    }

    setMainCharacterWidth(mainCharacterWidth:number){
        this.mainCharacterWidth = mainCharacterWidth;
    }
    setMainCharacterHeight(mainCharacterHeight:number){
        this.mainCharacterHeight = mainCharacterHeight;
    }

    getMainCharacterWidth(){
        return this.mainCharacterWidth;
    }
    getMainCharacterHeight(){
        return this.mainCharacterHeight;
    }

    getMainCharacter(){
        return this.mainCharacter;
    }

    setMainCharacter(mainCharacter:AnimatedSprite){
        this.mainCharacter = mainCharacter;
    }

    /**
     * update
     * 
     * Called once per frame, this function updates the state of all the objects
     * in the scene.
     * 
     * @param delta The time that has passed since the last time this update
     * funcation was called.
     */
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta, this);
        }
        for(let i = 0; i < this.getVisibleSet().length; i++){
            this.getVisibleSet()[i].getLocalPosition().set(
                this.getVisibleSet()[i].getPosition().getX()-this.getViewport().getX(),
                this.getVisibleSet()[i].getPosition().getY()-this.getViewport().getY(),
                0,1);
        }
    }

    public scope() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            if(sprite.getPosition().getX()+sprite.getSpriteType().getSpriteWidth() > this.viewport.getX() 
            && sprite.getPosition().getX() < this.viewport.getX()+this.viewport.getWidth()
            && sprite.getPosition().getY()+sprite.getSpriteType().getSpriteHeight() > this.viewport.getY()
            && sprite.getPosition().getY() < this.viewport.getY()+this.viewport.getHeight()){
            this.visibleSet.push(sprite);
            }
        }

        return this.visibleSet;
    }
}