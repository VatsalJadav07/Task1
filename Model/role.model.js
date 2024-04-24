const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true
    }
});

const rolemodel = mongoose.model('Role', roleSchema);

module.exports = rolemodel;