import {Entity} from '../entity.mjs'
import * as KEYBOARD from '../keyboard/keyboard.mjs'

window.KEYBOARD = KEYBOARD

export class Player extends Entity{
	constructor(url='res/player.png', x=0, y=0){
		super(url, x, y);
	}
	get sprite(){
		// gibt den gerade spielenden Sprite wieder
		return this.spritesheet
	}
	keyboard() {
		if( KEYBOARD.pressed('ArrowRight') )
			this.vx = 1;
		else if( KEYBOARD.pressed('ArrowLeft') )
			this.vx = -1;
		else
			this.vx = 0;
		if( KEYBOARD.pressed('ArrowUp') )
			this.vy = -1;
		else if( KEYBOARD.pressed('ArrowDown') )
			this.vy = 1;
		else
			this.vy = 0;
	}
}
