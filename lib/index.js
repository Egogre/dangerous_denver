'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');

let trafficData = fs.readFileSync('./data/traffic-accidents.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','));

let columnHeader = _.first(trafficData);
let columnData = _.rest(trafficData);

let crimeColumnData = fs.readFileSync('./data/crime.csv')
                    .toString()
                    .split('\r\n')
                    .map(row => row.split(','));

let crimeHeader = _.first(crimeColumnData);
let crimeData = _.rest(crimeColumnData);

let parsedAccidentData = columnData.map(incident => toObject(incident));
let parsedCrimeData = filterCrime(columnData.map(incident => toObject(incident)));

function toObject(incident) {
  var obj = {};
  for (var i = 0; i < incident.length; ++i) {
    if (i === 5 || i === 9 || i === 16) {
      obj[columnHeader[i]] = incident[i];
    }
  }
  return obj;
}

function filterCrime(data) {
  return data.filter(function(record) {
    return record.OFFENSE_CATEGORY_ID !== 'traffic-accident';
  });
}

var incidentsByIntersection = _.countBy(parsedAccidentData, 'INCIDENT_ADDRESS');
var pairedIncidentsByIntersection = _.pairs(incidentsByIntersection);
var mostDangerousIntersections = _.sortBy(pairedIncidentsByIntersection, function(n) { return n[1]; });

var incidentsByNeighborhood = _.countBy(parsedAccidentData, 'NEIGHBORHOOD_ID');
var pairedIncidentsByNeighborhood = _.pairs(incidentsByNeighborhood);
var mostDangerousNeighborhoods = _.sortBy(pairedIncidentsByNeighborhood, function(n) { return n[1]; });

var crimeByNeighborhood = _.countBy(parsedCrimeData, "NEIGHBORHOOD_ID");
var pairedCrimeByNeighborhood = _.pairs(crimeByNeighborhood);
var mostCrimeNeighborhoods = _.sortBy(pairedCrimeByNeighborhood, function(n) { return n[1]; });

console.timeEnd('entire process');

console.log(mostCrimeNeighborhoods);
