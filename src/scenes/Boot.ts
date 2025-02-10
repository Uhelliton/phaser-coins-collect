import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
      this.load.image('background', 'assets/bg.png');
      this.load.image('logo', 'assets/logo.png');
      this.load.image('platform', 'assets/platform.png');
      this.load.image('enemy', 'assets/poo.png');
      this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48})
      this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 36, frameHeight: 44 });

    }

    create ()
    {
      this.anims.create({
        key: 'spin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 4 }),
        frameRate: 8, // velocide animação
        repeat: -1,
      })

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10, // velocidade
        repeat: -1 // loop repeat
      })
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10, // velocidade
        repeat: -1 // loop repeat
      })
      this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 4 } ],
        frameRate: 20
      });

      this.scene.start('MainMenu');
    }
}
