const express = require('express')
const path = require('path')
const cors = require('cors');

//routes
//const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce');

const app = express()

//Set response Headers for CORS
app.use(cors());
/*
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})
*/


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

app.use(express.urlencoded({extended: true}))
// pour parser les donnees JSON de la requete
app.use(express.json());

//connection a mongoDb
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/sauces', { useNewUrlParser: true })
db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('connected to MongoDB with mongoose')
})

//enregistrer les routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", verifyToken ,sauceRoutes);

function verifyToken(req, res, next){
    //console.log(req.headers);
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403).send({ error: "Invalid Token"});
    }

}

module.exports = app;

/*
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})
db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('connected to MongoDB with mongoose')
})

app.get('/', (req, res) => {
    res.send('Hello Word')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

*/