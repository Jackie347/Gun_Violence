var _ = require('lodash');

function GunCount(gun, count) {
    _.extend(this, {
        gun: gun,
        count: count
    });
}

module.exports = GunCount;