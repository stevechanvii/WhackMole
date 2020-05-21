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
    underground = () => {
        this.moleState = 'appearing';
        this.moleFrame = 0;
    };

    appearing = () => {
        this.moleState = 'appeared';
        this.moleFrame = 0;
    };

    appeared = () => {
        this.moleState = 'disappearing';
        this.moleFrame = 0;
    };

    disappearing = () => {
        this.moleState = 'underground';
        this.moleFrame = 0;
    };

    clicked = () => {
        if (this.moleState === 'appeared') {
            this.moleState = 'clicked';
            this.moleFrame = 0;
            score++;
        }
    };

    /**
     * Infinite loop in every 0 to 5 seconds, control the state of mole
     */
    moleController = () => {
        const randomNum = (num) => Math.floor(Math.random() * num);

        if (this.moleState === 'underground' && randomNum(10) > 6) {
            this.underground();
        } else if (this.moleState === 'appeared' && randomNum(10) > 6) {
            this.appeared();
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

    /**
     * Determin the distance between the mouseClicked event and the center of mole,
     * if distance is smaller than 50px, then clicked.
     */
    mouseClick = (mouseX, mouseY) => {
        const d = this.sketch.dist(
            mouseX,
            mouseY,
            this.molePositionX(this.molePosition) + this.moleWidth / 2,
            this.molePositionY(this.molePosition) + this.moleHeight / 2
        );
        if (d < 50) {
            this.clicked();
        }
    };

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
                    this.appearing();
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
                    this.disappearing();
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
                    this.disappearing();
                }
                break;
            default:
        }
    }
}
