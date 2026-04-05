import userService from './user.service.js';

const getProfile = async (req, res) => {
	try {
		const user = await userService.getProfile(req.user.id);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateProfile = async (req, res) => {
	try {
		const user = await userService.updateProfile(req.user.id, req.body);
		return res.status(200).json({
			message: 'profile updated successfully',
			user
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateAvatar = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'no image file provided' });
		}

		const avatarUrl = `/uploads/avatars/${req.file.filename}`;
		const user = await userService.updateAvatar(req.user.id, avatarUrl);

		return res.status(200).json({
			message: 'avatar updated successfully',
			avatarUrl: user.avatarUrl
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const createAddress = async (req, res) => {
	try {
		const address = await userService.createAddress(req.user.id, req.body);
		return res.status(201).json({
			message: 'address created successfully',
			address
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const getAddresses = async (req, res) => {
	try {
		const addresses = await userService.getAddresses(req.user.id);
		return res.status(200).json(addresses);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateAddress = async (req, res) => {
	try {
		const address = await userService.updateAddress(req.user.id, req.params.id, req.body);
		return res.status(200).json({
			message: 'address updated successfully',
			address
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const userController = {
	getProfile,
	updateProfile,
	updateAvatar,
	createAddress,
	getAddresses,
	updateAddress
};

export default userController;
