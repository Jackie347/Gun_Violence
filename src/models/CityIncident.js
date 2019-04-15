var _ = require('lodash');

function CityIncident(city, frequency) {
    _.extend(this, {
        filter: city,
        frequency: frequency
    });
}

module.exports = CityIncident;