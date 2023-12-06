const { Pool } = require("pg")
const fs = require("fs")

if (process.env.RENDER) {
	config = {
		user: "retafinaluser",
		password: "T7j5ayM4sivyJFrY3VPVKWlSrcRBzueQ",
		host: "dpg-cloas3ogqk6s73e5vf60-a",
		port: 5432,
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
