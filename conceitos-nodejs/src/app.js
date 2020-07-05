const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  let data = [];
  if (!Array.isArray(request.body)) {
    data.push(request.body)
  } else {
    data = request.body
  }
  for (var i = 0; i < data.length; i++) {
    var { id, title, url, techs } = data[i];
    if (id == undefined) {
      id = uuid();
    }
    const jsonData = { id, title, url, techs, likes:0 };
    repositories.push(jsonData);
  }
  return response.json(data);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const id = request.params.id;
 
  const index = repositories.findIndex(data => data.id == id)
  if (index < 0) {
    return response.status(400).json({ error: "ID inválido ou inexistente"});
  }

  toUpdate = repositories[index];
  const newData = { id, title, url, techs, likes: toUpdate.likes }
  repositories[index] = newData;

  return response.json(newData);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const index = repositories.findIndex(o => o.id == id)
  if (index < 0) {
    return response.status(400).json({error: "ID inválido/inexistente"})
  }
  repositories.splice(index, 1);
  return response.status(204).send('');
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  const index = repositories.findIndex(o => o.id == id);
  if (index < 0) {
    return response.status(400).json({error: "ID inválido/inexistente"});
  }
  repositories[index].likes++;
  return response.json(repositories[index]);
});

module.exports = app;
