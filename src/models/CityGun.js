var _ = require('lodash');

function CityGun(city, frequency) {
    _.extend(this, {
        filter: city,
        frequency: frequency
    });
}

module.exports = CityGun;