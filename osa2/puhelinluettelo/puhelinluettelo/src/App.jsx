import React, { useState, useEffect } from 'react';
import personService from './services/persons';
import './index.css';

const Notification = ({ message, messageType }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`notification ${messageType}`}>
      {message}
    </div>
  );
};

const FilterForm = ({ filter, handleFilterChange }) => (
  <form>
    <div>filter shown with: <input value={filter} onChange={handleFilterChange} /></div>
  </form>
);

const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addName}>
    <div>name: <input value={newName} onChange={handleNameChange} /></div>
    <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
);

const Person = ({ person, handleDelete }) => (
  <li>{person.name} {person.number}
    <button onClick={() => handleDelete(person.id)}>Delete</button>
  </li>
);

const Persons = ({ personsToShow, handleDelete }) => (
  <ul>
    {personsToShow.map((person) => (
      <Person key={person.id} person={person} handleDelete={handleDelete} />
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    // error viesti jos nimi on alle 3 kirjainta pitkä
    if (newName.length < 3) {
      setNotificationMessage(`Name must be at least 3 characters long.`);
      setMessageType('error');
      setTimeout(() => {
        setNotificationMessage(null);
        setMessageType(null);
      }, 5000);
      return;
    }
    // error viesti jos numero on liian lyhyt ja jos se ei koostu kahdesta oikein koostetusta osasta
    if (!/^\d{2,3}-\d+$/.test(newNumber) || newNumber.length < 8) {
      setNotificationMessage(`Number must be at least 8 characters long and in the format XX-XXXXXXX or XXX-XXXXXXX.`);
      setMessageType('error');
      setTimeout(() => {
        setNotificationMessage(null);
        setMessageType(null);
      }, 5000);
      return;
    }

    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response));
            setNewName('');
            setNewNumber('');
            setNotificationMessage(`${existingPerson.name} was updated successfully.`);
            setMessageType('success');
            setTimeout(() => {
              setNotificationMessage(null);
              setMessageType(null);
            }, 5000);
          })
          .catch(error => {
            console.log('Error updating person:', error);
            setNotificationMessage(
              `Person '${existingPerson.name}' was already removed from server`
            );
            setMessageType('error');
            setTimeout(() => {
              setNotificationMessage(null);
              setMessageType(null);
            }, 5000);
            setPersons(persons.filter(person => person.id !== existingPerson.id));
          });
      }
      return;
    }

    personService
      .create({ name: newName, number: newNumber })
      .then(response => {
        setPersons(persons.concat(response));
        setNewName('');
        setNewNumber('');
        setNotificationMessage(`${response.name} was added successfully.`);
        setMessageType('success');
        setTimeout(() => {
          setNotificationMessage(null);
          setMessageType(null);
        }, 5000);
      })
      .catch(error => {
        console.log('Error adding person:', error);
        setNotificationMessage(error.response.data.error);
        setMessageType('error');
        setTimeout(() => {
          setNotificationMessage(null);
          setMessageType(null);
        }, 5000);
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (window.confirm(`Do you really want to delete ${personToDelete.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotificationMessage(`${personToDelete.name} was deleted successfully.`);
          setMessageType('success');
          setTimeout(() => {
            setNotificationMessage(null);
            setMessageType(null);
          }, 5000);
        })
        .catch(error => {
          console.log('Error deleting person:', error);
          setNotificationMessage('Failed to delete person.');
          setMessageType('error');
          setTimeout(() => {
            setNotificationMessage(null);
            setMessageType(null);
          }, 5000);
        });
    }
  };

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} messageType={messageType} />
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
