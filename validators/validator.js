const joi = require('@hapi/joi');

// signup validation schema
const customer_signupSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().allow(null, ''),
    username: joi.string().min(4).max(64).required(),
    password: joi.string().min(6).required(),
    country_code: joi.string().max(5).required(),
    phone_number: joi.string().pattern(/^[0-9]+$/).min(10).max(10).required(),
    address: joi.string().allow(null, ''),
    pincode: joi.string().allow(null, ''),
    //for tb_customers
    dob: joi.date().required()
});


// validations for agents signup 
const agent_signupSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().allow(null, ''),
    username: joi.string().min(4).max(64).required(),
    password: joi.string().min(6).required(),
    country_code: joi.string().max(5).required(),
    phone_number: joi.string().pattern(/^[0-9]+$/).min(10).max(10).required(),
    address: joi.string().allow(null, ''),
    pincode: joi.string().allow(null, ''),
    //for tb_agents
    vehicle: joi.string().required()
});

// validations for seller signup 
const seller_signupSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().allow(null, ''),
    username: joi.string().min(4).max(64).required(),
    password: joi.string().min(6).required(),
    country_code: joi.string().max(5).required(),
    phone_number: joi.string().pattern(/^[0-9]+$/).min(10).max(10).required(),
    address: joi.string().allow(null, ''),
    pincode: joi.string().allow(null, ''),
    //for tb_sellers
    company_name: joi.string().required()
});

// validation for singin
const signin_schema = joi.object({
    username: joi.string().min(4).max(64).required(),
    password: joi.string().min(6).required()
});

// validation for forgot-password
const forgotPassword_schema = joi.object({
    phone_number: joi.string().pattern(/^[0-9]+$/).min(10).max(10).required()
});

// validation for otp checking 
const checkOtp_schema = joi.object({
    otp: joi.string().pattern(/^[0-9]+$/).min(4).max(4).required(),
    phone_number: joi.string().pattern(/^[0-9]+$/).min(10).max(10).required()
});

// validation for reset password 
const resetPassword_schema = joi.object({
    phone_number: joi.string().pattern(/^[0-9]+$/).min(10).max(10).required(),
    reset_password: joi.string().min(6).required()
})


module.exports = {
    customer_signupSchema,
    agent_signupSchema,
    seller_signupSchema,
    forgotPassword_schema,
    signin_schema,
    checkOtp_schema,
    resetPassword_schema
}