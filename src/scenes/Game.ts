import { Scene, Math as PhaserMath } from 'phaser';

export class Game extends Scene
{
  // camera: Phaser.Cameras.Scene2D.Camera;
  // background: Phaser.GameObjects.Image;

  public platforms: Phaser.GameObjects.Group;
  public movePlatforms
  public player
  public cursor
  public coins
  score = 0;
  scoreText : Phaser.GameObjects.Text
  public enemies
  public gameOver = false

  constructor ()  {
    super('Game');
  }

  preload() {

  }

  create() {
    this.cursor = this.input.keyboard?.createCursorKeys();
    this.add.sprite(400, 300, 'background')
    this.scoreText = this.add.text(16, 16, `SCORE ${this.score}`, { fontSize: '20px', fill: '#ffffff'})
      .setShadow(0, 0, '#000', 3)
      .setScrollFactor(0) // percent element if moving

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
    let movePlatform = this.movePlatforms.create(160, 440, 'platform').setScale(0.25, 1)
      movePlatform.speed = 2
      movePlatform.minX = 150
      movePlatform.maxX = 300

      movePlatform = this.movePlatforms.create(500, 300, 'platform').setScale(0.25, 1)
      movePlatform.speed = 1.5
      movePlatform.minX = 340
      movePlatform.maxX = 720

    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 14,
      setXY: {
        x: 12,
        y: 10,
        stepX: 70
      }
    })

    this.coins.children.iterate((coin) => {
      coin.setBounceY(PhaserMath.FloatBetween(.4, .8))
      coin.anims.play('spin')
    })

    this.enemies = this.physics.add.group()
    let enemy = this.enemies.create(PhaserMath.Between(50, 950), 0, 'enemy')
      .setScale(.3)
      .setBounce(1)
      .setCollideWorldBounds(true)
      .setVelocity(Math.random() < .5 ? -200 : 200, 50)

    this.player = this.physics.add.sprite(50, 50, 'player').setScale(1.2, 1.2)
    this.player.body.gravity.y = 300
    this.player.setCollideWorldBounds(true)
    this.player.setBounce(0.2) // kick play after coline platform
    this.player.setSize(32, 46)

    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.player, this.movePlatforms, this.platformMovingThins)

    this.physics.add.collider(this.coins, this.platforms)
    this.physics.add.collider(this.coins, this.movePlatforms)

    this.physics.add.collider(this.player, this.enemies, this.enemyHit, null, this)
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.enemies, this.movePlatforms)

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this)

    this.physics.world.setBounds(0, 0, 900, 600)
    this.cameras.main.startFollow(this.player).setBounds(0, 0, 900, 600)
  }

  update(time: number, delta: number) {
    if (this.gameOver) return

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

  protected collectCoin(player, coin) {
    coin.destroy()
    this.score += 10;
    this.setScore()
  }

  protected setScore() {
    this.scoreText.setText(`SCORE ${this.score}`)
  }

  protected enemyHit(player, enemy) {
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.stop()
    this.gameOver = true
  }
}
