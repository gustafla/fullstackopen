type Rating = 1 | 2 | 3;
type RatingDescription = 'more exercise is required' | 'not too bad but could be better' | 'well done';
type Hours = number;

interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: Rating,
  ratingDescription: RatingDescription,
  target: Hours,
  average: Hours,
}

const isNonNegativeReal = (number: number): boolean => {
  return !isNaN(number) && isFinite(number) && number >= 0;
};

const describeRating = (rating: Rating): RatingDescription => {
  if (rating === 1) {
    return 'more exercise is required';
  }
  if (rating === 2) {
    return 'not too bad but could be better';
  }
  return 'well done';
};

const calculateExercises = (dailyHours: Hours[], target: Hours): Result | undefined => {
  const periodLength = dailyHours.length;

  if (periodLength === 0) {
    return undefined;
  }

  for (const hours of [...dailyHours, target]) {
    if (!isNonNegativeReal(hours)) {
      return undefined;
    }
  }

  const average = dailyHours.reduce((sum, h) => sum + h, 0) / periodLength;
  const rating: Rating = average < target - 0.5 ? 1 : average < target ? 2 : 3;

  return ({
    periodLength,
    trainingDays: dailyHours.filter((h) => h > 0).length,
    success: average >= target,
    rating,
    ratingDescription: describeRating(rating),
    target,
    average,
  });
};

export default calculateExercises;

let target: Hours | undefined;
const dailies: Hours[] = [];

for (const arg of process.argv) {
  const n = Number(arg);
  if (isNonNegativeReal(n)) {
    if (!target) {
      target = n;
      continue;
    }
    dailies.push(n);
  } else {
    // If args input contains wrongly formatted data in the middle, stop parsing and fail usage
    if (target) {
      target = undefined;
      break;
    }
  }
}

if (target && dailies.length !== 0) {
  console.log(calculateExercises(dailies, target));
} else {
  console.log("Usage: exerciseCalculator target [hours...]");
}
