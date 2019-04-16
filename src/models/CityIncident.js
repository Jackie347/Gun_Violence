var _ = require('lodash');

function CityIncident(city, state, frequency) {
    _.extend(this, {
        city: city,
        state: state,
        frequency: frequency
    });
}

module.exports = CityIncident;