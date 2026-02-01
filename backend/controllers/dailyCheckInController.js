import DailyCheckIn from "../models/dailyCheckInModel.js";

// Create or update today's check-in
export const upsertDailyCheckIn = async (req, res) => {
  try {
    const { careProfileId, date, mood } = req.body;

    const checkIn = await DailyCheckIn.findOneAndUpdate(
      { careProfileId, date },
      { careProfileId, date, mood },
      { upsert: true, new: true }
    );

    res.status(201).json(checkIn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get check-ins for a care profile
export const getCheckInsByCareProfile = async (req, res) => {
  try {
    const { careProfileId } = req.params;

    const checkIns = await DailyCheckIn.find({ careProfileId })
      .sort({ date: -1 });

    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
