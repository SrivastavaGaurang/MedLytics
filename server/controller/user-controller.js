import User from "../model/user.js"; // Corrected the path to 'model'

export const signupUser = async (request, response) => {
    try {
        const user = request.body;

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ message: "Signup successfully" });
    } catch (error) {
        console.log("Error while signing up:", error);
        return response.status(500).json({ message: "Error while signing up" });
    }
};