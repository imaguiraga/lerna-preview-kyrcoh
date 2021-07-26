System.register(["topology-dsl-core"], function (exports_1, context_1) {
  "use strict";
  var topology_dsl_core_1, path1, path2;
  var __moduleName = context_1 && context_1.id;
  return {
      setters: [
          function (topology_dsl_core_1_1) {
              topology_dsl_core_1 = topology_dsl_core_1_1;
          }
      ],
      execute: function () {
          exports_1("path1", path1 = topology_dsl_core_1.sequence("c", "d")._in_("a", "b")._out_("e", "f"));
          exports_1("path2", path2 = topology_dsl_core_1.choice("c", "d")._out_("e", "f"));
      }
  };
});