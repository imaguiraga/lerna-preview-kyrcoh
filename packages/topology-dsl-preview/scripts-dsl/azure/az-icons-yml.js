/* eslint-disable no-undef */
const fs = require('fs');
const mkdirp = require('mkdirp');
const yaml = require('js-yaml');

const sets = [
  {
    provider: 'AZURE',
    prefix: 'az',
    path: 'assets/icons/Azure_Public_Service_Icons',
    pattern: '\\d+\\-icon\\-service\\-(.+)(ies|s)?\\.svg',
    kind: 'resource',
    //excludes : ['/CXP','/Azure VMware Solution','/General']
  }

];

// Generate csv from iconSets
//provider, category, product, dsl, isDecorator, kind, tagName, tagName, iconURL, typeURI, docURL

function createAzResource(s, item) {
  let provider = s.provider;

  let category = item.azureCategories.join(',');
  let product = item.title;
  let dsl = s.prefix + '_' + product;
  // Replace special characters
  dsl = dsl.trim().replace(/(-|\s|\(|\)|\+|\\|&)+/g, '_').replace(/_+/g, '_');
  let kind = s.kind;
  let tagName = dsl;
  // imageSrc: ./media/index/iot-solution-accelerators.svg => https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/ + ./media/index/iot-solution-accelerators.svg
  // imageSrc: https://static.docs.com/ui/media/product/azure/iot-hub.svg
  const IMAGE_PREFIX = 'https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/';
  let iconURL = item.imageSrc;
  if (iconURL[0] === '.') {
    iconURL = IMAGE_PREFIX + iconURL;
  }
  let typeURI = '';
  let docURL = item.url;
  // Replace 'md' and 'yml' extensions

  // url: /azure/databricks/ => https://docs.microsoft.com/en-us/ + /azure/databricks/
  // url: machine-learning/index.yml => https://docs.microsoft.com/en-us/azure/ + machine-learning/
  // url: https://docs.microsoft.com/azure-stack/
  const DOC_PREFIX = 'https://docs.microsoft.com/en-us';
  // doesn't starts with https
  if (docURL.indexOf('https://') < 0 && docURL.indexOf('http://') < 0) {
    // docURL = docURL.replace(/(\/(\w|\-)+\.md|\/(\w|\-)+\.yml)$/g,'/');
    if (docURL.indexOf('/azure/') >= 0) {
      docURL = DOC_PREFIX + '/' + docURL;
    } else {
      docURL = DOC_PREFIX + '/azure/' + docURL;
    }

  }

  docURL = docURL.replace(/(\.md|\.yml)$/g, '');

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
  return resource;
}


function azDsl(s) {
  'use strict';

  const fetch = require('node-fetch');

  let promise = new Promise((resolutionFunc, rejectionFunc) => {

    // Parse yaml file https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/index.yml
    // Get document, or throw exception on error
    fetch('https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/index.yml')
      .then(response => response.text())
      .then(function (data) {
        try {
          yaml.loadAll(data, function (doc) {
            let resources = [];
            doc.productDirectory.items.forEach((item) => {
              resources.push(createAzResource(s, item));
            });
            resolutionFunc(resources);
          });
        } catch (e) {
          console.log(e);
        }
      });
  });
  return promise;
}

// Parse categories https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/bread/toc.yml

// Parse yaml file https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/index.yml

// ARM https://docs.microsoft.com/en-us/azure/templates/
// https://docs.microsoft.com/azure/templates/{provider-namespace}/{resource-type}
// https://portal.azure.com/#create/Microsoft.Template/uri/
// https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-linux/azuredeploy.json
// https://azure.microsoft.com/en-us/resources/templates/
// https://github.com/Azure/azure-quickstart-templates
/*
# Card
    - title: Anomaly Detector (Preview)
      summary: Easily add anomaly detection capabilities to your apps
      imageSrc: https://static.docs.com/ui/media/product/azure/anomaly-detector.svg
      azureCategories:
        - ai-machine-learning
      url: cognitive-services/anomaly-detector/index.yml
//*/
// url: /azure/databricks/ => https://docs.microsoft.com/en-us/ + /azure/databricks/
// url: machine-learning/index.yml => https://docs.microsoft.com/en-us/azure/ + machine-learning/
// url: https://docs.microsoft.com/azure-stack/
// imageSrc: ./media/index/iot-solution-accelerators.svg => https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/ + ./media/index/iot-solution-accelerators.svg
// imageSrc: https://static.docs.com/ui/media/product/azure/iot-hub.svg

sets.forEach((s) => {
  azDsl(s).then((resources) => {
    // Generate resources file
    mkdirp.sync('./scripts-dsl/yml/');
    fs.writeFileSync('./scripts-dsl/yml/' + s.provider + '.yml', yaml.dump({ source: s, items: resources }));
  });
});

module.exports = {
  azDsl
};