var _ = require('lodash');

function IncidentCity(incident, city) {
    _.extend(this, {
        city: city,
        incident: incident.map(function (c) {
            return {
                date: c[0],
                n_injured: c[1],
                n_killed: c[7]
            }
        })
    });
}

module.exports = IncidentCity;