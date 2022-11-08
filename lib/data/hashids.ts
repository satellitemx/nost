import Hashids from "hashids"

const hashids = (() => {
	return new Hashids(process.env.SALT)
})()

export default hashids