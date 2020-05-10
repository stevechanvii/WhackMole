class Mole {
    constructor(sketch, animation, a, molePosition) {
        this.sketch = sketch;
        this.animation = animation;
        this.a = a;
        this.molePosition = molePosition;
        this.canvasWidth = 400;
        this.canvasHeight = 600;
        this.moleWidth = 190 * 0.666;
        this.moleHeight = 144 * 0.666;
        this.moleState = 0;
        this.state = 0;
    }

    /**
     * moleState
     *
     * 0 = none
     * 1 = comimg out
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
            this.moleState = 2;
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
        if (this.moleState === 1) {
            this.sketch.image(
                this.a.comeOut[this.state],
                this.molePositionX(this.molePosition),
                this.molePositionY(this.molePosition),
                this.moleWidth,
                this.moleHeight
            );
            this.state++;
            if (this.state >= this.a.comeOut.length) {
                this.state = 0;
                this.moleState = 2;
            }
        } else if (this.moleState === 2) {
            this.sketch.image(
                this.a.out[this.state % this.a.out.length],
                this.molePositionX(this.molePosition),
                this.molePositionY(this.molePosition),
                this.moleWidth,
                this.moleHeight
            );
            this.state++;
        }
    }
}
