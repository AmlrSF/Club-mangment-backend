require('dotenv').config()
const cloudinary = require('cloudinary').v2;


const Customer = require("../schema/customers");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const registerCustomer = async (req, res) => {
    const {
        fname,
        lname,
        email,
        password,
    } = req.body;

    console.log(req.body);

    try {
        // Check if the email is already in use
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(201).json({ success: false, error: 'Email already in use' });
        }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the generated salt
        const hash = await bcrypt.hash(password, salt);

        // Create a new customer with the hashed password
        const newCustomer = new Customer({
            firstName: fname,
            lastName: lname,
            email,
            passwordHash: hash,
        });

        // Save the new customer to the database
        const savedCustomer = await newCustomer.save();
        res.status(201).json({ success: true, savedCustomer });
    } catch (error) {
        console.error('Error during customer registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(200).json({success:false,  error: 'Customer not found' });
        }

        
        const passwordMatch = await bcrypt.compare(password, customer.passwordHash);

        if (!passwordMatch) {
            return res.status(200).json({success:false, error: 'Invalid password' });
        }

        
        if (!customer.username) {
            const username = email.split('@')[0]; 
            customer.username = username;
        }

       
        await customer.save();

        
        const token = jwt.sign({ customerId: customer._id }, process.env.JWT_SECRET, {
            expiresIn: '3h', 
        });

        res.cookie('token', token, {
            httpOnly: true, 
            
        });

        res.status(200).json({ message: 'Login successful', token, customer });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getProfile = async (req, res) => {
    try {
       
        const customerId = req.customerId;

       
        console.log(customerId);

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({success:false, error: 'Customer not found' });
        }

        
        res.status(200).json({success:true, customer });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const updateCustomer = async (req, res) => {
    const customerId = req.params.id; 
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        profileImage,
        bio,
        classe,
        linkedinLink,
        facebookLink,
        cvAttachment,
        
    } = req.body;


    //console.log(req.body);

    try {
        
        const existingCustomer = await Customer.findById(customerId);
        if (!existingCustomer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }

        
        if (email && email !== existingCustomer.email) {
            const emailInUse = await Customer.findOne({ email });
            if (emailInUse) {
                return res.status(400).json({ success: false, error: 'Email already in use' });
            }
        }

        let image = ""
        let updatedProfileImage = existingCustomer.profileImage;
        if (profileImage) {
            const photoUrl = await cloudinary.uploader.upload(profileImage);
            updatedProfileImage = photoUrl.url;
        }

       
      

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
              firstName,
              lastName,
              email,
              phoneNumber,
              profileImage: updatedProfileImage, 
              bio,
              classe,
              linkedinLink,
              facebookLink,
              cvAttachment,
              Identificated:true,  
            },
            { new: true }
          );
          

        res.status(200).json({ success: true, updatedCustomer });
    } catch (error) {
        console.error('Error during customer update:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const updateCustomerPass = async (req, res) => {
    const customerId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const existingCustomer = await Customer.findById(customerId);

        if (!existingCustomer) {
            return res.status(200).json({ success: false, error: 'Customer not found' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, existingCustomer.passwordHash);

        if (!passwordMatch) {
            return res.status(200).json({ success: false, error: 'Old password is incorrect' });
        }

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const updatedPasswordHash = await bcrypt.hash(newPassword, salt);
            existingCustomer.passwordHash = updatedPasswordHash;
        }

        const updatedCustomer = await existingCustomer.save();

        res.status(200).json({ success: true, updatedCustomer });
    } catch (error) {
        console.error('Error during customer password update:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const deleteCustomerById = async (req, res) => {
    const customerId = req.params.id;

    try {
        
        const existingCustomer = await Customer.findById(customerId);
        if (!existingCustomer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }

        
    
        await Customer.findByIdAndDelete(customerId);

        res.status(200).json({ success: true, message: 'Customer and associated orders deleted successfully' });
    } catch (error) {
        console.error('Error during customer deletion:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        
        const customers = await Customer.find();

        res.status(200).json({ success: true, customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
const getCustomerById = async (req, res) => {
    const customerId = req.params.id; 

    try {
        
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }

        res.status(200).json({ success: true, customer });
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const addInterestToCustomer = async (req, res) => {
    const customerId = req.params.customerId;
    const { interests } = req.body; // Assuming interests are sent in the request body
  
    try {
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
      console.log(customer)
  
      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }
  
      // Add the interests to the customer
      customer.interests = interests;
      await customer.save();
  
      return res.status(200).json({ success: true, customer });
    } catch (error) {
      console.error('Error adding interests to customer:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
  
module.exports = {
    loginCustomer,
    registerCustomer,
    getProfile,
    updateCustomer,
    deleteCustomerById,
    getAllCustomers,
    getCustomerById,
    updateCustomerPass,
    addInterestToCustomer
} 
  