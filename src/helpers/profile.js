const { userSchema } = require("../mongodb");
const User = userSchema?.User;

const getProfileHandler = async (req, res) => {
  try {
    const user = await User?.findById(req?.userId)?.select("-password");
    console.log(user,'user')
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Failed to get user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfileHandler = async (req, res) => {
  try {
    const { name, address } = req?.body;
    const profilePicture = req?.file?.buffer;
    const updatedUser = await User?.findByIdAndUpdate(
      req?.userId,
      { name, address, profilePicture },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Failed to update user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProfileHandler = async (req, res) => {
  try {
    const deletedUser = await User?.findOneAndDelete({ _id: req?.userId });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User Deleted Successfully" });
  } catch (err) {
    console.error("Failed to delete user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfilePictureHandler = async (req, res) => {
  try {
    const profilePicture = req?.file?.buffer;
    const updatedUser = await User?.findByIdAndUpdate(
      req.userId,
      { profilePicture },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Failed to upload user profile picture:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getProfileHandler,
  updateProfileHandler,
  updateProfilePictureHandler,
  deleteProfileHandler,
};
