import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient()

const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/usuarios', async(req, res) => {
    let users = [];
    if(req.query){
        users= await prisma.user.findMany({ 
            where:{
                name:req.query.name,
                age:req.query.age,
                email:req.query.email
            }
        })}else{
            users=await prisma.user.findMany()
        }
    res.status(200).json(users)
})

app.delete('/usuarios/:id', async(req,res)=>{
    await prisma.user.delete({
    where:{
        id:req.params.id
    }
})
    res.status(200).json('Usuario deletado')
})

app.post('/usuarios', async(req,res)=>{
    await prisma.user.create({
        data: {
        age:req.body.age,
        email:req.body.email,
        name:req.body.name
    }
})
    res.status(201).json(req.body)
})

app.put('/usuarios/:id', async(req,res)=>{
    await prisma.user.update({
        where:{
            id:req.params.id
        },
        data:{
            age:req.body.age,
            email:req.body.email,
            name:req.body.name
        }
        
    })
    res.status(201).json(req.body)
})


app.listen(5050, function() {
    console.log("servidor rodando");
  });