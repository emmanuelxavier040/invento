const jwt = require('jsonwebtoken')

const securityConfig = require('../../config/security.config.js')


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, securityConfig.accessTokenSecret, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token!' })
        req.user = user
        next()
    })
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, securityConfig.accessTokenSecret,
        { expiresIn: securityConfig.accessTokenExpiry })
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, securityConfig.refreshTokenSecret,
        { expiresIn: securityConfig.refreshTokenExpiry })
}

const generateAccessTokenWithRefreshToken = (req, res) => {
    let refreshToken = req.body.refreshToken
    jwt.verify(refreshToken, securityConfig.refreshTokenSecret, (err, user) => {
        if (err) return res.sendStatus(403)
        const token = generateAccessToken({ id: user._id })
        refreshToken = generateRefreshToken({ id: user._id })
        res.json({ token, refreshToken })
    })
}

module.exports = { authenticateToken, generateAccessToken, generateRefreshToken, generateAccessTokenWithRefreshToken }
