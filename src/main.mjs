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

let fg, fgctx, bg, bgctx;
let level, kamera, spieler;

/**
 * Initialisiert das Spiel
 */
const init = _ => {
	// Verlinke DOM-Elemente
	fg        = document.getElementById('fg');
	fg.width  = 500;
	fg.height = 350;
	fgctx     = fg.getContext('2d');
	bg        = document.getElementById('bg');
	bg.width  = 500;
	bg.height = 350;
	bgctx     = bg.getContext('2d');
	// URL entziffern
	let skizzeURL    = get()?.s ?? 'level/Landschaft';
	let kollisionURL = get()?.k;
	// Spieler laden
	spieler = new Player(undefined, undefined, 3000, 0);
	// Level als "level" laden
	level   = new Level(skizzeURL, kollisionURL);
	level.entities.push(spieler);
	// Kamera für das Level erstellen
	kamera        = new Kamera(fg, bg, level, spieler);
	window.kamera = kamera;
	window.level  = level;
}

/**
 * Haupt-update-loop des Spiels
 * @fires level#update
 * @fires kamera#update
 * @fires kamera#render
 */
const update = _ => {
	fgctx.clearRect(0,0,fg.width,fg.height);
	bgctx.clearRect(0,0,bg.width,bg.height);
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
