"use strict";

/**
 *
 * const angle = getAngle({x: x1 - x3, y: y1 - y3}, {x: x2 - x3, y: y2 - y3});
 *
 * @param {*} param0
 * @param {*} param1
 */
var getAngle = function getAngle(a, b, c) {
  var x1 = a[0] - b[0];
  var y1 = a[1] - b[1];
  var x2 = b[0] - c[0];
  var y2 = b[1] - c[1];
  var dot = x1 * x2 + y1 * y2;
  var det = x1 * y2 - y1 * x2;
  var angle = Math.atan2(det, dot) / Math.PI * 180;
  return (angle + 360) % 360;
};