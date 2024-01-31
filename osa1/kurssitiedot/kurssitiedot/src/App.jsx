const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>



const Content = ({ parts }) => 
  <>
    <Part
      part={parts[0]} 
    />
    <Part
      part={parts[1]} 
    />
    <Part
      part={parts[2]} 
    />      
  </>




const Total = (props) => {
  return (
    <p>Number of exercises {props.sum}</p>
  )
}




const App = () => {
  const kurssi = 'Half Stack application development'
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course.name} />
      <Content parts = {course.parts}/>
      <Total sum={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} />
    </div>
  );
};


export default App