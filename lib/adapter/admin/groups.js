"use strict";

exports.groups = void 0;
var _firestore = require("firebase-admin/firestore");
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
    this.query = queries => (0, _core.query)(this.firestore, this.adapter(), [].concat(queries((0, _core.queryHelpers)())));
    this.query.build = () => {
      const queries = [];
      return {
        ...(0, _core.queryHelpers)("builder", queries),
        run: () => (0, _core.query)(this.firestore, this.adapter(), queries)
      };
    };
  }
  all() {
    return (0, _core.all)(this.adapter());
  }
  async count() {
    const snap = await this.adapter().collection().count().get();
    return snap.data().count;
  }
  async sum(field) {
    const snap = await this.adapter().collection().aggregate({
      result: _firestore.AggregateField.sum(field)
    }).get();
    return snap.data().result;
  }
  async average(field) {
    const snap = await this.adapter().collection().aggregate({
      result: _firestore.AggregateField.average(field)
    }).get();
    return snap.data().result;
  }
  as() {
    return this;
  }
  adapter() {
    return {
      db: () => this.db,
      collection: () => this.firestore().collectionGroup(this.name),
      doc: snapshot => (0, _core.pathToDoc)(this.db, snapshot.ref.path, (0, _core.wrapData)(this.db, snapshot.data())),
      request: () => ({
        path: this.name,
        group: true
      })
    };
  }
}