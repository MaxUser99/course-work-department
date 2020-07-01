const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const credentialsSchema = new mongoose.Schema({
    login: String,
    password: String,
    allowEdit: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'Workers' },
});

const CredentialsModel = mongoose.model('Credentials', credentialsSchema);

module.exports = CredentialsModel;
