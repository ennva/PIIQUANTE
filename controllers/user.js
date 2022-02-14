const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()

//signup controller
exports.signup = async (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body.email && body.password) {
        return res.status(400).send({ error: "Data not format properly" });
    }

    //verifier si l'email n'existe pas dejà
    const userFound = await User.findOne({ email: body.email });
    if (userFound) {
        return res.status(400).send({ error: "L'utilisateur " + body.email + " existe déjà." })
    }

    //creer un nouveau document moongo a partir des donnees de l'utilisateur
    const user = new User(body);
    // generer un salt pour hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    // hachage du mot de passe
    user.password = await bcrypt.hash(user.password, salt)
    user.save().then(() => res.status(201).send({message: "Welcome"}));
}

//login controller
exports.login = async (req, res) => {

    const body = req.body;
    //console.log(body);
    const user = await User.findOne({ email: body.email });
    if (user) {
        const idObj = user._id; 
        
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (validPassword) {
            //creer un token d'une duree de 1h
            const token = jwt.sign(
                { user_id: idObj.toString() },
                process.env.APP_SECRET,
                { expiresIn: "1h" }
            );
            //console.log(token);
            
            return res.status(200).json({ userId: idObj.toString(), token: token });
        } else {
            return res.status(400).send({ error: "Invalid Password" })
        }
    } else {
        return res.status(401).send({ error: "Username or Password not valid" })
    }

}