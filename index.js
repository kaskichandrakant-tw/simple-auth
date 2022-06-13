const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
let users = []
app.use(
    express.urlencoded({
        extended: true
    })
)

function findUser(username) {
    let userFound = users.filter(usr => usr["username"] === username)
    return userFound[0]
}

app.use(express.json())

app.post("/auth/login", (req, res) => {
    let {username, password} = req.body
    let user = findUser(username)
    if (!user) {
        res.status(401)
        // bcrypt.compareSync(password, user["password"])
        res.send("username does not exists");
        // res.send("invalid credentials");
        return
    }
    if (!bcrypt.compareSync(password, user["password"])) {
        res.status(401)
        res.send("password does not match");
        // res.send("invalid credentials");
        return
    }
    res.send("Hello " + username)
});

app.post("/auth/signup", (req, res) => {
    let {username, password} = req.body
    const hashedPassword = bcrypt.hashSync(password, 10);
    let user = findUser(username)
    if (user) {
        res.status(401)
        res.send("username already exists");
        // res.send("unable to add user");
        return
    }
    users.push({username, password: hashedPassword})
    res.send("signe up successful")
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});