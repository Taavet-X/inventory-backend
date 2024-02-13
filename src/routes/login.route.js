const express = require('express')
const router = express.Router()


router.post('/', async (req, res) => {    
    try{
        if(req.body.username == "admin" && req.body.password == "admin"){
            res.status(200).json("jwt here") 
        } else {
            throw new Error("Usuario o contraseña incorrecta")
        }        
    } catch (e){
        console.log(e)
        res.status(503).json(e.message)
    }
})

module.exports = router