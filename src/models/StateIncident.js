var _ = require('lodash');

function StateIncident(state, frequency) {
    _.extend(this, {
        filter: state,
        frequency: frequency
    });
}

module.exports = StateIncident;