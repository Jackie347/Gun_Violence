var _ = require('lodash');

function StateCity(state, city) {
    _.extend(this, {
        state: name,
        city: city.map(function (c) {
            return {
                city_or_county: c[0]
            }
        })
    });
}

module.exports = StateCity;
