const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./user'); // seu model de usuário

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// URL de conexão MongoDB Atlas
const uri = 'mongodb+srv://lfpsweb:Luiz120hz1243@projetin.hnmjyeq.mongodb.net/projetinho?retryWrites=true&w=majority&appName=Projetin';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB Atlas!'))
.catch(err => console.error('Erro ao conectar:', err));

// Rota raiz - serve main.html (login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// Rota para servir página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// POST para registro de usuário
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email e senha obrigatórios.' });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email já cadastrado.' });

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// POST para login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email e senha obrigatórios.' });

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(401).json({ error: 'Credenciais inválidas.' });

    res.json({ message: 'Login bem-sucedido.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
