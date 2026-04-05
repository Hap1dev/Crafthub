import userRepository from './user.repository.js';

const getProfile = async (userId) => {
	const user = await userRepository.findUserById(userId);
	if (!user) {
		throw new Error('user not found');
	}
	return user;
};

const updateProfile = async (userId, data) => {
	// Only allow updating name and phone
	const filteredData = {
		name: data.name,
		phone: data.phone
	};

	// Remove undefined fields
	Object.keys(filteredData).forEach(key => filteredData[key] === undefined && delete filteredData[key]);

	return userRepository.updateUser(userId, filteredData);
};

const updateAvatar = async (userId, avatarUrl) => {
	return userRepository.updateUser(userId, { avatarUrl });
};

const createAddress = async (userId, data) => {
	const address = await userRepository.createAddress(userId, data);

	if (data.isDefault) {
		await userRepository.unsetOtherDefaultAddresses(userId, address.id);
	}

	return address;
};

const getAddresses = async (userId) => {
	return userRepository.findAddressesByUserId(userId);
};

const updateAddress = async (userId, addressId, data) => {
	const existingAddress = await userRepository.findAddressByIdAndUser(addressId, userId);
	if (!existingAddress) {
		throw new Error('address not found or not owned by user');
	}

	const updatedAddress = await userRepository.updateAddress(addressId, data);

	if (data.isDefault) {
		await userRepository.unsetOtherDefaultAddresses(userId, addressId);
	}

	return updatedAddress;
};

const userService = {
	getProfile,
	updateProfile,
	updateAvatar,
	createAddress,
	getAddresses,
	updateAddress
};

export default userService;
