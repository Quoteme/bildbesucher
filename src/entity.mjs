export class Entity{
	constructor(URL='', x=0, y=0){
		this.position = {
			x : x,
			y : y,
		}
		this.velocity = {
			x : 0,
			y : 0,
		}
		this.spritesheet = new Image();
		this.spritesheet.src = URL;
		this.active = true; // true if this entity should be animated and checked for events
		this.time = 0; // time the object has been active
	}
	get x() {
		return this.position.x;
	}
	set x(nx) {
		this.position.x = nx;
	}
	get y() {
		return this.position.y;
	}
	set y(ny) {
		this.position.y = ny;
	}
	get width() {
		return this.sprite.width
	}
	get height() {
		return this.sprite.height
	}
	get loaded() {
		return this.spritesheet.complete;
	}
	get sprite() {
		// gibt den gerade spielenden Sprite wieder
		// dies muss für jeden Entity einzeln festgelegt werden
		console.warn('Kein benutzerdefinierter Sprite. Bitte erstelle eine eigene Spritefunktion!');
		return this.spritesheet
	}
	update() {
		// Erhöhe den Zeit-Counter
		this.time++;
		// Wende die Beschläunigung auf die Position an
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
