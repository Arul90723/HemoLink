/**
 * Emergency Priority Engine
 * Logic: Sort requests by Urgency Weight (Critical = 3, Urgent = 2, Normal = 1) * Time Elapsed.
 */

const URGENCY_WEIGHTS = {
  CRITICAL: 3,
  URGENT: 2,
  NORMAL: 1
};

const calculatePriorityScore = (request) => {
  const weight = URGENCY_WEIGHTS[request.urgency] || 1;
  const timeElapsedMs = Date.now() - new Date(request.createdAt).getTime();
  const timeElapsedHours = timeElapsedMs / (1000 * 60 * 60);
  
  // To avoid 0 score for just created requests, we add a base value or use Math.max(1, hours)
  const effectiveHours = Math.max(0.1, timeElapsedHours);
  
  return weight * effectiveHours;
};

exports.sortRequestsByPriority = (requests) => {
  return requests.sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    return scoreB - scoreA; // Descending order
  });
};
