import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup;

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
        //this.add.image(400, 300, "star");
    }

    update() {}
}
