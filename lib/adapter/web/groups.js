"use strict";

exports.groups = void 0;
var _firestore = require("firebase/firestore");
var _core = require("./core.js");
var _firebase = require("./firebase.js");
const groups = rootDB => {
  const groups = {};
  function extract(db) {
    Object.entries(db).forEach(([path, collection]) => {
      if (path in groups) return;
      groups[path] = new Group(rootDB, path);
      if ("schema" in collection) extract(collection.schema);
    });
  }
  extract(rootDB);
  return groups;
};
exports.groups = groups;
class Group {
  constructor(db, name) {
    this.db = db;
    this.firestore = db[_firebase.firestoreSymbol];
    this.name = name;
    this.query = queries => (0, _core._query)(this.firestore, this.adapter(), [].concat(queries((0, _core.queryHelpers)())));
    this.query.build = () => {
      const queries = [];
      return {
        ...(0, _core.queryHelpers)("builder", queries),
        run: () => (0, _core._query)(this.firestore, this.adapter(), queries)
      };
    };
  }
  all() {
    return (0, _core.all)(this.adapter());
  }
  async count() {
    const snap = await (0, _firestore.getCountFromServer)((0, _firestore.collectionGroup)(this.firestore(), this.name));
    return snap.data().count;
  }
  async sum(field) {
    const snap = await (0, _firestore.getAggregateFromServer)((0, _firestore.collectionGroup)(this.firestore(), this.name), {
      result: (0, _firestore.sum)(field)
    });
    return snap.data().result;
  }
  async average(field) {
    const snap = await (0, _firestore.getAggregateFromServer)((0, _firestore.collectionGroup)(this.firestore(), this.name), {
      result: (0, _firestore.average)(field)
    });
    return snap.data().result;
  }
  as() {
    return this;
  }
  adapter() {
    return {
      db: () => this.db,
      collection: () => (0, _firestore.collectionGroup)(this.firestore(), this.name),
      doc: snapshot => (0, _core.pathToDoc)(this.db, snapshot.ref.path, (0, _core.wrapData)(this.db, snapshot.data())),
      request: () => ({
        path: this.name,
        group: true
      })
    };
  }
}