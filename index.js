const connectToMongo = require("./db")
const express = require('express');
const cors = require('cors')
connectToMongo();

const app = express()
const port = 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`myNotes Backend running at  http://localhost:${port}`)
})