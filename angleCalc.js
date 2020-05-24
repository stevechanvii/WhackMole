/**
 *
 * const angle = getAngle({x: x1 - x3, y: y1 - y3}, {x: x2 - x3, y: y2 - y3});
 *
 * @param {*} param0
 * @param {*} param1
 */
const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
    const dot = x1 * x2 + y1 * y2;
    const det = x1 * y2 - y1 * x2;
    const angle = (Math.atan2(det, dot) / Math.PI) * 180;
    return (angle + 360) % 360;
};
