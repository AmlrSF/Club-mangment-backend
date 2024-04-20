const jwt = require('jsonwebtoken');
require('dotenv').config()

const authenticate = (req, res, next) => {

    const token = req.body.token;


    // console.log(token);

    if (!token) {
        return res.status(201).json({success:false, error: 'Unauthorized - No token provided' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.customerId = decoded.customerId;

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(200).json({success:false, error: 'Unauthorized - Invalid token' });
    }
};




module.exports = {
    authenticate   
};