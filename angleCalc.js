/**
 *
 * const angle = getAngle({x: x1 - x3, y: y1 - y3}, {x: x2 - x3, y: y2 - y3});
 *
 * @param {*} param0
 * @param {*} param1
 */
const getAngle = (a, b, c) => {
    const x1 = a[0] - b[0];
    const y1 = a[1] - b[1];
    const x2 = b[0] - c[0];
    const y2 = b[1] - c[1];
    const dot = x1 * x2 + y1 * y2;
    const det = x1 * y2 - y1 * x2;
    const angle = (Math.atan2(det, dot) / Math.PI) * 180;
    return (angle + 360) % 360;
};
