var _ = require('lodash');

function CityChar(city, frequency) {
    _.extend(this, {
        filter: city,
        frequency: frequency
    });
}

module.exports = CityChar;