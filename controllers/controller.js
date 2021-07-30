const { customer_signupSchema, agent_signupSchema, seller_signupSchema, forgotPassword_schema, signin_schema, checkOtp_schema, resetPassword_schema } = require('../validators/validator');
const { customer_register, agent_register, seller_register, login, sendOtp, data_service, otpCheck, setPassword } = require('../services/services')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
// // redis storage
// const redis = require('redis');
// const client = redis.createClient();

// signup api
async function customerSignup(req, res) {
    try {
        const body = req.body;
        // joi validations
        const result = await customer_signupSchema.validate(body);
        if (result.error) {
            return res.status(400).send({
                "status": 400,
                "error": result.error.details[0].message
            });
        }
        // password hashing 
        body.password = await bcrypt.hash(body.password, 10)

        const createResponse = await customer_register(body);
        console.log(createResponse);
        delete body.password;
        delete body.otp;
        const token = jwt.sign({ foo: body }, config.get('jwt.secretKey'));
        return res.status(200).send({
            "status": 200,
            "message": "signup successfull",
            "data": {
                ...body,
                user_id: createResponse[0].insertId,
                customer_id: createResponse[1].insertId,
                jsonWebToken: token,
            }
        });
    } catch (error) {
        return res.status(400).send({
            "status": 400,
            "error": error
        })
    }
}

// agent signup api
async function agentSignup(req, res) {
    try {
        const body = req.body;
        // joi validations
        const result = await agent_signupSchema.validate(body);
        if (result.error) {
            return res.status(400).send({
                "status": 400,
                "error": result.error.details[0].message
            });
        }
        // password hashing 
        body.password = await bcrypt.hash(body.password, 10)

        const createResponse = await agent_register(body);
        delete body.password;
        const token = jwt.sign({ foo: body }, config.get('jwt.secretKey'));
        return res.status(200).send({
            "status": 200,
            "message": "signup successfull",
            "data": {
                ...body,
                user_id: createResponse[0].insertId,
                agent_id: createResponse[1].insertId,
                jsonWebToken: token
            }
        });
    } catch (error) {
        return res.status(400).send({
            "status": 400,
            "error": error
        })
    }
}

// seller signup api
async function sellerSignup(req, res) {
    try {
        const body = req.body;
        // joi validations
        const result = await seller_signupSchema.validate(body);
        if (result.error) {
            return res.status(400).send({
                "status": 400,
                "error": result.error.details[0].message
            });
        }
        // password hashing 
        body.password = await bcrypt.hash(body.password, 10)

        const createResponse = await seller_register(body);
        delete body.password;
        const token = jwt.sign({ foo: body }, config.get('jwt.secretKey'));
        return res.status(200).send({
            "status": 200,
            "message": "signup successfull",
            "data": {
                ...body,
                user_id: createResponse[0].insertId,
                seller_id: createResponse[1].insertId,
                jsonWebToken: token
            }
        });
    } catch (error) {
        return res.status(400).send({
            "status": 400,
            "error": error
        })
    }
}

// sign in
async function signin(req, res) {
    try {
        const body = req.body;
        // joi validation 
        const result = await signin_schema.validate(body);
        if (result.error) {
            return res.status(400).send({
                "status": 400,
                "error": result.error.details[0].message
            });
        }
        const createResponse = await login(body);
        const results = await bcrypt.compare(body.password, createResponse.password);
        if (results == false) {
            return res.status(400).send({
                "status": 400,
                "error": "Incorrect Password"
            })
        } else {
            createResponse.password = undefined;
            const token = jwt.sign({ foo: createResponse }, config.get("jwt.secretKey"));
            // client.set('jwt', token);
            // await client.get("jwt", function(err, reply) {
            //     console.log("token stored in redis " + reply.toString()); 
            // });
            return res.status(200).send({
                "status": 200,
                "message": "successful login",
                "token": token
            });
        }

    } catch (error) {
        return res.status(400).send({
            "status": 400,
            "error": "Invalid username or password"
        })
    }
}

// forgot-password api 
async function forgotPassword(req, res) {
    try {
        const body = req.body;
        const result = await forgotPassword_schema.validate(body);
        if (result.error) {
            return res.status(400).send({
                "status": 400,
                "error": result.error.details[0].message
            });
        }
        const createResponse = await sendOtp(body);
        if (createResponse.affectedRows == 0) {
            return res.status(400).send({
                "status": 400,
                "error": "phone number is not registered"
            })
        }
        return res.status(200).send({
            "status": 200,
            "message": "otp sent successfully",
            "data": {
                ...createResponse
            }
        });
    } catch (error) {
        return res.status(400).send({
            "status": 400,
            "error": error
        })
    }
}

// api for checking otp 
async function checkOtp(req, res) {
    try {
        const body = req.body;
        const result = await checkOtp_schema.validate(body);
        if (result.error) {
            return res.status(400).send({
                "status": 400,
                "error": result.error.details[0].message
            })
        }
        const createResponse = await otpCheck(body);
        if (body.otp == createResponse.otp) {
            return res.status(200).send({
                "status": 200,
                "message": "otp matched",
                "data": {
                    ...createResponse
                }
            })
        } else {
            return res.status(400).send({
                "status": 400,
                "error": "incorrect otp"
            })
        }

    } catch (error) {
        return res.status(400).send({
            "status": 400,
            "error": error
        });
    }
}

// reset-password api
async function resetPassword(req, res) {
    try {
        const body = req.body;
        const result = resetPassword_schema.validate(body);
        if (result.error) {
            return res.status(400).send({
                "status": 400,
                "error": result.error.details[0].message
            });
        }
        // hashing password
        body.reset_password = await bcrypt.hash(body.reset_password, 10)
        const createResponse = await setPassword(body);
        // if (createResponse.affectedRows == 0) {
        //     return res.status(400).send({
        //         "status": 400,
        //         "error": "password not changed"
        //     })
        // }
        return res.status(200).send({
            "status": 200,
            "message": "password updated successfully",
            "data": {
                ...createResponse
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            "status": 400,
            "error": error
        })
    }
}

// get whole data 
async function getdata(req, res) {
    try {
        const createResponse = await data_service();
        return res.status(200).send({
            "status": 200,
            "message": "got data successfully",
            "data": {
                ...createResponse
            }
        })
    } catch (error) {
        return res.status(400).send({
            "status": 400,
            "error": error
        })
    }
}

module.exports = {
    customerSignup,
    agentSignup,
    sellerSignup,
    signin,
    forgotPassword,
    checkOtp,
    resetPassword,
    getdata
}