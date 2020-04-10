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
		// x-Position of the Entity
		return this.position.x;
	}
	set x(nx) {
		// x-Position of the Entity
		this.position.x = nx;
	}
	get y() {
		// y-Position of the Entity
		return this.position.y;
	}
	set y(ny) {
		// y-Position of the Entity
		this.position.y = ny;
	}
	get vx() {
		// x-Velocity of the Entity
		return this.velocity.x;
	}
	set vx(nvx) {
		// x-Velocity of the Entity
		this.velocity.x = nvx;
	}
	get vy() {
		// x-Velocity of the Entity
		return this.velocity.y;
	}
	set vy(nvy) {
		// x-Velocity of the Entity
		this.velocity.y = nvy;
	}
	get width() {
		return this.sprite.width
	}
	get height() {
		return this.sprite.height
	}
	get loaded() {
		// Returns true, if the entity assets are loaded and is ready to be used
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
		// Prüfe nach Tastatureingaben
		this.keyboard()
		// Wende die Beschläunigung auf die Position an
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
	keyboard() {
		// führt Aktionen aus, je nachdem ob eine Taste gedrückt wurde
		// dies muss für jeden Entity einzeln festgelegt werden
	}
	collision() {
		// TODO
	}
}
