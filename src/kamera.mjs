/**
 * @module Kamera
 * @version 0.1
 * @author Luca Leon Happel
 * @file Definiere virtuelle Kameras, welche einen Teil eines Bildes
 * zoomen können, sich glatt hin-und-her bewegen können und welche
 * eine Entität verfolgen können
 * @see {@link Entity}
 */

/**
 * Klasse, welche eine virtuelle Kamera darstellt
 */
export class Kamera {
	/**
	 * Erstellt eine neue Kamera
	 * @param {object} canvas - Das Canvaselement, zu dem geredert wird
	 * @param {Level} level - Das Level, welches gezeichnet wird
	 * @param {Entity} target - Die Entität, welche verfolgt wird
	 * @param {number} [zoom=1.5] - Der zoom, mit dem die Kamera rendert. Große Werte -> Mehr Sichtfeld
	 * @param {number} [x=0] - X-Position der Kamera
	 * @param {number} [y=0] - Y-Position der Kamera
	 */
	constructor(canvas, level, target, zoom=1.5, x=0, y=0){
		this.position = { // Position der Kamera auf dem Level
			x : x, // momentane x-Position
			nx: x, // soll x-Position
			y : y, // momentane y-Position
			ny: y, // soll y-Position
		}
		this.zoom = zoom; // Zoom der Kamera / Wie viel angezeigt wird
		this.canvas = canvas; // Das canvas, auf welches gerendert wird
		this.level  = level;  // Level, welches gerendert werden soll
		this.target = target; // Object, welches verfolgt werden soll
		this.follow = target!=undefined; // True, wenn das Target verfolgt werden soll
		this.speed = 0.025;
	}
	/**
	 * Gibt die X-Position der Kamera an
	 * @return {number} X-Position
	 */
	get x(){
		return this.position.x;
	}
	/**
	 * Setzt die X-Position der Kamera
	 */
	set x(nx){
		this.position.nx = nx;
	}
	/**
	 * Gibt die Y-Position der Kamera an
	 * @return {number} Y-Position
	 */
	get y(){
		return this.position.y;
	}
	/**
	 * Setzt die Y-Position der Kamera
	 */
	set y(ny){
		this.position.ny = ny;
	}
	/**
	 * Gibt die Grenzen des Kamerasichfeldes an, relativ zu dem Bild was sie malen soll
	 * @return {object} Grenzen des Kamerasichtfeldes
	 */
	get corner() {
		return {
			upperx: this.x - this.zoom*this.canvas.width/2,
			uppery: this.y - this.zoom*this.canvas.height/2,
			lowerx: this.x + this.zoom*this.canvas.width/2,
			lowery: this.y + this.zoom*this.canvas.height/2,
		}
	}
	/**
	 * Gibt die Winkel zu der Entität an, welche verfolgt wird
	 * @return {number} Winkel zum Target
	 */
	get direction() {
		// Winkel von der momentanen zur soll Position
		return Math.atan2(
			this.position.ny-this.position.y,
			this.position.nx-this.position.x,
		);
	}
	/**
	 * Gibt die Distanz zu der Entität an, welche verfolgt wird
	 * @return {number} Distanz zum Target
	 */
	get distance() {
		return Math.hypot(
			this.position.nx-this.position.x,
			this.position.ny-this.position.y,
		);
	}
	/**
	 * Updated die Kamera
	 * Dies muss ausgeführt werden, wenn eine Entität verfolgt werden soll
	 */
	update() {
		if(this.follow){
			// setze soll position zu der des Targets
			this.x = this.target.position.x;
			this.y = this.target.position.y;
		}
		// bewege die in Richtung der soll Position
		this.position.x += Math.cos(this.direction)*this.distance*this.speed;
		this.position.y += Math.sin(this.direction)*this.distance*this.speed;
	}
	/**
	 * Rendert das Level zum Canvas
	 * @see {@link Level}
	 */
	render() {
		// Checks
		if(!this.level.loaded){
			console.warn(`Level wurde noch nicht geladen.\nRendern wird abgebrochen.`);
			return
		}
		// Variables
		let ctx = this.canvas.getContext('2d');
		// Functions
		const drawLayer = layer => ctx.drawImage(
				layer,                              // Bild
				this.corner.upperx,  // x-pos Ausschnitt
				this.corner.uppery, // y-pos Ausschnitt
				this.corner.lowerx - this.corner.upperx,
				this.corner.lowery - this.corner.uppery,
				0,
				0,
				this.canvas.width,
				this.canvas.height,
			)
		const drawEntity = e => e.sprite!=undefined
			? ctx.drawImage(
					e.sprite,
					0,
					0,
					e.width,
					e.height,
					(e.x - this.corner.upperx - e.width/2)/this.zoom,
					(e.y - this.corner.uppery - e.height/2)/this.zoom,
					e.width/this.zoom,
					e.height/this.zoom,
					// e.x-e.width/2 -this.offsetx,
					// e.y-e.height/2 -this.offsety,
				)
			: undefined
		// Zeichne den Hintergrund
		drawLayer(this.level.hintergrund);
		// Zeichne die Objekte des Levels
		this.level.entities.forEach( e => drawEntity(e));
		// Zeichne den Vordergrund
		drawLayer(this.level.vordergrund);
	}
}
