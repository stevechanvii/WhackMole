class Mole {
    constructor(sketch, animation, molePosition) {
        this.sketch = sketch;
        this.animation = animation;
        this.molePosition = molePosition;
        this.canvasWidth = 400;
        this.canvasHeight = 600;
        this.moleWidth = 190 * 0.666;
        this.moleHeight = 144 * 0.666;
        this.moleState = 'underground';
        this.moleFrame = 0;
    }

    /**
     * moleState
     *
     * underground
     * appearing
     * appeared
     * disappearing
     * clicked
     */
    moleController = () => {
        const randomNum = (num) => Math.floor(Math.random() * num);

        if (this.moleState === 'underground' && randomNum(10) > 7) {
            this.moleState = 'appearing';
        } else if (this.moleState === 'appeared' && randomNum(10) > 6) {
            this.moleState = 'disappearing';
            this.moleFrame = 0;
        }

        console.log(this.moleState);

        setTimeout(this.moleController, randomNum(5000));
    };

    // Change the state when clicked
    clicked = () => {
        if (this.moleState === 'appeared') {
            this.moleState = 'clicked';
            this.moleFrame = 0;
        }
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
        switch (this.moleState) {
            case 'underground':
                break;
            case 'appearing':
                this.sketch.image(
                    this.animation.comeOut[this.moleFrame],
                    this.molePositionX(this.molePosition),
                    this.molePositionY(this.molePosition),
                    this.moleWidth,
                    this.moleHeight
                );

                this.moleFrame++;
                if (this.moleFrame >= this.animation.comeOut.length) {
                    this.moleFrame = 0;
                    this.moleState = 'appeared';
                }
                break;
            case 'appeared':
                this.sketch.image(
                    this.animation.out[this.moleFrame % this.animation.out.length],
                    this.molePositionX(this.molePosition),
                    this.molePositionY(this.molePosition),
                    this.moleWidth,
                    this.moleHeight
                );
                this.moleFrame++;
                break;
            case 'disappearing':
                this.sketch.image(
                    this.animation.backIn[this.moleFrame],
                    this.molePositionX(this.molePosition),
                    this.molePositionY(this.molePosition),
                    this.moleWidth,
                    this.moleHeight
                );
                this.moleFrame++;
                if (this.moleFrame >= this.animation.backIn.length) {
                    this.moleFrame = 0;
                    this.moleState = 'underground';
                }
                break;
            case 'clicked':
                this.sketch.image(
                    this.animation.clicked[this.moleFrame],
                    this.molePositionX(this.molePosition),
                    this.molePositionY(this.molePosition),
                    this.moleWidth,
                    this.moleHeight
                );
                this.moleFrame++;
                if (this.moleFrame >= this.animation.clicked.length) {
                    this.moleFrame = 0;
                    this.moleState = 'underground';
                }
                break;
            default:
        }
    }
}
