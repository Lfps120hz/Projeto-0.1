const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const uri = 'mongodb+srv://lfpsweb:Luiz120hz1243@projetin.hnmjyeq.mongodb.net/projetinho?retryWrites=true&w=majority&appName=Projetin';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB Atlas!'))
.catch(err => console.error('Erro ao conectar:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'Usuário já cadastrado.' });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
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
