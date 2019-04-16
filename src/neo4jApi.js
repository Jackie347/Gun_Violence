require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
var State = require('./models/State');
var City = require('./models/City');
var Gun = require('./models/Gun');
var Incident= require('./models/Incident');
var Characteristic = require('./models/Characteristic');
var StateGun = require('./models/StateGun');
var CityGun = require('./models/CityGun');
var StateChar = require('./models/StateChar');
var CityChar = require('./models/CityChar');
var GunCount = require('./models/GunCount');
var CharCount = require('./models/CharCount');
var StateIncident = require('./models/StateIncident');
var CityIncident = require('./models/CityIncident');
var _ = require('lodash');

var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("admin", "admin"));

// get incidents
function getIncident(city, state, order, limit) {
    var session = driver.session();
    if (city.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
        return session
            .run(
                "MATCH (incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                WHERE state.state =~ {state} \
                RETURN incident \
                ORDER BY incident." + order + " DESC"
                + " LIMIT {limit}", {city: '(?i).*' + city + '.*', state: '(?i).*' + state + '.*', order: order, limit: limit})
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
    } else if (state.replace(/(^\s*)|(\s*$)/g, "").length ==0) {
        return session
            .run(
                "MATCH (incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                WHERE city_or_county.city_or_county =~ {city}\
                RETURN incident \
                ORDER BY incident." + order + " DESC"
                + " LIMIT {limit}",{city: '(?i).*' + city + '.*', state: '(?i).*' + state + '.*', order: order, limit: limit})
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
    } else {
        return session
            .run(
                "MATCH (incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                WHERE city_or_county.city_or_county =~ {city} AND state.state =~ {state}\
                RETURN incident \
                ORDER BY incident." + order + " DESC"
                + " LIMIT {limit}", {city: '(?i).*' + city + '.*', state: '(?i).*' + state + '.*', order: order, limit: limit})
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
}

// get gun type list
function getGun() {
    var session = driver.session();
    return session
        .run(
            "MATCH (gun:gun)\
            RETURN gun")
        .then(result => {
            session.close();

            return result.records.map(record => {
                //console.log("gun:" + record.get('gun'));
                return new Gun(record.get('gun'));
            });
        })
        .catch(error => {
            session.close();
            throw error;
        });
}

// get frequency of one gun type
function getGunFrequency(gun, filter, limit) {
    var session = driver.session();
    if (filter == 'city') {
        return session
            .run(
                "MATCH(gun:gun {gun: {gun}}) \
                OPTIONAL MATCH (gun)-[:USED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county) \
                RETURN city_or_county.city_or_county AS city, city_or_county.state AS state, COUNT(incident) AS frequency \
                ORDER BY frequency DESC \
                LIMIT {limit}", {gun:gun, limit:limit})
            .then(result => {
                session.close();
                return result.records.map(record => {
                    return new CityGun(record.get('city'), record.get('state'), record.get('frequency'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    } else {
        return session
            .run(
                "MATCH(gun:gun {gun: {gun}}) \
                OPTIONAL MATCH (gun)-[:USED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state) \
                RETURN state.state AS state, COUNT(incident) AS frequency \
                ORDER BY frequency DESC \
                LIMIT {limit}", {gun:gun, limit:limit})
            .then(result => {
                session.close();
                return result.records.map(record => {
                    return new StateGun(record.get('state'), record.get('frequency'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    }
}

// get gun counts
function getGunCount(city,state){
    var session = driver.session();
    if (city.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
        return session
            .run(
                "MATCH (gun:gun)-[:USED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                    WHERE state.state =~ {state}\
                    RETURN gun.gun AS gun, COUNT(incident) AS count\
                    ORDER BY count DESC", {state: '(?i).*' + state + '.*'})
            .then(result => {
                session.close();

                return result.records.map(record => {
                    return new GunCount(record.get('gun'), record.get('count'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    } else if (state.replace(/(^\s*)|(\s*$)/g, "").length ==0) {
        return session
            .run(
                "MATCH (gun:gun)-[:USED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                    WHERE city_or_county.city_or_county =~ {city}\
                    RETURN gun.gun AS gun, COUNT(incident) AS count\
                    ORDER BY count DESC", {city: '(?i).*' + city + '.*'})
            .then(result => {
                session.close();

                return result.records.map(record => {
                    return new GunCount(record.get('gun'), record.get('count'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    } else {
        return session
            .run(
                "MATCH (gun:gun)-[:USED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                    WHERE city_or_county.city_or_county =~ {city} AND state.state =~ {state}\
                    RETURN gun.gun AS gun, COUNT(incident) AS count\
                    ORDER BY count DESC", {city: '(?i).*' + city + '.*', state: '(?i).*' + state + '.*'})
            .then(result => {
                session.close();

                return result.records.map(record => {
                    //console.log(record.get('gun'));
                    return new GunCount(record.get('gun'), record.get('count'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    }

}

// get characteristic type list
function getChar() {
    var session = driver.session();
    return session
        .run(
            "MATCH (characteristic:characteristic)\
            RETURN characteristic")
        .then(result => {
            session.close();

            return result.records.map(record => {
                //console.log("gun:" + record.get('gun'));
                return new Characteristic(record.get('characteristic'));
            });
        })
        .catch(error => {
            session.close();
            throw error;
        });
}

// get gun frequency by city or state
function getCharFrequency(char, filter, limit) {
    var session = driver.session();
    if (filter == 'city') {
        return session
            .run(
                "MATCH(ch:characteristic{characteristic:{char}})\
                OPTIONAL MATCH (char)-[:PARTICIPATED_IN]->(i:incident)-[:HAPPENED_IN]->(c:city_or_county)\
                RETURN c.city_or_county AS city, c.state AS state, COUNT(i) AS frequency \
                ORDER BY frequency DESC \
                LIMIT {limit}", {char: char, limit: limit})
            .then(result => {
                session.close();
                return result.records.map(record => {
                    return new CityChar(record.get('city'), record.get('state'), record.get('frequency'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    } else {
        return session
            .run(
                "MATCH(char:characteristic {characteristic: {char}})\
                OPTIONAL MATCH (char)-[:PARTICIPATED_IN]->(i:incident)-[:HAPPENED_IN]->(c:city_or_county)-[:BELONGS_TO]->(s:state)\
                RETURN s.state AS state, COUNT(i) AS frequency \
                ORDER BY frequency DESC \
                LIMIT {limit}", {char: char, limit: limit})
            .then(result => {
                session.close();
                return result.records.map(record => {
                    return new StateChar(record.get('state'), record.get('frequency'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    }
}

// get char count by city or state
function getCharCount(city,state){
    var session = driver.session();
    if (city.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
        return session
            .run(
                "MATCH (char:characteristic)-[:PARTICIPATED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                    WHERE state.state =~ {state}\
                    RETURN char.characteristic AS char, COUNT(incident) AS count\
                    ORDER BY count DESC", {state: '(?i).*' + state + '.*'})
            .then(result => {
                session.close();

                return result.records.map(record => {
                    return new CharCount(record.get('char'), record.get('count'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    } else if (state.replace(/(^\s*)|(\s*$)/g, "").length ==0) {
        return session
            .run(
                "MATCH (char:characteristic)-[:PARTICIPATED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                    WHERE city_or_county.city_or_county =~ {city}\
                    RETURN char.characteristic AS char, COUNT(incident) AS count\
                    ORDER BY count DESC", {city: '(?i).*' + city + '.*'})
            .then(result => {
                session.close();

                return result.records.map(record => {
                    return new CharCount(record.get('char'), record.get('count'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    } else {
        return session
            .run(
                "MATCH (char:characteristic)-[:PARTICIPATED_IN]->(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state)\
                    WHERE city_or_county.city_or_county =~ {city} AND state.state =~ {state}\
                    RETURN char.characteristic AS char, COUNT(incident) AS count\
                    ORDER BY count DESC", {city: '(?i).*' + city + '.*', state: '(?i).*' + state + '.*'})
            .then(result => {
                session.close();

                return result.records.map(record => {
                    //console.log(record.get('gun'));
                    return new CharCount(record.get('char'), record.get('count'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    }

}

// get incident frequency
// get gun frequency by city or state
function getIncidentFrequency(filter, limit) {
    var session = driver.session();
    if (filter == 'city') {
        return session
            .run(
                "MATCH(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state) \
                RETURN city_or_county.city_or_county AS city, city_or_county.state AS state, count(incident.id) AS frequency \
                ORDER BY frequency DESC\
                LIMIT {limit}",{limit:limit})
            .then(result => {
                session.close();
                return result.records.map(record => {
                    return new CityIncident(record.get('city'), record.get('state'), record.get('frequency'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    } else {
        return session
            .run(
                "MATCH(incident:incident)-[:HAPPENED_IN]->(city_or_county:city_or_county)-[:BELONGS_TO]->(state:state) \
                RETURN state.state AS state, count(incident.id) AS frequency \
                ORDER BY frequency DESC \
                LIMIT {limit}",{limit:limit})
            .then(result => {
                session.close();
                return result.records.map(record => {
                    return new StateIncident(record.get('state'), record.get('frequency'));
                });
            })
            .catch(error => {
                session.close();
                throw error;
            });
    }
}

/*
function getGraph() {
    var session = driver.session();
    return session
        .run(
            'MATCH (m:Movie)<-[:ACTED_IN]-(a:Person)\
            RETURN m.title AS movie, collect(a.name) AS cast\
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
}*/

exports.getIncident = getIncident;
exports.getGun = getGun;
//exports.getGraph = getGraph;
exports.getGunFrequency = getGunFrequency;
exports.getGunCount = getGunCount;
exports.getChar = getChar;
exports.getCharFrequency = getCharFrequency;
exports.getCharCount = getCharCount;
exports.getIncidentFrequency = getIncidentFrequency;


