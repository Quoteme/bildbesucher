/**
 * @version 0.1
 * @author Luca Leon Happel
 * @file Startpunkt des Programms.
 * Von hier aus wird alles initialisiert und der update-loop gestartet
 */

import {get} from './urlvar/urlvar.mjs'
import {Level} from './level.mjs'
import {Kamera} from './kamera.mjs'
import {Player} from './entities/player.mjs'

let c, ctx;
let level, kamera, spieler;

/**
 * Initialisiert das Spiel
 */
const init = _ => {
	// Verlinke DOM-Elemente
	c = document.getElementById('c');
	c.width = 500;
	c.height = 350;
	ctx = c.getContext('2d');
	// URL entziffern
	let skizzeURL = get()?.s ?? 'level/Landschaft';
	let kollisionURL = get()?.k;
	// Spieler laden
	spieler = new Player(undefined, 3000, 2850);
	// Level als "level" laden
	level = new Level(skizzeURL, kollisionURL);
	level.entities.push(spieler);
	// Kamera für das Level erstellen
	kamera = new Kamera(c, level, spieler);
	window.kamera = kamera;
	window.level = level;
}

/**
 * Haupt-update-loop des Spiels
 * @fires level#update
 * @fires kamera#update
 * @fires kamera#render
 */
const update = _ => {
	ctx.clearRect(0,0,c.width,c.height);
	level.update();
	kamera.update();
	kamera.render();
	requestAnimationFrame(update);
}

/**
 * Wird als aller erste Funktion ausgeführt
 * @fires init
 * @fires update
 */
const main = _ => {
	init();
	update();
}

main();
