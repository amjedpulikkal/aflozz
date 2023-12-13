const crypto = require('crypto');
const algorithm = 'aes-256-ecb'; 
const password = process.env.MY_PASSWORD; 

// Encryption
function encryption(data) {
    const key = crypto.scryptSync(password, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, null); 
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    return encryptedData += cipher.final('hex');
}

// Decryption
function decryption(data) {
    try {
        const key = crypto.scryptSync(password, 'salt', 32);
        const decipher = crypto.createDecipheriv(algorithm, key, null); 
        let decryptedData = decipher.update(data, 'hex', 'utf8');
        return decryptedData += decipher.final('utf8');
    } catch (err) {
        console.log(err);
        return null;
    }
}

// function co


module.exports = {decryption ,encryption}
