const express = require('express');

const router = express.Router();
const {
    loginCustomer,
    registerCustomer,
    getProfile,
    updateCustomer,
    deleteCustomerById,
    getAllCustomers,
    getCustomerById,
    updateCustomerPass,
    addInterestToCustomer 
} = require('../controllers/customersCrud');

const { authenticate } = require('../auth/index')

router.route('/register')
    .post(registerCustomer)


router.route('/login')
    .post(loginCustomer)

router.route('/profile')
    .post(authenticate, getProfile);


router.route('/:customerId/interests').post(addInterestToCustomer)


router.route('/:id')
    .put(updateCustomer)
    .get(getCustomerById)
    .delete(deleteCustomerById)

router.route('/changePass/:id')
    .put(updateCustomerPass)

router.route('')
    .get(getAllCustomers);
module.exports = router