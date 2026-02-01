import Insight from "../models/insightModel.js";
import Medication from "../models/medicationModel.js";
import MedicationLog from "../models/medicationLogModel.js";

// Get all pending insights for a user
export const getInsights = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch pending insights
        let insights = await Insight.find({
            userId,
            status: 'pending'
        }).sort({ priority: -1, createdAt: -1 });

        // If no real insights, generate mock ones for demo
        if (insights.length === 0) {
            insights = generateMockInsights(userId);
        }

        res.json(insights);
    } catch (error) {
        console.error("Error fetching insights:", error);
        res.status(500).json({ message: error.message });
    }
};

// Accept a suggestion (update medication schedule)
export const acceptInsight = async (req, res) => {
    try {
        const { insightId } = req.params;

        const insight = await Insight.findById(insightId);
        if (!insight) {
            return res.status(404).json({ message: "Insight not found" });
        }

        // If it's a time adjustment, update the medication
        if (insight.actionType === 'adjust_time' && insight.medicationId) {
            const medication = await Medication.findById(insight.medicationId);
            if (medication && insight.patternData?.suggestedTime) {
                // Update the schedule time
                const currentTime = insight.patternData.currentTime;
                medication.schedule.times = medication.schedule.times.map(time =>
                    time === currentTime ? insight.patternData.suggestedTime : time
                );
                await medication.save();
            }
        }

        // Mark insight as accepted
        insight.status = 'accepted';
        await insight.save();

        res.json({
            message: "Schedule updated successfully!",
            insight
        });
    } catch (error) {
        console.error("Error accepting insight:", error);
        res.status(500).json({ message: error.message });
    }
};

// Dismiss an insight
export const dismissInsight = async (req, res) => {
    try {
        const { insightId } = req.params;

        const insight = await Insight.findByIdAndUpdate(
            insightId,
            { status: 'dismissed' },
            { new: true }
        );

        if (!insight) {
            return res.status(404).json({ message: "Insight not found" });
        }

        res.json({ message: "Insight dismissed", insight });
    } catch (error) {
        console.error("Error dismissing insight:", error);
        res.status(500).json({ message: error.message });
    }
};

// Analyze patterns and generate insights (called by a cron job or manually)
export const analyzePatterns = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get recent medication logs
        const logs = await MedicationLog.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        const insights = [];

        // Analyze late patterns
        const lateLogs = logs.filter(log => log.status === 'late');
        if (lateLogs.length >= 3) {
            // Group by medication
            // Create insight for late pattern
            insights.push({
                userId,
                type: 'late_pattern',
                title: '🧠 Smart Insight',
                message: `You often take your medication later than scheduled.`,
                suggestion: 'Would you like to adjust your reminder time?',
                patternData: {
                    occurrences: lateLogs.length,
                    total: logs.length
                },
                actionType: 'adjust_time',
                priority: 2
            });
        }

        // Check adherence rate
        const takenLogs = logs.filter(log => log.status === 'taken' || log.status === 'late');
        const adherenceRate = logs.length > 0 ? Math.round((takenLogs.length / logs.length) * 100) : 0;

        if (adherenceRate >= 90) {
            insights.push({
                userId,
                type: 'adherence_milestone',
                title: '🎉 Great Job!',
                message: `You're ${adherenceRate}% consistent this week—amazing!`,
                patternData: { percentage: adherenceRate },
                priority: 1
            });
        }

        // Save insights to database
        await Insight.insertMany(insights);

        res.json({ message: "Pattern analysis complete", insights });
    } catch (error) {
        console.error("Error analyzing patterns:", error);
        res.status(500).json({ message: error.message });
    }
}


// Calculate Risk Score (Real-time ML)
export const getRiskScore = async (req, res) => {
    try {
        const { userId } = req.params;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch logs including 'missed' status
        const logs = await MedicationLog.find({
            // careProfileId: userId, // Assuming userId param is actually careProfileId for now as per routes
            // or just use loose search if schema varies
            $or: [{ userId: userId }, { careProfileId: userId }],
            createdAt: { $gte: thirtyDaysAgo }
        });

        const score = calculateAdherenceScore(logs, logs.length || 1);
        const riskDetails = getRiskLevel(score);

        res.json({
            riskScore: score,
            riskLevel: riskDetails.level,
            riskColor: riskDetails.color,
            message: riskDetails.message,
            analyzedCount: logs.length
        });
    } catch (error) {
        console.error("Error calculating risk:", error);
        res.status(500).json({ message: "Failed to calculate risk score" });
    }
};

// Generate mock insights for demo
function generateMockInsights(userId) {
    return [
        {
            _id: 'mock-1',
            userId,
            type: 'late_pattern',
            title: '🧠 Smart Insight',
            message: 'We noticed you usually take your evening medicine around 10 PM instead of 9 PM.',
            suggestion: 'Want to update your reminder?',
            patternData: {
                occurrences: 4,
                total: 7,
                currentTime: '21:00',
                suggestedTime: '22:00',
                avgTimeDiff: 60
            },
            actionType: 'adjust_time',
            status: 'pending',
            priority: 2
        },
        {
            _id: 'mock-2',
            userId,
            type: 'weekend_skip',
            title: '📅 Weekend Pattern',
            message: 'You often skip Saturday morning doses.',
            suggestion: 'Set a later reminder for weekends?',
            patternData: {
                occurrences: 3,
                total: 4
            },
            actionType: 'adjust_time',
            status: 'pending',
            priority: 2
        },
        {
            _id: 'mock-3',
            userId,
            type: 'adherence_milestone',
            title: '🎉 Amazing!',
            message: "You're 95% consistent this week—keep it up!",
            patternData: {
                percentage: 95
            },
            status: 'pending',
            priority: 1
        }
    ];
}
