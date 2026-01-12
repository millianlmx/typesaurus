"use strict";

exports.firestore = firestore;
exports.firestoreSymbol = void 0;
var _app = require("firebase-admin/app");
var _firestore = require("firebase-admin/firestore");
const firestoreSymbol = exports.firestoreSymbol = Symbol();
function firestore(options) {
  const appName = options?.server?.app || options?.app;
  const app = (0, _app.getApp)(appName);
  if (options?.server?.preferRest) {
    return (0, _firestore.initializeFirestore)(app, {
      preferRest: options?.server?.preferRest
    });
  } else {
    return (0, _firestore.getFirestore)(app, options?.database);
  }
}