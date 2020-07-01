const CredentialsModal = require('../models/CredentialsModel');
const { apiEndpoints } = require('easy-mern-stack-shared');
const bcrypt = require('bcrypt');

const registerApis = app => {
    app.post(apiEndpoints.app.login, async (req, res) => {
        const { body: { login, password }} = req;

        const cursor = CredentialsModal.find({ login }).cursor();

        for (let user = await cursor.next(); user !== null; user = await cursor.next()) {
            const passMatch = await bcrypt.compare(password, user.password);
            if (passMatch) {
                cursor.close();
                res.send(user);
                return;
            }
        }

        cursor.close();
        res.status(401).send();
    });
}

module.exports = registerApis;
