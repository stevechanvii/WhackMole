class Mole {
    constructor(sketch, animation, molePosition) {
        this.sketch = sketch;
        this.animation = animation;
        this.molePosition = molePosition;
        this.canvasWidth = 400;
        this.canvasHeight = 600;
        this.moleWidth = 190 * 0.666;
        this.moleHeight = 144 * 0.666;
        this.moleState = 0;
    }

    /**
     * moleState
     *
     * 0 = none
     * 1 = ready to come out
     * 2 = already come out
     * 3 = back to hole
     * 4 = been clicked
     */
    moleController = () => {
        const randomNum = (num) => Math.floor(Math.random() * num);

        if (this.moleState === 0) {
            if (randomNum(2)) {
                this.moleState = 1;
            }
        } else if (this.moleState === 2) {
            this.moleState = 3;
        }

        console.log(this.moleState);

        setTimeout(this.moleController, randomNum(5000));
    };

    /**
     * @param {list} mole
     * Calculate the x position of mole
     */
    molePositionX = (mole) =>
        (this.canvasWidth / 3 - this.moleWidth) / 2 + (this.canvasWidth / 3) * mole[1];

    /**
     * @param {list} mole
     * Calculate the Y position of mole, 5 is fence height, 3 equals to fence + grass at bottom
     */
    molePositionY = (mole) =>
        this.canvasHeight / 5 +
        ((this.canvasHeight - this.canvasHeight / 3) / 3 - this.moleHeight) / 2 +
        ((this.canvasHeight - this.canvasHeight / 3) / 3) * mole[0];

    draw() {
        // for (let i = 0; i < 3; i++) {
        //     for (let j = 0; j < 3; j++) {
        //         this.sketch.image(
        //             this.animation[this.sketch.frameCount % this.animation.length],
        //             this.molePositionX([i, j]),
        //             this.molePositionY([i, j]),
        //             this.moleWidth,
        //             this.moleHeight
        //         );
        //     }
        // }

        this.sketch.image(
            this.animation[this.sketch.frameCount % this.animation.length],
            this.molePositionX(this.molePosition),
            this.molePositionY(this.molePosition),
            this.moleWidth,
            this.moleHeight
        );
    }
}
