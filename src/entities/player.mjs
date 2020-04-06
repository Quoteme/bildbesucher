import {Entity} from '../entity.mjs'

export class Player extends Entity{
	constructor(url='../../res/player.png', x=0, y=0){
		super(url, x, y);
	}
	get sprite(){
		// gibt den gerade spielenden Sprite wieder
		return this.spritesheet
	}
}
