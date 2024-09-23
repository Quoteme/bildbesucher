import { Entity } from "../entity.mjs";
import * as CUTIMG from "../cutImg/cutImg.mjs";
import * as KEYBOARD from "../keyboard/keyboard.mjs";

window.KEYBOARD = KEYBOARD;
window.CUTIMG = CUTIMG;

/**
 * Klasse, welche einen Spieler darstellt
 */
export class Player extends Entity {
  /**
   * Erstellt einen Player
   * @param {string} [sprite='res/player.png'] - URL zu dem Spritesheet des Players
   * @param {Object[]} [audio=[]] - Liste von URLs zu den Audioeffekten
   * @param {string} audio[].0 - Schritt 1
   * @param {string} audio[].1 - Schritt 2
   * @param {string} audio[].2 - Absprung
   * @param {string} audio[].3 - Landung
   * @param {number} [x=0] - X-Position des Players
   * @param {number} [y=0] - Y-Position des Players
   * @property {('idle'|'walkRight'|'walkLeft')} state - Der Status des Players
   */
  constructor(
    sprite = "res/player.png",
    audio = [
      "res/sound/fx/footstep04.ogg",
      "res/sound/fx/footstep05.ogg",
      "res/sound/fx/footstep08.ogg",
      "res/sound/fx/footstep09.ogg",
    ],
    x = 0,
    y = 0,
  ) {
    super(sprite, audio, x, y);
  }
  get sprite() {
    // gibt den gerade spielenden Sprite wieder
    switch (this.state) {
      case "idle":
        return this.spriteatlas.idle[Math.floor((this.time / 17) % 3)];
      case "walkRight":
        return this.spriteatlas.walkRight[Math.floor((this.time / 5.75) % 6)];
      case "walkLeft":
        return this.spriteatlas.walkLeft[Math.floor((this.time / 5.75) % 6)];
      default:
        return this.spritesheet;
    }
  }
  get audio() {
    switch (this.state) {
      case "walkRight":
        return this.audioatlas.walkRight[Math.floor((this.time / 11) % 2)];
      case "walkLeft":
        return this.audioatlas.walkLeft[Math.floor((this.time / 11) % 2)];
      default:
        return new Audio();
    }
  }
  async computeSpriteatlas() {
    this.spriteatlas = {
      idle: [
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 7, 5, 17, 45)),
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 38, 5, 17, 45)),
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 66, 4, 17, 46)),
      ],
      walkRight: [
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 0, 61, 27, 46)),
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 29, 61, 24, 45)),
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 56, 57, 32, 49)),
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 91, 56, 20, 50)),
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 113, 60, 29, 45)),
        await CUTIMG.load(CUTIMG.cut(this.spritesheet, 142, 57, 28, 48)),
      ],
      walkLeft: [
        await CUTIMG.load(
          await CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 0, 61, 27, 46)),
        ),
        await CUTIMG.load(
          await CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 29, 61, 24, 45)),
        ),
        await CUTIMG.load(
          await CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 56, 57, 32, 49)),
        ),
        await CUTIMG.load(
          await CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 91, 56, 20, 50)),
        ),
        await CUTIMG.load(
          await CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 113, 60, 29, 45)),
        ),
        await CUTIMG.load(
          await CUTIMG.mirror(CUTIMG.cut(this.spritesheet, 142, 57, 28, 48)),
        ),
      ],
    };
    console.log("Sprite atlas loaded!");
    console.log(this.spriteatlas);
  }
  computeAudioatlas() {
    this.audioatlas = {
      walkRight: [new Audio(this.audiosheet[0]), new Audio(this.audiosheet[1])],
      walkLeft: [new Audio(this.audiosheet[0]), new Audio(this.audiosheet[1])],
    };
  }
  keyboard() {
    if (KEYBOARD.pressed("ArrowRight")) {
      this.vx = 3;
      this.state = "walkRight";
    } else if (KEYBOARD.pressed("ArrowLeft")) {
      this.vx = -3;
      this.state = "walkLeft";
    } else {
      this.state = "idle";
    }
    if (KEYBOARD.pressed("ArrowUp"))
      if (this.collides) this.vy = -4;
      else this.vy -= 0.15;
    else if (KEYBOARD.pressed("ArrowDown")) this.vy = 3;
  }
}
