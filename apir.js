//segurança
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
//validar:
const { body, query, validationResult } = require('express-validator');
//base:
const app = express();
const express = require('express');
//consulta bd
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

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

app.post('/usuarios',  [
    body('email').isEmail().withMessage('Email inválido'),
    body('pass').isLength({ min: 6 }).withMessage('Senha precisa ter no mínimo 6 caracteres'),
    body('fullname').notEmpty().withMessage('Nome é obrigatório'),
    body('age').optional().isInt({ min: 0 }).withMessage('Idade precisa ser um número positivo'),
  ] , 
  async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
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
    res.status(201).json({message: "Usuario criado com sucesso"})
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


https.createServer(options, app).listen(5050, () => {
  console.log("Servidor HTTPS rodando na porta 5050");
});