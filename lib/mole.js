"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Mole = /*#__PURE__*/function () {
  function Mole(sketch, animation, molePosition) {
    var _this = this;

    _classCallCheck(this, Mole);

    Object.defineProperty(this, "underground", {
      enumerable: true,
      writable: true,
      value: function value() {
        _this.moleState = 'appearing';
        _this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "appearing", {
      enumerable: true,
      writable: true,
      value: function value() {
        _this.moleState = 'appeared';
        _this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "appeared", {
      enumerable: true,
      writable: true,
      value: function value() {
        _this.moleState = 'disappearing';
        _this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "disappearing", {
      enumerable: true,
      writable: true,
      value: function value() {
        _this.moleState = 'underground';
        _this.moleFrame = 0;
      }
    });
    Object.defineProperty(this, "clicked", {
      enumerable: true,
      writable: true,
      value: function value() {
        if (_this.moleState === 'appeared') {
          _this.moleState = 'clicked';
          _this.moleFrame = 0;
          score++;
        }
      }
    });
    Object.defineProperty(this, "moleController", {
      enumerable: true,
      writable: true,
      value: function value() {
        var randomNum = function randomNum(num) {
          return Math.floor(Math.random() * num);
        };

        if (_this.moleState === 'underground' && randomNum(10) > 6) {
          _this.underground();
        } else if (_this.moleState === 'appeared' && randomNum(10) > 6) {
          _this.appeared();
        }

        console.log(_this.molePosition, _this.moleState);
        _this.timeController = setTimeout(_this.moleController, randomNum(5000));
      }
    });
    Object.defineProperty(this, "timeoutController", {
      enumerable: true,
      writable: true,
      value: function value() {
        clearTimeout(_this.timeController);
        _this.moleState = 'underground';
      }
    });
    Object.defineProperty(this, "molePositionX", {
      enumerable: true,
      writable: true,
      value: function value(mole) {
        return (_this.canvasWidth / 3 - _this.moleWidth) / 2 + _this.canvasWidth / 3 * mole[1];
      }
    });
    Object.defineProperty(this, "molePositionY", {
      enumerable: true,
      writable: true,
      value: function value(mole) {
        return _this.canvasHeight / 5 + ((_this.canvasHeight - _this.canvasHeight / 3) / 3 - _this.moleHeight) / 2 + (_this.canvasHeight - _this.canvasHeight / 3) / 3 * mole[0];
      }
    });
    Object.defineProperty(this, "mouseClick", {
      enumerable: true,
      writable: true,
      value: function value(mouseX, mouseY) {
        var d = _this.sketch.dist(mouseX, mouseY, _this.molePositionX(_this.molePosition) + _this.moleWidth / 2, _this.molePositionY(_this.molePosition) + _this.moleHeight / 2);

        if (d < 50) {
          _this.clicked();
        }
      }
    });
    this.sketch = sketch;
    this.animation = animation;
    this.molePosition = molePosition;
    this.canvasWidth = sketch.displayWidth < 700 ? sketch.displayWidth : 500;
    this.canvasHeight = sketch.displayWidth < 700 ? sketch.displayHeight - 80 : 700;
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


  _createClass(Mole, [{
    key: "draw",
    value: function draw() {
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
          console.log('Nothing');
      }
    }
  }]);

  return Mole;
}();