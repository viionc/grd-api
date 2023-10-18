const express = require("express");
const app = express();
const cors = require("cors");
const uuid = require("uuid");
const {createPersonObject, createFriendsArray} = require("../util/dataFunctions");

const {logger} = require("../util/logger");

const PEOPLE_LIMIT = 200;

app.use(express.static("./public"));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/api", (req, res) => {
    res.status(200).json(createPersonObject(1));
    return;
});

const users = {};

app.get("/api/q", (req, res) => {
    const {limit, friends, country} = req.query;
    const data = [];
    if (!limit && !friends && !country) return res.status(400).send("Invalid queries.");
    if (limit >= 5 && limit <= PEOPLE_LIMIT) {
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

app.get("/api/create/q", (req, res) => {
    const {reset, oldKey} = req.query;
    const apiKey = uuid.v4();
    users[apiKey] = {data: [createPersonObject(1)], usedIds: 1};
    if (reset) {
        delete users[oldKey];
    }
    console.log(users);
    res.status(200).send(JSON.stringify(apiKey));
});

app.get("/api/:apiKey", (req, res) => {
    const {apiKey} = req.params;
    if (!apiKey) return res.status(400).send("Provide API Key.");
    const user = users[apiKey];
    if (!user) res.status(400).send("Invalid API Key.");
    console.log(user);
    res.status(200).send(JSON.stringify(user.data));
});

app.post("/api/:apiKey", (req, res) => {
    const {apiKey} = req.params;
    if (!apiKey) return res.status(400).send("Provide API Key.");
    const user = users[apiKey];
    if (!user) res.status(400).send("Invalid API Key.");
    const person = req.body;
    const {firstName, lastName, age, country} = person;
    if (!firstName || !lastName || !age || !country) return res.status(400).send("Invalid queries.");
    user.usedIds += 1;
    person.id = user.usedIds;
    user.data.push(person);
    res.status(200).send(JSON.stringify(user.data));
});

app.put("/api/:apiKey/:id", (req, res) => {
    const {apiKey, id} = req.params;
    if (!apiKey) {
        res.status(400).send("Provide API Key.");
        return;
    }
    if (!id) {
        res.status(400).send("Invalid ID query.");
        return;
    }

    const user = users[apiKey];
    if (!user) {
        res.status(400).send("Invalid API Key.");
        return;
    }

    const {firstName, lastName, age, country, friends} = req.body;
    if (firstName || lastName || age || country || friends) {
        let person = user.data.find(p => p.id == id);
        if (!person) {
            res.status(400).send("No person data with that ID.");
            return;
        }
        if (friends && !Array.isArray(friends)) {
            res.status(400).send("Invalid friends query.");
            return;
        }
        person = {
            firstName: firstName || person.firstName,
            lastName: lastName || person.lastName,
            age: age || person.age,
            country: country || person.country,
            friends: friends || [],
            id: person.id,
        };
        user.data = user.data.map(p => {
            if (p.id == id) return person;
            return p;
        });
        res.status(200).send(JSON.stringify(person));
    } else {
        res.status(400).send("No new data to update.");
    }
});

app.get("/api/:apiKey/q", (req, res) => {
    const {apiKey} = req.params;
    if (!apiKey) {
        res.status(400).send("Provide API Key.");
        return;
    }
    const user = users[apiKey];
    if (!user) {
        res.status(400).send("Invalid API Key.");
        return;
    }
    const {add, friends, country} = req.query;
    if (!add && !friends && !country) {
        res.status(400).send("Invalid queries.");
        return;
    }

    const data = [];
    const userLimit = PEOPLE_LIMIT - user.data.length;
    if (userLimit <= 0) {
        res.status(400).send("Reached limit of 200 people.");
        return;
    }
    const limit = Math.min(userLimit, add);
    for (let i = 0; i < limit; i++) {
        user.usedIds++;
        data.push(createPersonObject(user.usedIds, country));
    }

    if (friends > limit) {
        res.status(200).send("Friends excited number of people in request.");
        return;
    }

    createFriendsArray(data, friends);
    user.data = [...user.data, ...data];
    res.status(200).send(JSON.stringify(user.data));
    return;
});

app.delete("/api/:apiKey/:id", (req, res) => {
    const {apiKey, id} = req.params;
    if (!apiKey) {
        res.status(400).send("Provide API Key.");
        return;
    }
    if (!id) {
        res.status(400).send("Invalid ID query.");
        return;
    }

    const user = users[apiKey];
    if (!user) {
        res.status(400).send("Invalid API Key.");
        return;
    }
    let person = user.data.find(p => p.id == id);
    if (!person) {
        res.status(400).send("No person data with that ID.");
        return;
    }
    user.data = user.data.filter(p => p.id != id);
    res.status(200).send(JSON.stringify(user.data));
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
});
