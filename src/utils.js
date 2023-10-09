import {fileURLToPath} from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const cookieExtractor = (req)=>
{
    let token = null;
    if(req&&req.cookies)
    {
        token=req.cookies['authCookie'];
    }
    return token;
}

export default __dirname;