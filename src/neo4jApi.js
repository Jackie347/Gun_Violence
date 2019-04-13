require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
var State = require('./models/State');
var City = require('./models/City');
var Gun = require('./models/Gun');
var Incident= require('./models/Incident');
var Characteristic = require('./models/Characteristic');
var IncidentCity= require('./models/IncidentCity');
var _ = require('lodash');

var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("admin", "admin"));

function searchCity(queryString) {
    var session = driver.session();
    return session
        .run(
            'MATCH (city:city_or_county) \
            WHERE city.city_or_county =~ {city} \
            RETURN city',
            {city: '(?i).*' + queryString + '.*'}
        )
        .then(result => {
            session.close();
            return result.records.map(record => {
                return new City(record.get('city'));
            });
        })
        .catch(error => {
            session.close();
            throw error;
        });
}

 function getIncident(queryString) {
  var session = driver.session();
  return session
    .run(
      "MATCH (incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county) \
                 WHERE city_or_county.city_or_county =~ {city} \
                 RETURN incident", {city: '(?i).*' + queryString + '.*'})
      .then(result => {
          session.close();
          return result.records.map(record => {
              return new Incident(record.get('incident'));
          });
      })
      .catch(error => {
          session.close();
          throw error;
      });
}

function getGraph() {
    var session = driver.session();
    return session.run(
        'MATCH (m:Movie)<-[:ACTED_IN]-(a:Person) \
        RETURN m.title AS movie, collect(a.name) AS cast \
        LIMIT {limit}', {limit: 100})
        .then(results => {
            session.close();
            var nodes = [], rels = [], i = 0;
            results.records.forEach(res => {
                nodes.push({title: res.get('movie'), label: 'movie'});
                var target = i;
                i++;

                res.get('cast').forEach(name => {
                    var actor = {title: name, label: 'actor'};
                    var source = _.findIndex(nodes, actor);
                    if (source == -1) {
                        nodes.push(actor);
                        source = i;
                        i++;
                    }
                    rels.push({source, target})
                })
            });

            return {nodes, links: rels};
        });
}

exports.searchCity = searchCity;
exports.getIncident = getIncident;
exports.getGraph = getGraph;

