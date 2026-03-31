import authService from './auth.service.js'

const register = async (req, res) => {
	try{
		const data = await authService.register(req.body)
		return res.status(200).json({
			message: 'user registered successfully',
			user: data
		});
	}catch(error){
		return res.status(500).json({error: error.message});
	}
}

const login = async (req, res) => {
	try{
		const data = await authService.login(req.body);
		return res.status(200).json({
			message: 'user logged in successfully',
			...data
		});
	}catch(error){
		return res.status(500).json({error: error.message});
	}
}

const refresh = async (req, res) => {
	try{
		const data = await authService.refresh(req.body.refreshToken); // { accessToken: xxx, refreshToken: xxx }
		return res.status(200).json(data);
	}catch(error){
		return res.status(500).json({ error: error.message });
	}
}

const logout = async (req, res) => {
	try{
		await authService.logout(req.user.id);
		return res.status(200).json({ message: 'user logged out successfully' });
	}catch(error){
		return res.status(500).json({ message: error.message });
	}
}

const authController = {
	register,
	login,
	refresh,
	logout
};


export default authController;