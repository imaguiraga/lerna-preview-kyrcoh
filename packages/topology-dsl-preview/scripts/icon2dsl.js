const iconSets = [
  {
    "provider": "Azure",
    "prefix": "az",
    "path": "icons/Azure_Public_Service_Icons",  
    "pattern" : "\\d+\\-icon\\-service\\-(.+)(ies|s)?\\.svg",
    "resourceType" : "cloud"
  },
  {
    "provider": "Google Cloud Platform",
    "prefix": "gcp",
    "path": "icons/GCP Icons/Products and services",
    "pattern": "(.*).svg",
    "resourceType" : "cloud"
  }
];

// Generate csv from iconSets
//provider, category, dsl, isDecorator, resourceType, tagName, subType, iconPath, typeURI, docURI

(function () {
  //"use strict";
 
  var walk = require('walk');
  var fs = require('fs');
  var path = require('path');
  var walker;
  let options = {
    filters: ["Temp", "_Temp"]
  };

  let resources = [];

  iconSets.forEach((s) => {
    // Pattern
    let rex = new RegExp(s.pattern);
    walker = walk.walk("public/"+s.path, options);
 
    walker.on("file", function (root, fileStats, next) {
      let found = fileStats.name.match(rex);
      if(found != null){
        
        let provider = s.provider;
        let category = path.basename(root);
        let dsl = s.prefix+"_"+found[1];
        dsl = dsl.replace(/\-|\s+/g,'_');
        let isDecorator = false;
        let resourceType = s.resourceType;
        let tagName = "terminal";
        let subType = dsl;

        let iconPath = path.posix.join(s.path,category,fileStats.name);
        let typeURI = ""; 
        let docURI = "";

        console.log(category+ " => " + iconPath + " | "+dsl);

        let resource = {
          provider, 
          category, 
          dsl, 
          isDecorator, 
          resourceType, 
          tagName, 
          subType, 
          iconPath, 
          typeURI, 
          docURI
        };
        // Add resource
        resources.push(resource);
      }

      next();
      /*
      fs.readFile(fileStats.name, function () {
        // doStuff
        next();
      });//*/
    });
   
    walker.on("errors", function (root, nodeStatsArray, next) {
      next();
    });
   
    walker.on("end", function () {
      console.log("all done");
      // Save resources as csv
      const fastcsv = require('fast-csv');
      const fs = require('fs');
      const ws = fs.createWriteStream("public/out.csv");
      fastcsv
        .write(resources, { headers: true })
        .pipe(ws);
    });

  });
  
}());