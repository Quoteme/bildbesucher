export class Level {
	constructor(URL) {
		this.vordergrundIMG     = new Image();
		this.vordergrundIMG.src = URL.concat('-v.png');
		this.hintergrundIMG     = new Image();
		this.hintergrundIMG.src = URL.concat('-h.png');
		this.kollisionIMG       = new Image();
		this.kollisionIMG.src   = URL.concat('-k.png');
		this.entities = [] // Entitäten im Level (wie Spieler etc)
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
		this.entities.forEach(e => e.update())
	}
}

window.Level = Level;
