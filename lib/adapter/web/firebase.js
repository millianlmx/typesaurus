"use strict";

exports.firestore = firestore;
exports.firestoreSymbol = void 0;
var _app = require("firebase/app");
var _firestore = require("firebase/firestore");
const firestoreSymbol = exports.firestoreSymbol = Symbol();
function firestore(options) {
  const appName = options?.client?.app || options?.app;
  const app = (0, _app.getApp)(appName);
  return (0, _firestore.getFirestore)(app, options?.database);
}