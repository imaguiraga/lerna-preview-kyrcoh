const sets = [
  {
    provider: "Azure",
    prefix: "az",
    path: "assets/icons/Azure_Public_Service_Icons",  
    pattern : "\\d+\\-icon\\-service\\-(.+)(ies|s)?\\.svg",
    resourceType : "cloud",
    //excludes : ["/CXP","/Azure VMware Solution","/General"]
  },
  {
    provider: "Google Cloud Platform",
    prefix: "gcp",
    path: "assets/icons/GCP Icons/Products and services",
    pattern: "(.*).svg",
    resourceType : "cloud"
  }
];

// Generate csv from iconSets
//provider, category, product, dsl, isDecorator, resourceType, tagName, subType, iconPath, typeURI, docURI
const fs = require('fs');
const { readFileSync, writeFileSync } = fs;
const { resolve, dirname, extname } = require('path');
const nunjucks = require('nunjucks');
const mkdirp = require('mkdirp');
const chalk = require('chalk').default;


function createResource(s,item) {
  let provider = s.provider;
        
  let category = item.azureCategories.join(",");
  let product = item.title;
  let dsl = s.prefix+"_"+product;
  // Replace special characters
  dsl = dsl.replace(/\-|\s+|\(|\)|\+/g,'_');
  let isDecorator = false;
  let resourceType = s.resourceType;
  let tagName = "terminal";
  let subType = dsl;
// imageSrc: ./media/index/iot-solution-accelerators.svg => https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/ + ./media/index/iot-solution-accelerators.svg
// imageSrc: https://static.docs.com/ui/media/product/azure/iot-hub.svg
  const IMAGE_PREFIX = "https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/";
  let iconPath = item.imageSrc;
  if(iconPath[0] === ".") {
    iconPath = IMAGE_PREFIX + iconPath;
  }
  let typeURI = ""; 
  let docURI = item.url;
  // Replace 'md' and 'yml' extensions
  docURI = docURI.replace(/md|\(|\)|\+yml/g,'html');
  // url: /azure/databricks/ => https://docs.microsoft.com/en-us/ + /azure/databricks/
  // url: machine-learning/index.yml => https://docs.microsoft.com/en-us/azure/ + machine-learning/
  // url: https://docs.microsoft.com/azure-stack/
  const DOC_PREFIX = "https://docs.microsoft.com/en-us";
  // doesn't starts with https
  if(docURI.indexOf("https://") < 0 && docURI.indexOf("http://") < 0 ) {
    if(docURI.indexOf("/azure/") >= 0){
      docURI = DOC_PREFIX + "/" + docURI;
    } else {
      docURI = DOC_PREFIX + "/azure/" + docURI;
    }
  }

  console.log(category+ " => " + iconPath + " | "+dsl);

  let resource = {
    provider, 
    category, 
    product,
    dsl, 
    isDecorator, 
    resourceType, 
    tagName, 
    subType, 
    iconPath, 
    typeURI, 
    docURI
  };
  return resource;
}

(function () {
  "use strict";
 
  const fetch = require('node-fetch');
  const yaml = require('js-yaml');
  // Parse yaml file https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/index.yml
  // Get document, or throw exception on error
  fetch("https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/master/articles/index.yml")
  .then(response => response.text())
  .then( function(data) { 
    try {
      const s = sets[0];
      yaml.safeLoadAll(data, function (doc) {
        let resources = [];
        doc.productDirectory.items.forEach((item) => {
          resources.push(createResource(s,item));
        });
        // Generate resources file
        render({ items: resources , ...s, encodeURI },"scripts/templates","scripts/out/"+s.prefix);
      });
    } catch (e) {
        console.log(e);
    }
  });

}()); 

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

const render = (
	/** @type {Object} */ context, 
	/** @type {string} */ templateDir, 
  /** @type {string} */ outputDir
 ) => {

	/** @type {nunjucks.ConfigureOptions} */
	const nunjucksOptions = { 
		trimBlocks: true, 
		lstripBlocks: true, 
		noCache: true, 
		autoescape: false 
	};

	/** @type {nunjucks.Environment} */
  const nunjucksEnv = nunjucks.configure(templateDir, nunjucksOptions);
  // Process all input
  // Process all templates
  fs.readdir(templateDir, function(err, files) {
    console.log(files);

    for (const file of files) {
      const res = nunjucksEnv.render(file, context);
      // Remove Template file extension
      let outputFile = context.prefix + "-" + file.substring(0,file.indexOf(extname(file)));

      if (outputDir) {
        outputFile = resolve(outputDir, outputFile);
        mkdirp.sync(dirname(outputFile));
      }

      console.log(chalk.green('Rendering: ' + file));
      writeFileSync(outputFile, res);
    }
  });
};
