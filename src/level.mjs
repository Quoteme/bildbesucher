export class Level {
	constructor(URL) {
		this.vordergrundIMG       = new Image();
		this.vordergrundIMG.src   = URL.concat('-v.png');
		this.hintergrundIMG       = new Image();
		this.hintergrundIMG.src   = URL.concat('-h.png');
		this.kollisionIMG         = new Image();
		this.kollisionIMG.src     = URL.concat('-k.png');
		this.kollisionCANVAS      = undefined; // Canvas, welches nur das kollisionIMG beinhaltet
		this.kollisionNeedsUpdate = true; // gibt an, ob kollisionCANVAS neu generiert werden muss
		this.entities             = [] // Entitäten im Level (wie Spieler etc)
		this.kollitionsgrenze     = 0.8; // alpha-Wert des Pixels, damit er als kollidierbar gilt
		this.gravity              = {x: 0, y: +0.2}
	}
	get vordergrund() {
		// Gibt das Vordergrundbild zurück, wenn geladen
		if(this.loaded)
			return this.vordergrundIMG;
		else
			console.warn('Vordergrundbild wurde noch nicht geladen!');
	}
	get hintergrund() {
		// Gibt das Hintergrundbild zurück, wenn geladen
		if(this.loaded)
			return this.hintergrundIMG;
		else
			console.warn('Hintergrundbild wurde noch nicht geladen!');
	}
	get kollision() {
		// Gibt das Kollisionsbild zurück, wenn geladen
		if(this.loaded)
			return this.kollisionIMG;
		else
			console.warn('Kollisionsbild wurde noch nicht geladen!');
	}
	get loaded(){
		// Gibt true zurück, wenn die Bilder geladen sind
		return this.vordergrundIMG.complete
			&& this.hintergrundIMG.complete
			&& this.kollisionIMG.complete
			&& this.entities.every(e => e.loaded )
	}
	update() {
		this.entities.forEach(e => e.update(this))
		if( this.kollisionNeedsUpdate )
			this.computeCollisions();
	}
	computeCollisions() {
		// füllt das kollisionCANVAS mit dem kollisionIMG
		// damit die Pixel des kollisionIMG mit checkCollision
		// überprüft werden können
		// true, wenn klappt, false sonst
		if( !this.loaded ){
			console.warn(
				"kollisionCANVAS konnte noch nicht erzeugt werden, \
				da level noch nicht geladen wurde");
			return false
		}
		// Füllt das kollisionCANVAS mit dem Kollisionsbild
		let c = document.createElement("canvas");
			c.width  = this.kollisionIMG.width;
			c.height  = this.kollisionIMG.height;
		let ctx = c.getContext("2d");
			ctx.drawImage(this.kollision, 0, 0);
		this.kollisionCANVAS = c;
		this.kollisionNeedsUpdate = false;
		return true
	}
	checkCollision(x,y, r=0, b=0, g=0, a=this.kollitionsgrenze) {
		// Gibt an, ob ein Pixel kollidierbar ist
		if( !this.loaded )
			return
		if( this.kollisionCANVAS==undefined ){
			return
		}
		let data = this.kollisionCANVAS
			.getContext("2d")
			.getImageData(x,y,1,1)
			.data;
		return data[0] >= r
			&& data[1] >= g
			&& data[2] >= b
			&& data[3] >= a;
	}
}

window.Level = Level;
