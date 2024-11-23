const Club = require("../schema/clubs");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const Post = require("../schema/post");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// Create a new club
const createClub = async (req, res) => {
  try {
    let profilePictureUrl = null;

    if (req.body.profilePicture) {
      const photoUrl = await cloudinary.uploader.upload(
        req.body.profilePicture
      );
      profilePictureUrl = photoUrl.url;
    }

    // Create the new club with the profile picture URL
    const newClub = await Club.create({
      ...req.body,
      profilePicture: profilePictureUrl,
    });

    res.status(201).json({ success: true, club: newClub });
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get all clubs
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("ownerId")
    
    res.status(200).json({ success: true, clubs });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getAllClubsByownerID = async (req, res) => {
  const id = req.params.id;

  try {
    const clubs = await Club.find();
    console.log(clubs);
    let clubsbyId = clubs.filter((item) => item.ownerId == new ObjectId(id));
    res.status(200).json({ success: true, clubsbyId });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get a club by ID
const getClubById = async (req, res) => {
  const clubId = req.params.id;
  try {
    const club = await Club.findById(clubId)
      .populate("ownerId")
      .populate("members")
      .populate("moderators");
    if (!club) {
      return res.status(404).json({ success: false, error: "Club not found" });
    }
    res.status(200).json({ success: true, club });
  } catch (error) {
    console.error("Error fetching club by ID:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Update a club by ID
const updateClub = async (req, res) => {
  const clubId = req.params.id;
  try {
    let profilePictureUrl = null;

    if (req.body.profilePicture) {
      const photoUrl = await cloudinary.uploader.upload(
        req.body.profilePicture
      );
      profilePictureUrl = photoUrl.url;
    }

    const updatedClub = await Club.findByIdAndUpdate(clubId, {...req.body, profilePicture : profilePictureUrl}, {
      new: true,
    });
    if (!updatedClub) {
      return res.status(404).json({ success: false, error: "Club not found" });
    }
    res.status(200).json({ success: true, club: updatedClub });
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteClubById = async (req, res) => {
  const clubId = req.params.id;
  try {
    // Delete all posts related to the club
    await Post.deleteMany({ club: clubId });

    // Now delete the club
    const deletedClub = await Club.findByIdAndDelete(clubId);

    if (!deletedClub) {
      return res.status(404).json({ success: false, error: "Club not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const joinSquad = async (req, res) => {
  const { id: squadId } = req.params; // Get the squad ID from the route parameters
  const { userId } = req.body; // Get the user ID from the request body

  try {
    // Find the squad by ID
    const squad = await Club.findById(squadId); // Assuming squads are managed in the Club model
    if (!squad) {
      return res.status(404).json({ success: false, error: "Squad not found" });
    }

    // Check if the user is already a member
    if (squad.members.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "User is already a member" });
    }

    if (squad.moderators.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "User is already a Moderator" });
    }


    if (userId == squad.ownerId) {
      return res
        .status(400)
        .json({ success: false, error: "user is already Admin" });
    }

    // Add the user to the members array
    squad.members.push(userId);
    await squad.save();

    res
      .status(200)
      .json({ success: true, message: "User successfully joined the squad" });
  } catch (error) {
    console.error("Error joining squad:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Upgrade a user to moderator
const upgradeUserToModerator = async (req, res) => {
  const { id: squadId } = req.params;
  const { userId } = req.body;

  try {
    const squad = await Club.findById(squadId);
    if (!squad) {
      return res.status(404).json({ success: false, error: "Squad not found" });
    }

    if (!squad.members.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "User is not a member" });
    }

    squad.members = squad.members.filter(
      (member) => member.toString() !== userId
    );
    squad.moderators.push(userId);

    await squad.save();
    res
      .status(200)
      .json({ success: true, message: "User upgraded to moderator" });
  } catch (error) {
    console.error("Error upgrading user to moderator:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Downgrade a moderator to member
const downgradeUserToModerator = async (req, res) => {
  const { id: squadId } = req.params;
  const { userId } = req.body;

  try {
    const squad = await Club.findById(squadId);
    if (!squad) {
      return res.status(404).json({ success: false, error: "Squad not found" });
    }

    if (!squad.moderators.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "User is not a moderator" });
    }

    squad.moderators = squad.moderators.filter(
      (mod) => mod.toString() !== userId
    );
    squad.members.push(userId);

    await squad.save();
    res
      .status(200)
      .json({ success: true, message: "Moderator downgraded to member" });
  } catch (error) {
    console.error("Error downgrading moderator to member:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Ban user from squad
const banUserFromSquad = async (req, res) => {
  const { id: squadId } = req.params;
  const { userId } = req.body;

  try {
    const squad = await Club.findById(squadId);
    if (!squad) {
      return res.status(404).json({ success: false, error: "Squad not found" });
    }

    squad.members = squad.members.filter(
      (member) => member.toString() !== userId
    );
    squad.moderators = squad.moderators.filter(
      (mod) => mod.toString() !== userId
    );

    await squad.save();
    res.status(200).json({ success: true, message: "User banned from squad" });
  } catch (error) {
    console.error("Error banning user from squad:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  joinSquad,
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClubById,
  getAllClubsByownerID,
  upgradeUserToModerator,
  downgradeUserToModerator,
  banUserFromSquad,
};
