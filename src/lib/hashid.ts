import Hashids from "hashids";

const hashid = new Hashids(import.meta.env.SALT, 5);
export default hashid;