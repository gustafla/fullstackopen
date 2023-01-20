import { CoursePart } from '../App';

interface Props {
  courseParts: CoursePart[],
}

const Total = ({ courseParts }: Props) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  )
}

export default Total;
