"use strict";

exports.batch = void 0;
var _firestore = require("firebase/firestore");
var _core = require("./core.js");
var _firebase = require("./firebase.js");
const batch = (rootDB, options) => {
  (0, _core.assertEnvironment)(options?.as);
  const firebaseBatch = (0, _firestore.writeBatch)(rootDB[_firebase.firestoreSymbol]());
  return Object.assign(() => firebaseBatch.commit(), batchDB(rootDB, firebaseBatch));
};
exports.batch = batch;
function batchDB(rootDB, batch) {
  function convertDB(db) {
    const processedDB = {};
    Object.entries(db).forEach(([alias, collection]) => {
      const readCollection = new Collection(rootDB, batch, collection.path);
      processedDB[alias] = typeof collection === "function" ? new Proxy(() => {}, {
        get: (_target, prop) => readCollection[prop],
        apply: (_target, _prop, [id]) => convertDB(collection(id))
      }) : readCollection;
    });
    return processedDB;
  }
  const filteredDB = {
    ...rootDB
  };
  delete filteredDB.id;
  delete filteredDB.groups;
  return convertDB(filteredDB);
}
class Collection {
  constructor(db, batch, path) {
    this.db = db;
    this.firestore = db[_firebase.firestoreSymbol];
    this.type = "collection";
    this.batch = batch;
    this.path = path;
  }
  set(id, data) {
    const dataToSet = typeof data === "function" ? data((0, _core.writeHelpers)()) : data;
    const _doc = (0, _firestore.doc)(this.firestore(), this.path, id);
    this.batch.set(_doc, (0, _core.unwrapData)(this.firestore, dataToSet));
  }
  upset(id, data) {
    const dataToUpset = typeof data === "function" ? data((0, _core.writeHelpers)()) : data;
    const _doc = (0, _firestore.doc)(this.firestore(), this.path, id);
    this.batch.set(_doc, (0, _core.unwrapData)(this.firestore, dataToUpset), {
      merge: true
    });
  }
  update(id, data) {
    const dataToUpdate = typeof data === "function" ? data((0, _core.updateHelpers)()) : data;
    const _doc = (0, _firestore.doc)(this.firestore(), this.path, id);
    this.batch.update(_doc, (0, _core.unwrapData)(this.firestore, dataToUpdate));
  }
  remove(id) {
    const _doc = (0, _firestore.doc)(this.firestore(), this.path, id);
    this.batch.delete(_doc);
  }
}