const express = require("express");
const path = require("path");
const app = express();
const {getRandomFirstName} = require("../util/firstNames");
const {getRandomLastName} = require("../util/lastNames");
const {getRandomCountry} = require("../util/countries");
const {logger} = require("../util/logger");

app.use(express.static("./public"));
app.use(logger);
app.get("/", (req, res) => {});

app.get("/api", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.status(200).json(createPersonObject(1));
    return;
});

app.get("/api/q", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    const {limit, friends, country} = req.query;
    const data = [];
    if (limit >= 5 && limit <= 200) {
        for (let i = 0; i < limit; i++) {
            data.push(createPersonObject(i, country));
        }
    } else {
        res.status(200).send("Limit has to be between 5 and 200.");
        return;
    }
    if (friends > limit) {
        res.status(200).send("Friends excited number of people in request.");
        return;
    }
    createFriendsArray(data, friends);
    res.status(200).send(data);
    return;
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
});

const createPersonObject = (index, countryQuery) => {
    let id = index;
    let firstName = getRandomFirstName();
    let lastName = getRandomLastName();
    let age = Math.ceil(Math.random() * 100);
    let country = getRandomCountry(countryQuery);
    return {id, firstName, lastName, age, country};
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
