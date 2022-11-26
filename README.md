Backend files for myNotes application
<br>
clone the repository:
```
    git clone https://github.com/Shreejal10/NodeJs-myNotes.git
```
Make sure Node is installed in your system. Then install the required packages using:
```
    npm install
```
This will install all the required packages.

Add a .env file to root directory with the following fields entered:
```
    Mongo_URL = Your MondoDB data base URl
    JWT_SECRET = Your JWT secret
    PORT = Port
```

In index.js change ``` https://0.0.0.0:${port}``` into ```https:localhost:${port} ```  as follow:
```javascript
app.listen(port, () => {
    console.log(`myNotes Backend running at  https:localhost:${port}`)
})
```
Then run the server using:
```
    npx nodemon ./index.js
```