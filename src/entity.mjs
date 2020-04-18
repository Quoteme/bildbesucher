/**
 * @module Entity
 * @version 0.1
 * @author Luca Leon Happel
 * @file Erlaubt es neue Entitäten zu erzeugen, welche bewegt werden
 * und kollidieren können
 */

/**
 * Klasse, welche eine Entität darstellt. Diese Entität kann sich
 * bewegen, hat einen [Sprite]{@link Entity#sprite} und kann
 * [kollidieren]{@link Entity#collides}
 */
export class Entity{
	/**
	 * Erstellt eine Entität
	 * @param {string} [URL=''] - URL zu dem Spritesheet der Entität
	 * @param {number} [x=0] - X-Position der Entität
	 * @param {number} [y=0] - Y-Position der Entität
	 */
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
		this.spriteatlas = undefined; // Speichert ein Object aus Arrays aus Sprites für jeden state
		this.state = 'idle'; // Stadium in dem sich die Entität befindet
		this.active = true; // true if this entity should be animated and checked for events
		this.time = 0; // time the object has been active
		this.collision = undefined; // speichert alle Orte, an denen die Entität momentan kollidiert
		this.ds = 1; // kleine Änderung der Distanz zu einer Kante der Entität
		this.dt = 14; // veränderung der Position bei einer Änderung der Distanz um ds
		this.effectivleyZero = 0.04; // Grenze, ab welchem Wert eine Zahl praktisch 0 ist
	}
	/**
	 * Gibt die X-Position der Entität an
	 * @return {number} X-Position
	 */
	get x() {
		return this.position.x;
	}
	/**
	 * Setzt die X-Position der Entität
	 */
	set x(nx) {
		this.position.x = nx;
	}
	/**
	 * Gibt die Y-Position der Entität an
	 * @return {number} Y-Position
	 */
	get y() {
		// y-Position of the Entity
		return this.position.y;
	}
	/**
	 * Setzt die Y-Position der Entität
	 */
	set y(ny) {
		// y-Position of the Entity
		this.position.y = ny;
	}
	/**
	 * gibt die X-Geschwindigkeit der Entität an
	 * @return {number} X-Geschwindigkeit
	 */
	get vx() {
		// Wenn die x-Velocity praktisch 0 ist, wird diese auf 0 gesetzt
		if( Math.abs(this.velocity.x) < this.effectivleyZero )
			this.velocity.x = 0;
		return this.velocity.x;
	}
	/**
	 * Setzt die X-Geschwindigkeit der Entität
	 */
	set vx(nvx) {
		this.velocity.x = nvx;
	}
	/**
	 * gibt die Y-Geschwindigkeit der Entität an
	 * @return {number} Y-Geschwindigkeit
	 */
	get vy() {
		// Wenn die y-Velocity praktisch 0 ist, wird diese auf 0 gesetzt
		if( Math.abs(this.velocity.y) < this.effectivleyZero )
			this.velocity.y = 0;
		return this.velocity.y;
	}
	/**
	 * Setzt die Y-Geschwindigkeit der Entität
	 */
	set vy(nvy) {
		// y-Velocity of the Entity
		this.velocity.y = nvy;
	}
	/**
	 * Gibt die Breite der Entität (also des gerade angezeigten Sprites) an
	 * @see {@link Entity#sprite}
	 */
	get width() {
		return this.sprite.width
	}
	/**
	 * Gibt die Höhe der Entität (also des gerade angezeigten Sprites) an
	 * @see {@link Entity#sprite}
	 */
	get height() {
		return this.sprite.height
	}
	/**
	 * Speichere alle Ecken einer Entität.
	 * Also die Punkte an denen der Sprite anfängt/aufhört, wenn
	 * man den Sprite als ein Rechteck betrachtet
	 * @see {@link Entity#sprite}
	 */
	get corners() {
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
	/**
	 * Gibt an, ob die Entität mit irgendetwas kollidiert
	 * @see {@link Entity#collidesTop}
	 * @see {@link Entity#collidesBottom}
	 * @see {@link Entity#collidesLeft}
	 * @see {@link Entity#collidesRight}
	 * @return {boolean} true, wenn Entität kollidiert
	 */
	get collides() {
		if( this.collision==undefined )
			return true
		return Object.entries(this.collision).some(e =>
			!e[0].includes('dx') && !e[0].includes('dy') && e[1] )
	}
	/**
	 * Gibt an, ob die Entität oben mit Etwas Kollidiert
	 * @return {boolean} true, wenn Entität oben gegen etwas kollidiert
	 */
	get collidesTop() {
		return this.collision.topright || this.collision.topright
	}
	/**
	 * Gibt an, ob die Entität unten mit Etwas Kollidiert
	 * @return {boolean} true, wenn Entität unten gegen etwas kollidiert
	 */
	get collidesBottom() {
		return this.collision.bottomright || this.collision.bottomright
	}
	/**
	 * Gibt an, ob die Entität links mit Etwas Kollidiert
	 * @return {boolean} true, wenn Entität links gegen etwas kollidiert
	 */
	get collidesLeft() {
		return this.collision.bottomleft || this.collision.topleft
	}
	/**
	 * Gibt an, ob die Entität rechts mit Etwas Kollidiert
	 * @return {boolean} true, wenn Entität rechts gegen etwas kollidiert
	 */
	get collidesRight() {
		return this.collision.bottomright || this.collision.topright
	}
	/**
	 * true, wenn Entität nach oben steigt und mit dem
	 * oberen Teil gegen etwas kollidiert
	 * @return {boolean} sprints gegen eine Decke
	 */
	get jumpingAgainstCeiling(){
		return this.collidesTop && this.vy < 0
	}
	/**
	 * true, wenn Entiät fällt und mit dem unteren Teil
	 * gegen etwas kollidiert
	 * @return {boolean} fällt auf den Boden
	 */
	get fallingOnFloor() {
		return this.collidesBottom && this.vy > 0
	}
	/**
	 * Gibt an, ob Entität gegen eine linke Wand läuft
	 * @return {boolean} true, wenn Entität links gegen eine Wand läuft
	 */
	get walkingIntoLeftWall() {
		return this.collidesLeft && this.vx < 0
	}
	/**
	 * Gibt an, ob Entität gegen eine rechte Wand läuft
	 * @return {boolean} true, wenn Entität rechts gegen eine Wand läuft
	 */
	get walkingIntoRightWall() {
		return this.collidesRight && this.vx > 0
	}
	/**
	 * Gibt an, ob die Entität irgendwo links hochläft
	 * @return {boolean} true, wenn Entität irgendwo nach links hochgehen möchte
	 */
	get walkingUpLeftSlope() {
		return this.collision.bottomleft && !this.collision.dxbottomleft && this.vx < 0
	}
	/**
	 * Gibt an, ob die Entität irgendwo rechts hochläft
	 * @return {boolean} true, wenn Entität irgendwo nach rechts hochgehen möchte
	 */
	get walkingUpRightSlope() {
		return this.collision.bottomright && !this.collision.dxbottomright && this.vx > 0
	}
	/**
	 * Gibt an, ob die Entität irgendwo links runterläuft
	 * @return {boolean} true, wenn Entität irgendwo nach links runterläuft
	 */
	get fallingDownLeftSlope() {
		return this.collision.bottomleft && !this.collision.dybottomleft && this.vy > 0
	}
	/**
	 * Gibt an, ob die Entität irgendwo rechts runterläuft
	 * @return {boolean} true, wenn Entität irgendwo nach rechts runterläuft
	 */
	get fallingDownRightSlope() {
		return this.collision.bottomright && !this.collision.dybottomright && this.vy > 0
	}
	/**
	 * Gibt den momentan verwendeten Sprite aus dem Spritesheet an an
	 * @return {image} der Sprite, der gerade verwendet wird
	 * @see {@link Entity#spritesheet}
	 */
	get sprite() {
		// gibt den gerade spielenden Sprite wieder
		// dies muss für jeden Entity einzeln festgelegt werden
		console.warn('Kein benutzerdefinierter Sprite. Bitte erstelle eine eigene Spritefunktion!');
		return this.spritesheet
	}
	/**
	 * Gibt an, ob alle Daten für die Entität geladen wurden.
	 * Erst dann kann die Entität auch von der Kamera gezeichnet werden
	 * @return {boolean} true, wenn alles geladen wurde, sonst false
	 */
	get loaded() {
		if( this.spriteatlas == undefined )
			this.computeSpriteatlas();
		return this.spritesheet.complete
			&& this.spriteatlas != undefined
	}
	/**
	 * Updated die Entität. Dazu gehört:
	 * timer höhersetzen
	 * tastatureingabe verarbeiten
	 * Wenn schon geladen, dann auch physik und kollisionen berechnen
	 * @param {Level} level - Das Level in dem sich die Entität befindet
	 * @fires Entity#keyboard
	 * @fires Entity#computeCollision
	 * @fires Entity#physics
	 */
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
	/**
	 * führt Aktionen aus, je nachdem ob eine Taste gedrückt wurde
	 * dies muss für jeden Entity einzeln festgelegt werden
	 */
	keyboard() {
		return
	}
	/**
	 * Berechnet den Spriteatlas aus dem Spritesheet.
	 * Also werden die Bilder im Spritesheet zurechtgeschnitten,
	 * sodass man die Sprites einzeln verwenden kann
	 * muss für jede Entität selber definiert werden
	 */
	computeSpriteatlas(){
		this.spriteatlas = {};
	}
	/**
	 * Updated this.collision, sodass neue Kollisionen nachweisbar sind
	 * Dabei wird this.corners verwendet und jeder Kante zugeordnet, ob
	 * diese kollidiert. Zusätzich werden noch Kanten mit dx oder dy
	 * vorne im Namen zusätzlich zu this.collision hinzugefügt, welche
	 * die normalen Kanten nach kollisionen überprüfen, wobei diese
	 * ein kleines bisschen verschoben wurden
	 * @param {Level} level - das Level in dem nach Kollisionen geprüft wird
	 * @param {number} [ds=this.ds] - die Größe, die ein kleiner Schritt ist
	 * @param {number} [dt=this.dt] - Veränderung in Y richtung, die eine ds Änderung in X hat, bzw Veränderung in X Richtung, die eine ds Änderung in Y hat
	 */
	computeCollision(level, ds=this.ds, dt=this.dt) {
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
	/**
	 * Führt alles aus, was mit Physik zu tuen hat
	 */
	physics(level) {
		// Wende Gravitation auf Entität an
		this.vx += level.gravity.x;
		this.vy += level.gravity.y;
		// Stillstand bei kollision
		if( this.collides ){
			// TODO
			if( this.jumpingAgainstCeiling || this.fallingOnFloor )
				if( this.fallingDownLeftSlope || this.fallingDownRightSlope ){
					this.vx *= 1.01
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
