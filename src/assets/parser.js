// boob
const cases = require('./data/cases.json');
const area = require('./data/area.json');

let props = {};

area.features.forEach(({properties: p}) => {
  props[p["AREA_NAME"].split('(')[0].trim()] = { 
    shapeArea: p["Shape__Area"],
    shapeLength: p["Shape__Length"],
    numCases: 0
  }
});

cases.forEach(c => {
  if(c["Outcome"] !== "ACTIVE" || !c["Neighbourhood Name"] || !props[c["Neighbourhood Name"]])
    return;
  props[c["Neighbourhood Name"]].numCases++;
});


props = Object.keys(props).map(p => {
  return {
    name: p,
    ...props[p],
    fillOpacity: props[p].numCases / 266,
  }
});


area.features = area.features.map((f, i) => {
 return {
   ...f,
   properties: props[i]
 }
}).sort((a, b) => a.properties.numCases - b.properties.numCases);

console.log(JSON.stringify(area));
// node parser.js > data.json