export class Kamera {
	constructor(canvas, level, target, x=0, y=0, zoom=1){
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
		this.speed = 0.5;
	}
	get x(){
		return this.position.x;
	}
	set x(nx){
		this.position.nx = nx;
	}
	get y(){
		return this.position.y;
	}
	set y(ny){
		this.position.ny = ny;
	}
	get corner() {
		// Gibt die Ecken des Gerenderten Bildes an
		return {
			upperx: this.x - this.zoom*this.canvas.width/2,
			uppery: this.y - this.zoom*this.canvas.height/2,
			lowerx: this.x + this.zoom*this.canvas.width/2,
			lowery: this.y + this.zoom*this.canvas.height/2,
		}
	}
	get direction() {
		// Winkel von der momentanen zur soll Position
		return Math.atan2(
			this.position.ny-this.position.y,
			this.position.nx-this.position.x,
		);
	}
	get distance() {
		// Distanz von der momentanen zur soll Position
		return Math.hypot(
			this.position.nx-this.position.x,
			this.position.ny-this.position.y,
		);
	}
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
		const drawEntity = e => ctx.drawImage(
				e.sprite,
				0,
				0,
				e.width,
				e.height,
				e.x - this.corner.upperx - e.width/2/this.zoom,
				e.y - this.corner.uppery - e.width/2/this.zoom,
				e.width/this.zoom,
				e.height/this.zoom,
				// e.x-e.width/2 -this.offsetx,
				// e.y-e.height/2 -this.offsety,
			)
		// Zeichne den Hintergrund
		drawLayer(this.level.hintergrund);
		// Zeichne die Objekte des Levels
		this.level.entities.forEach( e => drawEntity(e));
		// Zeichne den Vordergrund
		drawLayer(this.level.vordergrund);
	}
}

window.Kamera = Kamera;
