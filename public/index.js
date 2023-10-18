const apiKeyField = document.getElementById("api-key");
const generateAPIKeyButton = document.getElementById("api-key-button");
const resetAPIKeyButton = document.getElementById("reset-api-key-button");
let apiKey = localStorage.getItem("api-key");

window.addEventListener("load", () => {
    if (apiKey) {
        generateAPIKeyButton.classList.add("hidden");
        resetAPIKeyButton.classList.remove("hidden");
        apiKeyField.innerHTML = "Your API Key: " + apiKey;
    }
});

generateAPIKeyButton.addEventListener("click", () => {
    createApiKey(false);
});
resetAPIKeyButton.addEventListener("click", () => {
    createApiKey(true);
});

const postData = async () => {
    const person = {
        firstName: "Louis",
        lastName: "Doe",
        age: 45,
        country: "Germany",
    };

    //Math.ceil(Math.random() * 100)
    let response = await fetch("http://localhost:5000/api/", {
        method: "POST",
        body: JSON.stringify(person),
        headers: {"Content-Type": "application/json"},
    });
};

const createApiKey = async reset => {
    if (apiKey && !reset) return;
    let response;
    if (reset) {
        response = await fetch(`http://localhost:5000/api/create/q?reset=${reset}&oldKey=${apiKey}`);
    } else {
        response = await fetch(`http://localhost:5000/api/create/q?reset=${reset}`);
    }
    if (response.ok) {
        response = await response.json();
        apiKey = response;
        apiKeyField.innerText = response;
        generateAPIKeyButton.classList.add("hidden");
        resetAPIKeyButton.classList.remove("hidden");
        localStorage.setItem("api-key", response);
        apiKeyField.innerHTML = "Your API Key: " + response;

        return response;
    }
};

const fetchWithApiKey = async apikey => {
    let response = await fetch(`http://localhost:5000/api/${apikey}`);
    if (response.ok) {
        response = await response.json();
    }
};

const putData = async (apikey, id) => {
    const person = {
        age: Math.ceil(Math.random() * 100),
        country: "Poland",
    };
    let response = await fetch(`http://localhost:5000/api/${apikey}/${id}`, {
        method: "PUT",
        body: JSON.stringify(person),
        headers: {"Content-Type": "application/json"},
    });
    console.log(response);
};

const deleteData = async (apikey, id) => {
    let response = await fetch(`http://localhost:5000/api/${apikey}/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    });
    if (response.ok) {
        response = await response.json();
    }
    console.log(response);
};

const addData = async apikey => {
    let response = await fetch(`http://localhost:5000/api/${apikey}/q?add=25`);
    if (response.ok) {
        response = await response.json();
    }
    console.log(response);
};

const addDataWithKey = async (apikey, amount) => {
    if (amount > 200) throw new Error("Limit is 200.");
    let response = await fetch(`http://localhost:5000/api/${apikey}/q?add=${amount}`);
    if (response.ok) {
        response = await response.json();
    }
    console.log(response);
};
