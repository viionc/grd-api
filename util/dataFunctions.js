const {getRandomFirstName} = require("./firstNames");
const {getRandomLastName} = require("./lastNames");
const {getRandomCountry} = require("./countries");

const createPersonObject = (index, countryQuery) => {
    let id = index;
    let firstName = getRandomFirstName();
    let lastName = getRandomLastName();
    let age = Math.ceil(Math.random() * 100);
    let country = getRandomCountry(countryQuery);
    let friends = [];
    return {id, firstName, lastName, age, country, friends};
};

const createFriendsArray = (people, numbersOfFriends = 3) => {
    people.forEach(person => {
        person.friends = [];
        let number = Math.floor(Math.random() * numbersOfFriends);
        for (let i = 0; i < number; i++) {
            addFriend(people, person);
        }
    });
};

const addFriend = (people, person) => {
    let peopleIndex = Math.floor(Math.random() * people.length);
    if (person.friends.find(p => p.id === people[peopleIndex]) || peopleIndex === person.id) {
        return addFriend(people, person);
    }
    person.friends.push({
        id: people[peopleIndex].id,
        firstName: people[peopleIndex].firstName,
        lastName: people[peopleIndex].lastName,
    });
};

module.exports = {createPersonObject, createFriendsArray};
