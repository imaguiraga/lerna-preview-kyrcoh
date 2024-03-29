/* eslint-disable no-undef */
const sets = [
  /*
  {
    provider: 'AZURE',
    prefix: 'az',
    path: 'assets/icons/Azure_Public_Service_Icons',
    pattern: '\\d+\\-icon\\-service\\-(.+)(ies|s)?\\.svg',
    kind: 'resource',
    //excludes : ['/CXP','/Azure VMware Solution','/General']
  },//*/
  {
    provider: 'GCP',
    prefix: 'gcp',
    path: 'assets/icons/GCP Icons/Products and services',
    pattern: '(?<product>.*).svg',
    kind: 'resource'
  }
];

// Generate csv from iconSets
//provider, category, product, dsl, isDecorator, kind, tagName, tagName, iconURL, typeURI, docURL
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const yaml = require('js-yaml');

function cloudDsl(s) {
  'use strict';
  var walk = require('walk');
  var path = require('path');
  let resources = [];

  // Pattern
  let rex = new RegExp(s.pattern);
  let options = {
    filters: s.excludes
  };

  let promise = new Promise((resolutionFunc, rejectionFunc) => {
    let walker = walk.walk('public/' + s.path, options);

    walker.on('file', function (root, fileStats, next) {
      let match = fileStats.name.match(rex);
      if (match != null) {

        let provider = s.provider;

        let category = path.basename(root);
        let product = match.groups.product;
        let dsl = s.prefix + '_' + product;
        // Replace special characters
        dsl = dsl.trim().replace(/(-|\s|\(|\)|\+|\\|&)+/g, '_').replace(/_+/g, '_');
        let kind = s.kind;
        let tagName = dsl;
        let iconURL = path.posix.join(s.path, category, fileStats.name);
        let typeURI = '';
        let docURL = '';

        console.log(category + ' => ' + iconURL + ' | ' + dsl);

        let resource = {
          provider,
          category,
          product,
          dsl,
          kind,
          tagName,
          iconURL,
          typeURI,
          docURL
        };
        // Add resource
        resources.push(resource);
      }

      next();

    });

    walker.on('errors', function (root, nodeStatsArray, next) {
      next();
    });

    walker.on('end', function () {
      console.log('all done');
      // Generate resources file
      resolutionFunc(resources);
    });
  });

  return promise;
}

sets.forEach((s) => {
  cloudDsl(s).then((resources) => {
    // Generate resources file
    mkdirp.sync('./scripts-dsl/yml/');
    fs.writeFileSync('./scripts-dsl/yml/' + s.provider + '.yml', yaml.dump({ source: s, items: resources }));
  });
});

module.exports = {
  cloudDsl
};