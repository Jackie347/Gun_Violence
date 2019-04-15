var _ = require('lodash');

function CharCount(char, count) {
    _.extend(this, {
        char: char,
        count: count
    });
}

module.exports = CharCount;