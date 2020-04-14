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
		this.collision = undefined; // speichert alle orte, an denen die Entität momentan kollidiert
		this.ds = 1;
		this.dt = 6;
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
	get corners() {
		// Kanten der Entität
		return {
			topleft     : {
				x: this.x-this.width/2,
				y: this.y-this.height/2,
			},
			topright    : {
				x: this.x+this.width/2,
				y: this.y-this.height/2,
			},
			bottomright : {
				x: this.x+this.width/2,
				y: this.y+this.height/2,
			},
			bottomleft  : {
				x: this.x-this.width/2,
				y: this.y+this.height/2,
			},
		}
	}
	get collides() {
		// gibt an, ob die Entität mit irgendetwas kollidiert
		return Object.entries(this.collision).some(e =>
			e[0].includes('dx') || e[0].includes('dy') || e[1] )
	}
	get collidesTop() {
		return this.collision.topright || this.collision.topright
	}
	get collidesBottom() {
		return this.collision.bottomright || this.collision.bottomright
	}
	get collidesLeft() {
		return this.collision.bottomleft || this.collision.topleft
	}
	get collidesRight() {
		return this.collision.bottomright || this.collision.topright
	}
	get jumpingAgainstCeiling(){
		// true, wenn Entität nach oben steigt und mit dem
		// oberen Teil gegen etwas kollidiert
		return this.collidesTop && this.vy < 0
	}
	get fallingOnFloor() {
		// true, wenn Entiät fällt und mit dem unteren Teil
		// gegen etwas kollidiert
		return this.collidesBottom && this.vy > 0
	}
	get walkingIntoLeftWall() {
		// true, wenn Entität links gegen etwas läuft
		return this.collidesLeft && this.vx < 0
	}
	get walkingIntoRightWall() {
		// true, wenn Entität rechts gegen etwas läuft
		return this.collidesRight && this.vx > 0
	}
	get walkingUpLeftSlope() {
		// true, wenn Entität irgendwo nach rechts hochgehen möchte
		return this.collision.bottomleft && !this.collision.dxbottomleft && this.vx < 0
	}
	get walkingUpRightSlope() {
		// true, wenn Entität irgendwo nach links hochgehen möchte
		return this.collision.bottomright && !this.collision.dxbottomright && this.vx > 0
	}
	get fallingDownLeftSlope() {
		return this.collision.bottomleft && !this.collision.dybottomleft && this.vy > 0
	}
	get fallingDownRightSlope() {
		return this.collision.bottomright && !this.collision.dybottomright && this.vy > 0
	}
	get sprite() {
		// gibt den gerade spielenden Sprite wieder
		// dies muss für jeden Entity einzeln festgelegt werden
		console.warn('Kein benutzerdefinierter Sprite. Bitte erstelle eine eigene Spritefunktion!');
		return this.spritesheet
	}
	get loaded() {
		// Returns true, if the entity assets are loaded and is ready to be used
		return this.spritesheet.complete;
	}
	update(level) {
		// Erhöhe den Zeit-Counter
		this.time++;
		// Prüfe nach Tastatureingaben
		this.keyboard();
		if( level.loaded ){
			this.computeCollision(level);
			this.physics(level);
		}
	}
	keyboard() {
		// führt Aktionen aus, je nachdem ob eine Taste gedrückt wurde
		// dies muss für jeden Entity einzeln festgelegt werden
	}
	computeCollision(level, ds=this.ds, dt=this.dt) {
		// gibt ein Array zurück, ob an einer Kante die Entität
		// kollidiert
		//
		// dx/dy... (wobei ... ein Kantenname ist,
		// 		deutet auf einen kleinen schritt in x/y Richtung)
		// die dx/dy... kanten werden zusätzlich für jede kante zu jeder kante berechnet
		// ds ist dabei die Größe des "kleinen Schritts" in Pixeln
		// dt ist dabei die Änderung die dieser kleine Schritt hat
		let dxcorners = {
			dxtopleft     : {
				x: this.corners.topleft.x-ds, // ←
				y: this.corners.topleft.y+dt, // ↓
			},
			dxtopright    : {
				x: this.corners.topright.x+ds, // →
				y: this.corners.topright.y+dt, // ↓
			},
			dxbottomright : {
				x: this.corners.bottomright.x+ds, // →
				y: this.corners.bottomright.y-dt, // ↑
			},
			dxbottomleft  : {
				x: this.corners.bottomleft.x-ds, // ←
				y: this.corners.bottomleft.y-dt, // ↑
			},
		}
		let dycorners = {
			dytopleft     : {
				x: this.corners.topleft.x+dt, // →
				y: this.corners.topleft.y-ds, // ↑
			},
			dytopright    : {
				x: this.corners.topright.x-dt, // ←
				y: this.corners.topright.y-ds, // ↑
			},
			dybottomright : {
				x: this.corners.bottomright.x-dt, // ←
				y: this.corners.bottomright.y+ds, // ↓
			},
			dybottomleft  : {
				x: this.corners.bottomleft.x+dt, // →
				y: this.corners.bottomleft.y+ds, // ↓
			},
		}
		let positionsToCompute = {...this.corners, ...dxcorners, ...dycorners};
		this.collision = Object.fromEntries(Object.entries(positionsToCompute)
			.map(c => [
				c[0],
				level.checkCollision(c[1].x,c[1].y),
			])
		)
	}
	physics(level) {
		// Führt alles aus, was mit Physik zu tuen hat
		//
		// Wende Gravitation auf Entität an
		this.vx += level.gravity.x;
		this.vy += level.gravity.y;
		// Stillstand bei kollision
		if( this.collides ){
			console.log(this.fallingDownLeftSlope, this.fallingDownRightSlope)
			if( this.jumpingAgainstCeiling || this.fallingOnFloor )
				if( this.fallingDownLeftSlope || this.fallingDownRightSlope ){
					this.vx *= 1.05
					this.vy += 0.1
				}else
					this.vy = 0;
			if( this.walkingIntoLeftWall || this.walkingIntoRightWall )
				if( this.walkingUpLeftSlope || this.walkingUpRightSlope ){
					this.vy -= 1
					this.vx *= 0.8
				}else
					this.vx = 0
		}
		// Wende die Beschläunigung auf die Position an
		this.x += this.vx;
		this.y += this.vy;
	}
}
