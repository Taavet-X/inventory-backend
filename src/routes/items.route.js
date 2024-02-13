const express = require('express')
const router = express.Router()
const { create, findAll, findOne, update, remove, updateStock, deleteAll } = require('../services/items.service')

router.post('/', async (req, res) => {    
    try{
        const result = await create(req.body)
        res.status(200).json(result) 
    } catch (e){
        console.log(e)
        res.status(503).json(e.message)
    }
})

router.get('/:page', async (req, res)=>{
    try{        
        if(req.query.delete_all){
            const result = await deleteAll()
            res.status(200).json(result) 
        } else {
            const result = await findAll(req.query.search_value,req.params.page,req.query.low_quantity)
            res.status(200).json(result) 
        }
    } catch (e){
        console.log(e)
        res.status(503).json(e.message)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const result = await findOne(req.params.id)
        res.status(200).json(result) 
    } catch (e){
        console.log(e)
        res.status(503).json(e.message)
    }        
})

router.put('/:id', async (req, res) => {
    try{
        const result = await update(req.params.id, req.body)
        res.status(200).json(result) 
    } catch (e){
        console.log(e)
        res.status(503).json(e.message)
    }        
})

router.patch('/:id', async (req, res) => {
    try{
        const result = await updateStock(req.params.id, req.body.value)
        res.status(200).json(result) 
    } catch (e){
        console.log(e)
        res.status(503).json(e.message)
    }        
})

router.delete('/:id', async (req, res) => {    
    try{
        const result = await remove(req.params.id)
        res.status(200).json(result) 
    } catch (e){
        console.log(e)
        res.status(503).json(e.message)
    }        
})

module.exports = router