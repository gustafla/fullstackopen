import { CoursePart } from '../App';

interface Props {
  part: CoursePart
}

const Part = ({ part }: Props) => {
  /**
   * Helper function for exhaustive type checking
   */
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled part type: ${JSON.stringify(value)}`
    );
  };

  const commaSeparated = (strings: string[]): string => {
    const first = strings[0];
    if (!first) {
      return "none";
    }

    return strings.slice(1).reduce((ret, str) => ret + ", " + str, first);
  }

  switch (part.type) {
    case "normal":
      return (<div>
        <h2>{part.name} {part.exerciseCount}</h2>
        <p><i>{part.description}</i></p>
      </div>);
    case "groupProject":
      return (<div>
        <h2>{part.name} {part.exerciseCount}</h2>
        <p>project exercises {part.groupProjectCount}</p>
      </div>);
    case "submission":
      return (<div>
        <h2>{part.name} {part.exerciseCount}</h2>
        <p><i>{part.description}</i></p>
        <p>submit to <a href={part.exerciseSubmissionLink}>{part.exerciseSubmissionLink}</a></p>
      </div>);
    case "special":
      return (<div>
        <h2>{part.name} {part.exerciseCount}</h2>
        <p><i>{part.description}</i></p>
        <p>required skills: {commaSeparated(part.requirements)} </p>
      </div>);
    default:
      return assertNever(part);
  }
}

export default Part;
