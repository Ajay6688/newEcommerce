const { func } = require("@hapi/joi");
const c = require("config");
const { conn } = require("../dao/mySqlConnection")
const create_otp = require('otp-generator');

function sqlQuery(q, v) {
    return new Promise((resolve, reject) => {
        conn.query(q, v, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}

function customer_register(data) {
    return new Promise(async(resolve, reject) => {
        try {

            // to insert data in users table 
            const query1 = "insert into  tb_users (first_name ,last_name ,username ,password ,country_code ,phone_number ,address ,pincode ) values(?,?,?,?,?,?,?,?)";
            const values1 = [data.first_name, data.last_name, data.username, data.password, data.country_code, data.phone_number, data.address, data.pincode]
            const result = await sqlQuery(query1, values1);

            // to insert data in customers table 
            const user_id = result.insertId;
            const query2 = "insert into tb_customers(user_id , customer_dob) values(?,?)";
            const values2 = [user_id, data.dob];
            const results = await sqlQuery(query2, values2);
            return resolve([result, results]);
        } catch (error) {
            return reject(error);
        }
    });
}

// agent sign up 
async function agent_register(data) {
    return new Promise(async(resolve, reject) => {
        try {
            // to insert data in users table 
            const query1 = "insert into  tb_users (first_name ,last_name ,username ,password ,country_code ,phone_number ,address ,pincode ) values(?,?,?,?,?,?,?,?)";
            const values1 = [data.first_name, data.last_name, data.username, data.password, data.country_code, data.phone_number, data.address, data.pincode]
            const result = await sqlQuery(query1, values1);
            // to insert data in customers table 
            const user_id = result.insertId;
            const query2 = "insert into tb_agents(user_id , vehicle) values(?,?)";
            const values2 = [user_id, data.vehicle];
            const results = await sqlQuery(query2, values2);
            return resolve([result, results]);
        } catch (error) {
            // console.log(error);
            return reject(error);
        }
    });
}

// seller registration in db 
async function seller_register(data) {
    return new Promise(async(resolve, reject) => {
        try {
            // to insert data in users table 
            const query1 = "insert into  tb_users (first_name ,last_name ,username ,password ,country_code ,phone_number ,address ,pincode ) values(?,?,?,?,?,?,?,?)";
            const values1 = [data.first_name, data.last_name, data.username, data.password, data.country_code, data.phone_number, data.address, data.pincode]
            const result = await sqlQuery(query1, values1);
            // to insert data in customers table 
            const user_id = result.insertId;
            const query2 = "insert into tb_sellers(user_id , company_name) values(?,?)";
            const values2 = [user_id, data.company_name];
            const results = await sqlQuery(query2, values2);
            return resolve([result, results]);
        } catch (error) {
            return reject(error);
        }
    });
}

// login service
function login(data) {
    return new Promise(async(resolve, reject) => {
        try {
            const query = 'select * from tb_users where username = ?';
            const values = [data.username];
            const result = await sqlQuery(query, values);
            return resolve(result[0]);
        } catch (error) {
            return reject(error);
        }
    })
}

// varify phone number service
function sendOtp(data) {
    return new Promise(async(resolve, reject) => {
        try {
            otp = create_otp.generate(4, { alphabets: false, upperCase: false, alphabets: false });
            const query = 'update tb_users set otp = ? where phone_number = ?';
            const values = [otp, data.phone_number];
            const result = await sqlQuery(query, values);
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    })
}

function otpCheck(data) {
    return new Promise(async(resolve, reject) => {
        try {
            const query = 'select otp from tb_users where phone_number = ?';
            const values = [data.phone_number];
            const results = await sqlQuery(query, values);
            return resolve(results[0]);
        } catch (error) {
            return reject(error);
        }
    })
}

function setPassword(data) {
    return new Promise((resolve, reject) => {
        try {
            const query = 'update tb_users set password = ? where phone_number = ?';
            const values = [data.reset_password, data.phone_number];
            const results = sqlQuery(query, values);
            return resolve(results);
        } catch (error) {
            return reject(error);
        }
    })
}

function data_service() {
    return new Promise(async(resolve, reject) => {
        try {
            const query = 'select * from tb_users '
            const results = await sqlQuery(query);
            return resolve(results);
        } catch (error) {
            return reject(error)
        }
    })
}

module.exports = {
    customer_register,
    agent_register,
    seller_register,
    login,
    sendOtp,
    otpCheck,
    setPassword,
    data_service
}