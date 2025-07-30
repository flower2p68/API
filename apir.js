const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()
const https = require('https');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(express.json());
app.use(helmet());

const options = {
    key:fs.readFileSync('key.pem'),
    cert:fs.readFileSync('cert.pem'),
};

app.get('/usuarios', async(req, res) => {
    let users = [];
    if(req.query){
        users= await prisma.user.findMany({ 
            where:{
                fullname:req.query.fullname,
                age:req.query.age,
                email:req.query.email,
                pass:req.query.pass
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
    const { age, email, fullname, pass} = req.body;
        
    const pashash = await bcrypt.hash(pass,10);
    await prisma.user.create({
        data: {
        age,
        email,
        fullname,
        pass:pashash
    }
})
    res.status(201).json(req.body, "Usuario criado com sucesso")
})

app.put('/usuarios/:id', async(req,res)=>{
    await prisma.user.update({
        where:{
            id:req.params.id
        },
        data:{
            age:req.body.age,
            email:req.body.email,
            fullname:req.body.fullname
        }
        
    })
    res.status(201).json(req.body)
})


app.listen(5050, function() {
    console.log("servidor rodando");
  });