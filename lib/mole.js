class Mole {
  constructor(sketch, animation, molePosition) {
    Object.defineProperty(this, "underground", {
      enumerable: true,
      writable: true,
      value: () => {
        this.moleState = 'appearing';
        this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "appearing", {
      enumerable: true,
      writable: true,
      value: () => {
        this.moleState = 'appeared';
        this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "appeared", {
      enumerable: true,
      writable: true,
      value: () => {
        this.moleState = 'disappearing';
        this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "disappearing", {
      enumerable: true,
      writable: true,
      value: () => {
        this.moleState = 'underground';
        this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "clicked", {
      enumerable: true,
      writable: true,
      value: () => {
        if (this.moleState === 'appeared') {
          this.moleState = 'clicked';
          this.moleFrame = 0;
          score++;
        }
      }
    });
    Object.defineProperty(this, "moleController", {
      enumerable: true,
      writable: true,
      value: () => {
        const randomNum = num => Math.floor(Math.random() * num);

        if (this.moleState === 'underground' && randomNum(10) > 6) {
          this.underground();
        } else if (this.moleState === 'appeared' && randomNum(10) > 6) {
          this.appeared();
        }

        console.log(this.molePosition, this.moleState);
        this.timeController = setTimeout(this.moleController, randomNum(5000));
      }
    });
    Object.defineProperty(this, "timeoutController", {
      enumerable: true,
      writable: true,
      value: () => {
        clearTimeout(this.timeController);
        this.moleState = 'underground';
      }
    });
    Object.defineProperty(this, "molePositionX", {
      enumerable: true,
      writable: true,
      value: mole => (this.canvasWidth / 3 - this.moleWidth) / 2 + this.canvasWidth / 3 * mole[1]
    });
    Object.defineProperty(this, "molePositionY", {
      enumerable: true,
      writable: true,
      value: mole => this.canvasHeight / 5 + ((this.canvasHeight - this.canvasHeight / 3) / 3 - this.moleHeight) / 2 + (this.canvasHeight - this.canvasHeight / 3) / 3 * mole[0]
    });
    Object.defineProperty(this, "mouseClick", {
      enumerable: true,
      writable: true,
      value: (mouseX, mouseY) => {
        const d = this.sketch.dist(mouseX, mouseY, this.molePositionX(this.molePosition) + this.moleWidth / 2, this.molePositionY(this.molePosition) + this.moleHeight / 2);

        if (d < 50) {
          this.clicked();
        }
      }
    });
    this.sketch = sketch;
    this.animation = animation;
    this.molePosition = molePosition;
    this.canvasWidth = 500;
    this.canvasHeight = 700;
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


  draw() {
    switch (this.moleState) {
      case 'underground':
        break;

      case 'appearing':
        this.sketch.image(this.animation.comeOut[this.moleFrame], this.molePositionX(this.molePosition), this.molePositionY(this.molePosition), this.moleWidth, this.moleHeight);
        this.moleFrame++;

        if (this.moleFrame >= this.animation.comeOut.length) {
          this.appearing();
        }

        break;

      case 'appeared':
        this.sketch.image(this.animation.out[this.moleFrame % this.animation.out.length], this.molePositionX(this.molePosition), this.molePositionY(this.molePosition), this.moleWidth, this.moleHeight);
        this.moleFrame++;
        break;

      case 'disappearing':
        this.sketch.image(this.animation.backIn[this.moleFrame], this.molePositionX(this.molePosition), this.molePositionY(this.molePosition), this.moleWidth, this.moleHeight);
        this.moleFrame++;

        if (this.moleFrame >= this.animation.backIn.length) {
          this.disappearing();
        }

        break;

      case 'clicked':
        this.sketch.image(this.animation.clicked[this.moleFrame], this.molePositionX(this.molePosition), this.molePositionY(this.molePosition), this.moleWidth, this.moleHeight);
        this.moleFrame++;

        if (this.moleFrame >= this.animation.clicked.length) {
          this.disappearing();
        }

        break;

      default:
    }
  }

}