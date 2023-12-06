const { Pool } = require("pg")
const fs = require("fs")

if (process.env.DYNO) {
	config = {
		user: "retafinaluser",
		password: "yRdiiGcOJs40*4&P8y#i",
		host: "reta-final-do-user-5039535-0.b.db.ondigitalocean.com",
		port: 25060,
		database: "retafinal",
		ssl: {
			ca: fs.readFileSync("./ca-certificate.crt"),
		},
	}
} else {
	config = {
		user: "retafinaluser",
		password: "retafinaluser",
		host: "localhost",
		port: 5433,
		database: "retafinal",
	}
}

module.exports = new Pool(config)

// mudança 2 no iteração2
