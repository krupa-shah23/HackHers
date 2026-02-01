/**
 * Adherence Risk Engine
 * Calculates a trusted "Risk Score" based on patient behavior.
 * 
 * Score Range: 0 (Low Risk / High Adherence) to 100 (High Risk / Low Adherence)
 */

export const calculateAdherenceScore = (logs, totalScheduled) => {
    if (!logs || totalScheduled === 0) return 0; // No data = Low risk initially

    const missedCount = logs.filter(l => l.status === 'missed').length;
    const takenCount = logs.filter(l => l.status === 'taken').length;

    // 1. Base Adherence Rate (Safety Net)
    // If they missed > 20% of doses, risk spikes.
    const adherenceRate = takenCount / totalScheduled;
    let riskScore = (1 - adherenceRate) * 100;

    // 2. Lateness Penalty
    // Even if taken, if taken > 2 hours late consistently, add risk.
    const lateLogs = logs.filter(l => {
        if (l.status !== 'taken' || !l.scheduledTime || !l.takenAt) return false;
        const scheduled = new Date(l.scheduledTime).getTime();
        const taken = new Date(l.takenAt).getTime();
        const diffHours = (taken - scheduled) / (1000 * 60 * 60);
        return Math.abs(diffHours) > 2; // More than 2 hours deviation
    });

    const latenessFactor = (lateLogs.length / takenCount) * 20; // Up to 20 points penalty
    riskScore += isNaN(latenessFactor) ? 0 : latenessFactor;

    // 3. Consecutive Miss Penalty
    // 3 misses in a row is a massive red flag.
    let consecutiveMisses = 0;
    let maxConsecutive = 0;
    // Sort logs by time (assuming logs are passed unsorted or mixed)
    const sortedLogs = [...logs].sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

    for (let log of sortedLogs) {
        if (log.status === 'missed') {
            consecutiveMisses++;
        } else {
            maxConsecutive = Math.max(maxConsecutive, consecutiveMisses);
            consecutiveMisses = 0;
        }
    }
    maxConsecutive = Math.max(maxConsecutive, consecutiveMisses);

    if (maxConsecutive >= 3) riskScore += 30;
    else if (maxConsecutive === 2) riskScore += 10;

    // Cap score at 100
    return Math.min(Math.round(riskScore), 100);
};

export const getRiskLevel = (score) => {
    if (score < 20) return { level: 'Low', color: '#22c55e', message: 'Excellent adherence' };
    if (score < 50) return { level: 'Moderate', color: '#eab308', message: 'Missing some doses' };
    return { level: 'High', color: '#ef4444', message: 'Critical attention needed' };
};
