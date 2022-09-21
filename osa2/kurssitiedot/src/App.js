const Header = ({ name }) => {
  return (
    <h1>{name}</h1>
  )
}

const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(p => <Part part={p} key={p.id}></Part>)}
    </div>
  )
}

const Total = ({ parts }) => {
  return (
    <p><b>Total of {parts.map(p => p.exercises).reduce((sum, cur) => sum += cur, 0)} exercises</b></p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name}></Header>
      <Content parts={course.parts}></Content>
      <Total parts={course.parts}></Total>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2,
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3,
      }
    ]
  }

  return (
    <Course course={course} />
  )
}

export default App;
