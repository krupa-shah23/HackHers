// Client-side analysis for zero-latency insights
export const analyzeDosePatterns = (logs, medications) => {
    const insights = [];

    // 1. Check for missed doses
    const missedLogs = logs.filter(l => l.status === 'missed');
    if (missedLogs.length > 2) {
        insights.push({
            _id: 'local-1',
            type: 'alert',
            title: '⚠️ Missed Doses',
            message: `You have missed ${missedLogs.length} doses recently.`,
            priority: 1
        });
    }

    // 2. Simple adherence calc
    if (logs.length > 10) {
        const taken = logs.filter(l => l.status === 'taken').length;
        const rate = Math.round((taken / logs.length) * 100);
        if (rate > 90) {
            insights.push({
                _id: 'local-2',
                type: 'celebration',
                title: '🎉 Great Consistency',
                message: `Your adherence rate is ${rate}%!`,
                priority: 2
            });
        }
    }

    return insights;
};
