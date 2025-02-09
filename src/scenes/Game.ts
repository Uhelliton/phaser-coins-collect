import { Scene, Math } from 'phaser';

export class Game extends Scene
{
  // camera: Phaser.Cameras.Scene2D.Camera;
  // background: Phaser.GameObjects.Image;

  public platforms: Phaser.GameObjects.Group;
  public player
  public cursor
  public stars
  score = 0;
  scoreText : Phaser.GameObjects.Text

  constructor ()  {
    super('Game');
  }

  preload() {
    this.load.image('background', 'assets/bg.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.atlas('coin', 'assets/coin.png', 'assets/coin.json');
    this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48})
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();
    this.add.sprite(400, 300, 'background')
    this.scoreText = this.add.text(16, 16, `SCORE ${this.score}`, { fontSize: '20px', fill: '#ffffff'})

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');

    let platform = this.platforms.create(400, 570, 'platform').setScale(2).refreshBody()
    platform.body.immovable = true

    this.player = this.physics.add.sprite(50, 50, 'player').setScale(1.2, 1.2)
    this.player.body.gravity.y = 300
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNames("coin", { prefix: "coin_", start: 1, end: 7, zeroPad: 2 }),
      frameRate: 16,
      repeat: -1
    });

    this.anims.create({
      key: "vanish",
      frames: this.anims.generateFrameNames("coin", { prefix: "vanish_", start: 1, end: 4 }),
      frameRate: 10
    });
  }

  update(time: number, delta: number) {
  }
}
