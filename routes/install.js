const express = require('express');
const router = express.Router();

const User = require('../model/User');

const {sequelize} = require('../model/bd');

router.get('/install', async (req, res) => {
    console.log('Creating database...');
    try {
        await sequelize.sync({force:true});
        res.send('Tables created');
    } catch (error) {
        console.log(error);
        res.send('Error creating tables');
    }  

    await User.create(
        'admin', 
        'admin@gmail.com', 
        '1234', 
        true
    );

    await User.create(
        'user', 
        'user@gmail.com', 
        '1234'
    );
});

module.exports = router;