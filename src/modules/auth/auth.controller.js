import authService from './auth.service.js'

const register = async (req, res) => {
	try{
		const user = await authService.register(req.body)
		return res.status(200).json({
			message: 'user registered successfully',
			data: user
		});
	}catch(error){
		return res.status(500).json({error: error.message});
	}
}

const login = async (req, res) => {
	try{
		const user = await authService.login(req.body);
		return res.status(200).json({
			message: 'user logged in successfully',
			data: user
		});
	}catch(error){
		return res.status(500).json({error: error.message});
	}
}

const authController = {
	register,
	login
};


export default authController;