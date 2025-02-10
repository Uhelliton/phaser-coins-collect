import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { GameOver } from './scenes/GameOver';
import { Game as Scene1 } from './scenes/Game';
import { Scene2 } from './scenes/Scene2';

import { Game, Types } from "phaser";
import {Scene2} from "./scenes/Scene2.ts";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 150 },
        debug: false
      }
    },
    pixelArt: true, // usar images mais nitidas
    scene: [
      Boot,
      MainMenu,
      GameOver,
      Scene1,
      Scene2,
    ]
};

export default new Game(config);
