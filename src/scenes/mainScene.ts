import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private player: Phaser.Physics.Arcade.Sprite;
    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;

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
    }

    update() {
        if (this.cursor?.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursor?.right.isDown) {
            this.player.setVelocityX(160);
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
