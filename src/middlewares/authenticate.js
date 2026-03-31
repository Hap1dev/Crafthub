import jwt from 'jsonwebtoken';

const authenticate = async (req, res, next) => {
	try{
		const authHeader = req.headers.authorization;
		if(!authHeader){
			return res.status(401).json({ message: 'invalid token' });
		}
		const token = authHeader.split(' ')[1];
		const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = payload;
		next();
	}catch(error){

	}
}

export default authenticate;