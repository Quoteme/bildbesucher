import {Entity} from '../entity.mjs'
import * as CUTIMG from '../cutImg/cutImg.mjs'
import * as KEYBOARD from '../keyboard/keyboard.mjs'

window.KEYBOARD = KEYBOARD
window.CUTIMG = CUTIMG

export class Player extends Entity{
	constructor(url='res/player.png', x=0, y=0){
		super(url, x, y);
	}
	get sprite(){
		// gibt den gerade spielenden Sprite wieder
		switch(this.state){
			case 'idle':
				return this.spriteatlas.idle[Math.floor(this.time/17%3)]
			case 'walkRight':
				return this.spriteatlas.walkRight[Math.floor(this.time/11.5%6)]
			case 'walkLeft':
				return this.spriteatlas.walkLeft[Math.floor(this.time/11.5%6)]
			default:
				return this.spritesheet
		}
	}
	async computeSpriteatlas() {
		this.spriteatlas = {
			idle: [
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 7, 5, 17, 45)),
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 38, 5, 17, 45)),
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 66, 4, 17, 46)),
			],
			walkRight: [
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 0, 61, 27, 46)),
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 29, 61, 24, 45)),
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 56, 57, 32, 49)),
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 91, 56, 20, 50)),
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 113, 60, 29, 45)),
				await CUTIMG.load(CUTIMG.cut(this.spritesheet, 142, 57, 28, 48)),
			],
			walkLeft: [
				await CUTIMG.load(CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 0, 61, 27, 46))),
				await CUTIMG.load(CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 29, 61, 24, 45))),
				await CUTIMG.load(CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 56, 57, 32, 49))),
				await CUTIMG.load(CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 91, 56, 20, 50))),
				await CUTIMG.load(CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 113, 60, 29, 45))),
				await CUTIMG.load(CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 142, 57, 28, 48))),
			]
		}
		console.log(this.spriteatlas)
	}
	keyboard() {
		if( KEYBOARD.pressed('ArrowRight') ){
			this.vx = 3;
			this.state = 'walkRight';
		}else if( KEYBOARD.pressed('ArrowLeft') ){
			this.vx = -3;
			this.state = 'walkLeft';
		}else{
			this.state = 'idle';
		}
		if( KEYBOARD.pressed('ArrowUp') )
			if( this.collides )
				this.vy = -4;
			else
				this.vy -= 0.15;
		else if( KEYBOARD.pressed('ArrowDown') )
			this.vy = 3;
	}
}
