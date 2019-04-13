var _ = require('lodash');

function Gun(_node) {
    _.extend(this, _node.properties);

    if (this.id) {
        this.id = this.id.toString();
    }
    if (this.duration) {
        this.duration = this.duration.toNumber();
    }
}

module.exports = Gun;