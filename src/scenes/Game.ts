import { Scene, Math } from 'phaser';

export class Game extends Scene
{
  // camera: Phaser.Cameras.Scene2D.Camera;
  // background: Phaser.GameObjects.Image;

  public platforms: Phaser.GameObjects.Group;
  public movePlatforms
  public player
  public cursor
  public coins
  public stars
  score = 0;
  scoreText : Phaser.GameObjects.Text

  constructor ()  {
    super('Game');
  }

  preload() {
    this.load.image('background', 'assets/bg.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48})
    this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 36, frameHeight: 44 });
  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();
    this.add.sprite(400, 300, 'background')
    this.scoreText = this.add.text(16, 16, `SCORE ${this.score}`, { fontSize: '20px', fill: '#ffffff'})

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(600, 220, 'platform').setScale(0.75).refreshBody();

    let platform = this.platforms.create(400, 570, 'platform').setScale(2.5).refreshBody()
    platform.body.immovable = true

    this.movePlatforms = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
    let movePlatform = this.movePlatforms.create(150, 475, 'platform').setScale(0.25, 1)
      movePlatform.speed = 2
      movePlatform.minX = 150
      movePlatform.maxX = 300

      movePlatform = this.movePlatforms.create(500, 280, 'platform').setScale(0.25, 1)
      movePlatform.speed = 1
      movePlatform.minX = 500
      movePlatform.maxX = 800

    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 14,
      setXY: {
        x: 12,
        y: -50,
        stepX: 70
      }
    })
    this.coins.createMultiple({max: 30})

    this.player = this.physics.add.sprite(50, 50, 'player').setScale(1.2, 1.2)
    this.player.body.gravity.y = 300
    this.player.setCollideWorldBounds(true)
    this.player.setBounce(0.2) // kick play after coline platform

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

    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.player, this.movePlatforms, this.platformMovingThins)
    this.physics.add.collider(this.coins, this.platforms)
    this.physics.add.collider(this.coins, this.movePlatforms)

    this.physics.world.setBounds(0, 0, 900, 600)
    this.cameras.main.startFollow(this.player).setBounds(0, 0, 900, 600)
  }

  update(time: number, delta: number) {
    this.player.setVelocityX(0)
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-150)
      this.player.anims.play('left', true)
    }
    else if (this.cursor.right.isDown) {
      this.player.setVelocityX(150)
      this.player.anims.play('right', true)
    } else {
      this.player.anims.play('turn', true)
    }

    if (this.cursor.up.isDown && this.player.body.touching.down) { // if play if contact is platform
      this.player.setVelocityY(-350)
    }

    this.movePlatforms.children.iterate((platform) => this.handleMovePlatform(platform))
  }

  protected handleMovePlatform(platform) {
    if (platform.x < platform.minX || platform.x > platform.maxX ) {
      platform.speed *= -1
    }

    platform.x += platform.speed
  }

  protected platformMovingThins(sprite, platform) {
    sprite.x += platform.speed
  }
}
