const winston = require("winston")
const path = require("path")

const adminLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [

        new winston.transports.File({ filename: path.join(__dirname, "../logs/", 'adminError.log') }),
        new winston.transports.Console()
    ]
})
const userLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [

        new winston.transports.File({ filename: path.join(__dirname, "../logs/", 'userError.log') }),
        new winston.transports.Console()
    ]
})


module.exports={ adminLogger ,userLogger}
