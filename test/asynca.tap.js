'use strict';

var tap             = require('tap')
  , test            = tap.test
  , createNamespace = require('../context.js').createNamespace
  ;
  test("continuation-local state with promises", function (t) {
    t.plan(1);
  t.test("async await", function (t) {
  if (!global.Promise) return t.end();

  var namespace = createNamespace('namespace');
  namespace.run(async function (context) {
    namespace.set('test', 999);
    t.equal(namespace.get('test'), 999, "state has been mutated");

    const pr = await Promise.resolve()
    t.equal(namespace.get('test'), 999, "mutated state has persisted to first continuation");

    await Promise.resolve()

    t.equal(namespace.get('test'), 999,
            "mutated state has persisted to second continuation");
    const test = () => {
      t.equal(namespace.get('test'), 999,
      "mutated state has persisted to second continuation");
      return Promise.resolve().then(() => {
        t.equal(namespace.get('test'), 999,
        "mutated state has persisted to second continuation");
      })
    }
    await test()
    namespace.run(function () {
      // t.equal(namespace.get("value"), 999, "lookup will check enclosing context");
      namespace.set("value", 2);
      t.equal(namespace.get("value"), 2, "setting works on top-level context");

      namespace.run(function () {
        t.equal(namespace.get("value"), 2, "lookup will check enclosing context");
        namespace.set("value", 3);
        t.equal(namespace.get("value"), 3, "setting works on nested context");
      });

      t.equal(namespace.get("value"), 2,
              "should revert to value set in top-level context");
    });

    t.equal(namespace.get('test'), 999,
    "mutated state has persisted to second continuation");
    t.end();
    return pr
  });
});
});