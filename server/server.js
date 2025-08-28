import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // permite req.body em JSON

// Criar usuário
app.post('/usuario', async (req, res) => {
  const { name, email } = req.body;
  const usuario = await prisma.usuario.create({
    data: { name, email }
  });
  res.status(201).json(usuario);
});

// Listar todos usuários
app.get('/usuario', async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

// Buscar usuário por ID(id vira variavel)
app.get('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(id) } });
  if (!usuario) return res.status(404).send('Usuário não encontrado');
  res.json(usuario);
});

// Atualizar usuário
app.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const usuario = await prisma.usuario.update({
    where: { id: parseInt(id) },
    data: { name, email }
  });
  res.json(usuario);
});

// Deletar usuário
app.delete('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.usuario.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
});


app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
