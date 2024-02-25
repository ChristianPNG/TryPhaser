import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private player: Phaser.Physics.Arcade.Sprite;
    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;
    private bombs: Phaser.Physics.Arcade.Group;
    private GameOver: boolean = false;

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        //implementing assets into game
        this.add.image(400, 300, "sky");
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, "platform").setScale(2).refreshBody();
        this.platforms.create(600, 400, "platform");
        this.platforms.create(50, 250, "platform");
        this.platforms.create(750, 220, "platform");

        //implementing player
        this.player = this.physics.add.sprite(100, 450, "dude");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        //implementing player animation
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        //keyboard input
        this.cursor = this.input.keyboard?.createCursorKeys();

        //stars
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        this.stars.children.iterate((c: Phaser.GameObjects.GameObject) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return true;
        });

        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(
            this.stars,
            this.player,
            this
                .handleCollectStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        //Score text
        this.scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            color: "#000",
            strokeThickness: 2,
            stroke: "#000",
        });

        //bombs
        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.platforms, this.bombs);
        this.physics.add.collider(
            this.bombs,
            this.player,
            this
                .handleHitBombs as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );
    }

    private handleHitBombs(
        player: Phaser.GameObjects.GameObject,
        b: Phaser.GameObjects.GameObject
    ): void {
        const bomb: Phaser.Physics.Arcade.Image =
            b as Phaser.Physics.Arcade.Image;
        bomb.disableBody(true, true);

        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play("turn");
        this.GameOver = true;
    }

    private handleCollectStar(
        player: Phaser.GameObjects.GameObject,
        s: Phaser.GameObjects.GameObject
    ): void {
        const star: Phaser.Physics.Arcade.Image =
            s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((c: Phaser.GameObjects.GameObject) => {
                const child = c as Phaser.Physics.Arcade.Image;
                child.enableBody(true, child.x, 0, true, true);
                return true;
            });
            const x: number =
                this.player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);
            const bomb: Phaser.Physics.Arcade.Image = this.bombs.create(
                x,
                16,
                "bomb"
            );
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    update() {
        if (!this.GameOver) {
            if (this.cursor?.left.isDown) {
                this.player.setVelocityX(-260);
                this.player.anims.play("left", true);
            } else if (this.cursor?.right.isDown) {
                this.player.setVelocityX(260);
                this.player.anims.play("right", true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play("turn");
            }
            if (this.cursor?.up.isDown && this.player.body?.touching.down) {
                this.player.setVelocityY(-330);
            }
        }
    }
}
