const UserModel = require('../models/userModel');

exports.fetchUserData = async (req, res) => {
    try {
        const { telegramId, firstName, lastName, username } = req.body;

        const isUser = await UserModel.findOne({ telegramId: telegramId });

        if (!isUser) {
            const newUser = UserModel({
                firstName,
                lastName,
                telegramId,
                username,
                balance: 0
            })
            await newUser.save();
            return res.status(200).json({
                status: 'success',
                message: 'Account created successfuly!',
                userData: newUser
            })
        }
        else {
            return res.status(200).json({
                status: 'success',
                message: 'User Data found!',
                userData: isUser
            })
        }

    } catch (error) {
        console.log("Error", error);
        return res.status(200).json({
            status: 'failed',
            message: 'Internal Server Error'
        })
    }
}