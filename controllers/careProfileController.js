import CareProfile from "../models/careProfileModel.js";

export const createCareProfile = async (req, res) => {
  try {
    const careProfile = await CareProfile.create(req.body);
    res.status(201).json(careProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
