const users = [
    {
        "email": "hello@gmail.com",
        "password": "mypass"
    },
    {
        "email": "hello1@gmail.com",
        "password": "mypass"
    }
]

/*
const auth = {
    "email": {type: String, match: /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/ },
    "password": String
}
*/

exports.find = () => {
    return new Promise((resolve, reject) => resolve(JSON.parse(JSON.stringify(users))))
}

exports.save = (user) => {
    return new Promise((resolse, reject) => resolse(users.push(user)));
}

exports.hello = () => {
    return new Promise((resolve, reject) => resolve(users[0]));
}