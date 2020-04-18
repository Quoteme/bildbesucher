/**
 * @module Level
 * @version 0.1
 * @author Luca Leon Happel
 * @file Speichert die Entitäten und den Hinter/Vordergrund der
 * gemalt werden soll, sowie das Kollisionsbild
 * @see {@link Entity}
 */

/**
 * Klasse, welche ein Level darstellt
 */
export class Level {
	/*
	 * Erstelle ein Level
	 * @param {string} URL - die basis-URL welche zu den Bildern des Levels gehört
	 * @example
	 * // läd die Dateien: [level/Landschaft-v, level/Landschaft-h.png, level/Landschaft-k.png]
	 * l = new Level('level/Landschaft');
	 */
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
	/**
	 * Gibt das Vordergrundbild zurück, wenn geladen
	 * @return {image|undefined} das Vordergrundbild, wenn geladen
	 */
	get vordergrund() {
		if(this.loaded)
			return this.vordergrundIMG;
		else
			console.warn('Vordergrundbild wurde noch nicht geladen!');
	}
	/**
	 * Gibt das Hintergrundbild zurück, wenn geladen
	 * @return {image|undefined} das Hintergrundbild, wenn geladen
	 */
	get hintergrund() {
		if(this.loaded)
			return this.hintergrundIMG;
		else
			console.warn('Hintergrundbild wurde noch nicht geladen!');
	}
	/**
	 * Gibt das Kollisionsbild zurück, wenn geladen
	 * @return {image|undefined} das Kollisionsbild, wenn geladen
	 */
	get kollision() {
		if(this.loaded)
			return this.kollisionIMG;
		else
			console.warn('Kollisionsbild wurde noch nicht geladen!');
	}
	/**
	 * Gibt an, ob alle Dateien welche vom Level benötigt werden geladen sind
	 * @return {boolean}
	 */
	get loaded(){
		return this.vordergrundIMG.complete
			&& this.hintergrundIMG.complete
			&& this.kollisionIMG.complete
			&& this.entities.every(e => e.loaded )
	}
	/**
	 * Updated das Level
	 * @fires Entity#update
	 * @fires Level#computeCollisions
	 */
	update() {
		this.entities.forEach(e => e.update(this))
		if( this.kollisionNeedsUpdate )
			this.computeCollisions();
	}
	/**
	 * füllt das kollisionCANVAS mit dem kollisionIMG
	 * damit die Pixel des kollisionIMG mit checkCollision
	 * überprüft werden können
	 * @return {boolean} true, wenn Kollisionen nun checkbar sind, sonst false
	 */
	computeCollisions() {
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
	/**
	 * Checkt ob ein Pixel kollidierbar ist
	 * @param {number} x - X-Position des Pixels
	 * @param {number} y - Y-Position des Pixels
	 * @param {number} [r] - Rotwert den der Pixel erfüllen muss zum kollidieren
	 * @param {number} [g] - Grünwert den der Pixel erfüllen muss zum kollidieren
	 * @param {number} [b] - Blauwert den der Pixel erfüllen muss zum kollidieren
	 * @param {number} [a=Level#kollisionsgrenze] - Alphawert den der Pixel erfüllen muss zum kollidieren
	 */
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
