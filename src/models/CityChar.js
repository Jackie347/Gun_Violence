var _ = require('lodash');

function CityChar(city, state, frequency) {
    _.extend(this, {
        city: city,
        state: state,
        frequency: frequency
    });
}

module.exports = CityChar;