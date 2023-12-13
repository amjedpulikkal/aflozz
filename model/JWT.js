
const jwt = require("jsonwebtoken")


require("dotenv")
const secretKey = process.env.secret_key;

function create_token(data) {
  return jwt.sign({ data, used: false }, secretKey, { expiresIn: '2m' })
}

function varifyction(data) {
  //  const encod= jwt.verify(data, process.env.secret_Key)
  try {
    return jwt.verify(data, secretKey)
  } catch (errr) {
    return null

  }
}

module.exports = { create_token, varifyction }