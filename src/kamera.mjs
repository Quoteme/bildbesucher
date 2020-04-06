export class Kamera {
	constructor(level, target, x=0, y=0, w=500, h=350){
		this.position = { // Position der Kamera auf dem Level
			x : x, // momentane x-Position
			nx: x, // soll x-Position
			y : y, // momentane y-Position
			ny: y, // soll y-Position
		}
		this.size = { // Größe des Bereichs, der gerendert wird
			width  : w,
			height : h,
		}
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
	render(canvas) {
		if(!this.level.loaded){
			console.warn(`Level wurde noch nicht geladen.\nRendern wird abgebrochen.`);
			return
		}
		let ctx = canvas.getContext('2d');
		const drawLayer = layer => ctx.drawImage(
				layer,                              // Bild
				this.position.x-this.size.width/2,  // x-pos Ausschnitt
				this.position.y-this.size.height/2, // y-pos Ausschnitt
				this.size.width,                    // x-größe Ausschnitt
				this.size.height,                   // y-größe Ausschnitt
				0,                                  // x-pos Einfügen
				0,                                  // y-pos Einfügen
				canvas.width,                       // x-größe Einfügen
				canvas.height,                      // y-größe Einfügen
			)
		const drawEntity = e => e.loaded // Zeichne die Entität, wenn sie geladen ist
			? ctx.drawImage(
				e.sprite,
				0,
				0,
				e.width,
				e.height,
				0,
				0,
				e.width,
				e.height,
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

window.Kamera = Kamera;
