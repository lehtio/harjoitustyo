const Header = (props) => {
    return <h1>{props.course}</h1>
  }
  
  
  const Total = (props) => {
    const summa= props.part.reduce((sum,part) =>  sum +part.exercises,0);
    console.log(summa)
    return (
      <div>
        <p><strong>Total of {summa} exercises</strong></p>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part} {props.exercises}
      </p>
    )
  }
  
  const Content = (props) => {
    console.log('mikä on', props.part)
    return (
      <div>
        {props.part.map(part => (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        ))}
      </div>
    )
  }
  const Course = (props) => {
    console.log(props.course.parts) 
    return (
      <div>
        <Header course={props.course.name} />
        <Content part={props.course.parts} />
        <Total part={props.course.parts} />
      </div>
    )
  }
  
  export default Course