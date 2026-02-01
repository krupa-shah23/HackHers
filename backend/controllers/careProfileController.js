import CareProfile from "../models/careProfileModel.js";

export const createCareProfile = async (req, res) => {
  try {
    const careProfile = await CareProfile.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(careProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCareProfiles = async (req, res) => {
  try {
    const profiles = await CareProfile.find({
      $or: [{ createdBy: req.user._id }, { "caregivers": req.user._id }]
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
