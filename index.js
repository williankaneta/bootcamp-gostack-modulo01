const express = require('express');

const server = express();

//Necessário informar que o Express utilizara Json
server.use(express.json());

// Query Params  = ?teste=1
// Query Params  = /users/1
// Request body = { "name": "Diego", "email": "tetsuokaneta@gmail.com" }

//CRUD - Creat, Read, Update, Delete

const users = ['Willian', 'Diego', 'Rocketseat'];

//Middlewares
server.use((req, res, next) =>{
  console.time('Request');
  console.log(`Metodo: ${req.method}; URL ${req.url}`);
  next();
  console.timeEnd('Request');
})

//Middleware para verificar se usuário existe
//Utilizado no metodo como no exemplo:
//server.post('/users', checkUserExists ,(req, res)
function checkUserExists(req, res, next){
  if(!req.body.name){
    return res.status(400).json({ error: 'User name is required'});
  }

  return next();
}

//Middleware para verificar se usuário existe no array users
function checkUserInArray(req, res, next){
  const user = users[req.params.index];
  
  if(!user){
    return res.status(400).json({ error: 'User does not exists'});
  }

  req.user = user;

  return next();
}
//Metódo Get - Listagem todos os usuários
server.get('/users',checkUserInArray,(req, res) =>{
  return res.json(users);
})

//Metódo Get - Listagem de 1 usuário
server.get('/users/:index',checkUserInArray, (req, res) =>{
  return res.json(req.user);
})

//Metodo Post - Inclusão de 1 usuário
server.post('/users',checkUserExists ,(req, res) =>{
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

//Metodo Put - Alteração de 1 usuário
server.put('/users/:index',checkUserInArray,checkUserExists, (req,res) =>{
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

//Metodo Delete - Deleção de 1 usuário
server.delete('/users/:index',checkUserInArray,(req, res) =>{
  const { index } = req.params;
  
  users.splice(index, 1);

  return res.send();

})

//Definindo a porta da rota
server.listen(3000);