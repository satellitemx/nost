import Hashids from "hashids";

const hashid = new Hashids(process.env.SALT!, 5, "qwertyuioppasdfghjklzxcvbnm");
export default hashid;