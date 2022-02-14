const Auth = require('../models/Auth')

exports.hello = (req, res, next) => {
    Auth.hello().then(
        (user) => {
            if(!user){
                return res.status(404).send(new Error('user not found!'))
            }
            res.status(200).json(user);
        }
    )
    .catch(
        () => {
            res.status(500).send(new Error('Database error!'));
        }
    )
}

exports.signup = (req, res, next) => {
    
}