/* eslint-disable no-undef */
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const yaml = require('js-yaml');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const SET = {
  provider: 'GCP',
  prefix: 'gcp',
  path: 'scripts-dsl/gcp/gcp-products.xml',
  pattern: null,
  kind: 'resource'
};

fs.readFile(SET.path, 'utf-8', (err, data) => {
  if (err) throw err;
  //console.log(data);

  var node = null;
  var xml = data;
  var doc = new dom().parseFromString(xml)
  var result = xpath.evaluate(
    "//ul[contains(@class,'devsite-tabs-dropdown-section')]",            // xpathExpression
    doc,                        // contextNode
    null,                       // namespaceResolver
    xpath.XPathResult.ANY_TYPE, // resultType
    null                        // result
  )

  node = result.iterateNext();
  let category = null;
  let resources = [];
  while (node) {
    var items = xpath.select("./li/a", node);

    var item = items[0];
    if (item) {
      //console.log("item: " + item.toString());
      let trackName = item.getAttribute('track-name');
      let trackMetadataHref = item.getAttribute('track-metadata-href');
      if (node.getAttribute('class').indexOf('devsite-nav-title-heading') >= 0) {
        console.log("Category Node: " + trackName);
        category = trackName;
      } else {
        console.log("  Product Node: " + trackName);
        var dsl = SET.prefix + '_' + trackName.trim().replace(/(-|\s|\(|\)|\+|\\|&)+/g, '_').replace(/_+/g, '_');
        var resource = {
          provider: SET.provider,
          category: category,
          product: trackName,
          dsl: dsl,
          kind: SET.kind,
          tagName: dsl,
          iconURL: xpath.select('string(./div/img/@src)', item),
          typeURI: null,
          docURL: trackMetadataHref
        };
        console.log(resource);
        resources.push(resource);
      }

    }

    node = result.iterateNext();
  }//*/

  mkdirp.sync('./scripts-dsl/yml/');
  fs.writeFileSync('./scripts-dsl/yml/' + SET.provider + '.yml', yaml.dump({ source: SET, items: resources }));

});