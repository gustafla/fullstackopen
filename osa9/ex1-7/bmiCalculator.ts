type Centimeters = number
type Kilograms = number
type BmiCategory = 'Underweight' | 'Normal (healthy weight)' | 'Overweight' | 'Obese'

const isPositiveReal = (number: number): boolean => {
  return !isNaN(number) && isFinite(number) && number > 0
}

const calculateBmi = (height: Centimeters, weight: Kilograms): string | undefined => {
  if (!isPositiveReal(height) || !isPositiveReal(weight)) {
    return undefined
  }

  const meters = height / 100
  const bmi = weight / (meters * meters)

  if (bmi >= 30) {
    return 'Obese'
  }
  if (bmi >= 25) {
    return 'Overweight'
  }
  if (bmi >= 18.5) {
    return 'Normal (healthy weight)'
  }
  return 'Underweight'
}

let height, weight

for (const arg of process.argv) {
  const n = Number(arg)
  if (isPositiveReal(n)) {
    if (!height) {
      height = n
      continue
    }
    weight = n
    break
  }
}

if (height && weight) {
  console.log(calculateBmi(height, weight))
} else {
  console.log("Usage: bmiCalculator height weight (in cm and kg)")
}
