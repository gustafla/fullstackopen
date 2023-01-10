import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  const bmi = calculateBmi(height, weight);
  if (!bmi) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
  return res.json({ weight, height, bmi });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  // calculateExercises runs validations for its input and returns undefined if they are invalid
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    calculateExercises(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      daily_exercises, target
    );

  // calculateExercises returns undefined only when its input is invalid
  if (!result) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
