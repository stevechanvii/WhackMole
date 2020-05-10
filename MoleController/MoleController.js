/**
 * 0 = none
 * 1 = ready to come out
 * 2 = already come out
 * 3 = back to hole
 * 4 = been clicked
 */
let mole = 0;

const MoleController = () => {
    const randomNum = (num) => Math.floor(Math.random() * num);

    if (mole === 0) {
        if (randomNum(2)) {
            mole = 1;
        }
    } else if (mole === 2) {
        mole = 3;
    }

    setTimeout(MoleController, randomNum(5000));
};
