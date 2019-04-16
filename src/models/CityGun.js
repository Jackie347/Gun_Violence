var _ = require('lodash');

function CityGun(city, state, frequency,) {
    _.extend(this, {
        city: city,
        state: state,
        frequency: frequency
    });
}

module.exports = CityGun;