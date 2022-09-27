const Header = ({ name }) => {
  return (
    <h2>{name}</h2>
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

export default Course
