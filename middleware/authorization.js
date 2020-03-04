'use strict'

const jwt  = require('jsonwebtoken');
const { User, Todo } = require('../models');

module.exports = function(req, res, next){
    
    try {
        const access_token = req.headers.access_token
        const todo_id = req.params.id
        Todo.findAll({
            include: [ User ],
            where: {
                id : todo_id
            }
        })
        .then(result => {
            const todoBelongsTo = result[0].dataValues.User

            const decoded_token = jwt.verify(access_token, process.env.SECRET)
            const {id, email} = decoded_token.id

            if (Number(todoBelongsTo.dataValues.id) !== Number(id) && todoBelongsTo.email !== email) {
                const error = {
                    status : 401,
                    message : `You have no rights to this property, access denied!`
                }
                throw error
            } else {
                next()
            }
            
        })
        .catch(err => {
            res.status(err.status).json({"Error Message": err.message})
        })

    } catch (error) {
        
    }
}
