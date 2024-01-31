import React from 'react';

const StatisticLine = ({ label, value }) => {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistic = ({ text, value }) => (
  <div>
    {text}: {value}
  </div>
);

const Header = (props) => {
  return <h1>{props.header}</h1>;
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const Display = (props) => {
  return <div>{props.counter}</div>;
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  // Only display statistics when feedback is given.
  if (all === 0) {
    return <p>No feedback given.</p>;
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine label="Good" value={good} />
          <StatisticLine label="Neutral" value={neutral} />
          <StatisticLine label="Bad" value={bad} />
          <StatisticLine label="All" value={all} />
          <StatisticLine label="Average" value={average} />
          <StatisticLine label="Positive (%)" value={positive} />
        </tbody>
      </table>
    );
  }
};

const App = () => {
  const otsikko1 = 'give feedback';
  const otsikko2 = 'statistics';

  const [good, setGood] = React.useState(0);
  const [neutral, setNeutral] = React.useState(0);
  const [bad, setBad] = React.useState(0);

  const all = good + neutral + bad;
  const average = (good + neutral * 0 + bad * -1) / (good + neutral + bad);
  const positive = (good / (good + neutral + bad)) * 100;

  return (
    <div>
      <Header header={otsikko1} />

      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <Header header={otsikko2} />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
