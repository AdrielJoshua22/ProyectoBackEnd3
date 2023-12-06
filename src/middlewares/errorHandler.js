import errorDictionary from "../utils/errorDictionary.js";

const errorHandler = (err, req, res, next) => 
{
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const errorMessage = errorDictionary[err.message] || 'Ha ocurrido un error inesperado';
  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;