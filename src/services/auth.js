import bcrypt from 'bcrypt';

const createHash = async(password)=>
{
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salts);
}

const validatePassword = (password, hasedPasswod)=>
{
    return bcrypt.compare(password, hasedPasswod);
}

export default {createHash, validatePassword}
