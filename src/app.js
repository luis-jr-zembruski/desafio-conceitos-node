const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRespositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.'});
  }

  return next();
}

app.use("/repositories/:id", validateRespositoryId);
app.use("/repositories/:id/like", validateRespositoryId);


app.get("/repositories", (request, response) => response.json(repositories) );

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id:uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Respository not found.'});
  }

  const likes = repositories[repositoryIndex].likes
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) =>{

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found."});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Respository not found.'});
  }
  let { title, url, techs, likes } = repositories[repositoryIndex];
  likes = likes + 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
