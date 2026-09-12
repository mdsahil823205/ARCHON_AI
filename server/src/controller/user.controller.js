const getMe = async (req, res) => {
    try {
        const user = await req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found Unauthorized access",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.log(`This error came from getMe from user.controller.js: ${error}`);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default getMe;