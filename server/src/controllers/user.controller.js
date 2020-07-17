const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const dbConfig = require('../../config/database.config.js')
const Auth = require('../auth/auth')


mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Successfully connected to the database')
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err)
    process.exit()
})
// const connection = mongoose.connection
// connection.once("open",() => {
// connection.db.listCollections().toArray(function(err, names) {
//     if (err) {
//     console.log(err);
//     } else {
//         console.log(names)
//         mongoose.connection.db.dropCollection(
//             "users",
//             function(err, result) {
//                 console.log("Collection droped");
//             }
//         );
//     }
//     });  
// })  
const User = require('../models/users.model')


const createUser = (req, res) => {
    const { firstName, lastName, password, email } = { ...req.body }
    bcrypt.hash(password, 10, (hash_error, hash) => {
        const user = new User({ firstName, lastName, password: hash, email })
        User.find({ email: email }).exec((error, data) => {
            if (error != null) {
                return res.status(500).send({ message: 'Could not create the user!', error })
            }
            if (data.length == 0) {
                user.save()
                    .then((savedUser) => {
                        res.status(200).send({ id: savedUser._id })
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).send({ message: 'Could not create the user!', error: err })
                    })
            }
            else {
                res.status(500).send({ message: 'Username is in use!' })
            }
        })
    })
}

const verifyUser = (req, res) => {
    const { password, email } = { ...req.body }
    User.findOne({ email: email }).exec((error, data) => {
        if (error !== null)
            res.status(401).send({ message: 'Not able to login!' })
        else if (data == null)
            res.status(401).send({ message: 'Invalid credentials!' })
        else {
            const hash = data.password
            bcrypt.compare(password, hash, (err, result) => {
                if (err || !result) {
                    res.status(401).send({ message: 'Invalid credentials!' })
                }
                else {
                    const token = Auth.generateAccessToken({ id: data._id })
                    const refreshToken = Auth.generateRefreshToken({ id: data._id })
                    res.status(200).send({ token, refreshToken })
                }
            })
        }
    })
}

const getUserById = (req, res) => {
    User.findById(req.params.userId).then((result) => {
        if (!result) {
            return res.status(404).send({ message: 'User not found with id ' + req.params.userId });
        }
        res.status(200).send(result)
    }).catch((err) => {
        res.status(500).send({ message: 'Could not retrieve the user!' })
    })
}

const getUsers = (req, res) => {
    User.find().then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(500).send({ message: 'Could not get all users!' })
    })
}

const removeAllUsers = (req, res) => {
    User.deleteMany({}).then((result) => {
        res.status(200).send({ message: 'Successfully removed all users!' })

    }).catch((err) => {
        res.status(500).send({ message: 'Successfully removed all users!' })
    })

}

const operations = { createUser, verifyUser, getUsers, getUserById, removeAllUsers }

module.exports = operations
