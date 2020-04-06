import {get} from './urlvar/urlvar.mjs'
import {Level} from './level.mjs'
import {Kamera} from './kamera.mjs'
import {Player} from './entities/player.mjs'

let c, ctx;
let level, kamera, spieler;

window.onresize = e => {
	c.height = window.innerHeight;
	c.width  = window.innerWidth;
}

const init = _ => {
	// Verlinke DOM-Elemente
	c = document.getElementById('c');
	ctx = c.getContext('2d');
	window.onresize();
	// URL entziffern
	let skizzeURL = get()?.s ?? '../level/Landschaft';
	let kollisionURL = get()?.k;
	// Spieler laden
	spieler = new Player();
	// Level als "level" laden
	level = new Level(skizzeURL, kollisionURL);
	level.entities.push(spieler);
	// Kamera für das Level erstellen
	kamera = new Kamera(level, spieler);
	window.kamera = kamera;
	window.level = level;
}

const main = _ => {
	update();
}

const update = _ => {
	ctx.clearRect(0,0,c.width,c.height);
	kamera.update();
	kamera.render(c);
	requestAnimationFrame(update);
}

init();
main();
