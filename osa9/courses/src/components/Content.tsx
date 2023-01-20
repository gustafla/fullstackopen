import {CoursePart} from '../App';

interface Props {
  courseParts: CoursePart[],
}

const Content = ({courseParts}: Props) => {
  return (
    <div>
      {courseParts.map(p => <p key={p.name}>{p.name} {p.exerciseCount}</p>)}
    </div>
  );
}

export default Content;
