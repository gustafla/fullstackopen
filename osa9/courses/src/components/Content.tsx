import Part from './Part';
import { CoursePart } from '../App';

interface Props {
  courseParts: CoursePart[],
}

const Content = ({ courseParts }: Props) => {
  return (
    <div>
      {courseParts.map(p => <Part key={p.name} part={p} />)}
    </div>
  );
}

export default Content;
