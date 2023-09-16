import multer from "multer";        //libreria para cargar archivos en el servidor
import __dirname from "../utils.js"; 

const storage = multer.diskStorage({    //establece donde se almacenaran los archivos, se configura que se guarda, como y donde (se guarda)
    destination: function(req,file,callback)
    {
        return callback(null,`${__dirname}/public/img`); //null es por si surge algun error, mandalo como null en ese caso
    },
    filename: function(req,file,callback)
    {
        return callback(null, `${Date.now()}-${file.originalname}`);
    }
}); 

const uploader = multer({storage});
export default uploader;
