import React, { useEffect, useState } from "react";
import api from './services/api';

import "./styles.css";
import { findByLabelText } from "@testing-library/react";

function App() {
  
  const [repos, updateRepos] = useState([]);

	useEffect(() => {
		api.get('repositories').then(response => updateRepos(response.data));
	},[])

  async function handleAddRepository() {

    const response = await api.post('repositories', 
      {
        title: 'Some cool project',
        url: 'http://github.com/coolprj'
      })
    updateRepos([...repos, response.data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    updateRepos(repos.filter(repo => repo.id !== id));
  }

  return (
    <>
    <div style={{display : 'flex', flexWrap : 'wrap', marginLeft : -8, paddingLeft: 0}}>
        {repos.map(o => {
          return (
            <div key={o.id} className="repo">
                <label className="title">{o.title}</label>
                <div style={{marginTop : '10px', marginBottom: '10px'}}><ul>
                  {o.techs.map((tech,index) => <li className="tech" 
                    key={index}>{tech}</li>)}
                </ul></div>
                <div className="btnDiv"><button onClick={() => handleRemoveRepository(o.id)}>
                  Remover
                </button></div>
            </div>
          )}
        )}
    </div>
        <button onClick={handleAddRepository}>Adicionar</button>
        </>
  );
}

export default App;
