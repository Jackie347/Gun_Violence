var _ = require('lodash');

function StateGun(state, frequency) {
    _.extend(this, {
        filter: state,
        frequency: frequency
    });
}

module.exports = StateGun;