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
		console.log(req.user);
		next();
	}catch(error){
		return res.status(400).json({ message: 'invalid or expired token' });
	}
}

export default authenticate;