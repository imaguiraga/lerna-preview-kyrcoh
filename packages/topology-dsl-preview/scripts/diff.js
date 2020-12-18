const azicons1 = require('./out/Azure_Products_Icons/Azure_Products_Icons-map.js').default;
const azicons2 = require('./out/Azure_Public_Service_Icons/Azure_Public_Service_Icons-map.js').default;

let result = [];
for (let key of azicons2.keys()) {
  if (azicons1.has(key)) {
    console.log(key);
    result.push(key);
  }
}
console.log(`${result.length} out of ${azicons2.size} `);