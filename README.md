# WhackMole

A whack a mole game developed by JavaScript (P5.js) and Tensorflow PoseNet.

## Getting Started

[Live Demo](https://stevechanvii.github.io/WhackMole/) (Please use Google Chrome)

![game gif](./assets/game.gif)

## How to play

-   Use pose estimation (Arms up and down to hit 1st or 3rd columns, clap your hands to hit the middle column)
-   Mouse click (If you are using mobile devices, pose estimation will be disabled)

## Deployment

You need to install a local server environment before runing this project, such as [live-server](https://github.com/tapio/live-server#readme).

```
live-server
```

Export with Babel

```
npx babel src --out-dir lib --ignore "src/ml5.min.js","src/p5.min.js"
```

If you are hosting on a real server, https is required since it needs live video stream.

## Built With

-   [P5.js](https://p5js.org) - The web framework used
-   [Tensorflow](https://www.tensorflow.org) - Pose estimation

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

-   **Danyang Chen** - _Initial work_ -

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

-   The sprites and other image assets are found in [lepunk's repo](https://github.com/lepunk/react-native-videos/tree/whack-a-mole/WhackAMole/assets/img)
