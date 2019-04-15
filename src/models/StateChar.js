var _ = require('lodash');

function StateChar(state, frequency) {
    _.extend(this, {
        filter: state,
        frequency: frequency
    });
}

module.exports = StateChar;