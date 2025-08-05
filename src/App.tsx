import React from 'react'

import { useGists, useProjects } from './hooks'

import './App.css'

function App() {
  const projects = useProjects()
  const gists = useGists()

  return (
    <>
      <div className="container">
        <h1> Hi, I'm Ignacio Mazzara</h1>
        <p>
          <b>Now:</b> VP of Engineering at{' '}
          <a href="https://decentraland.org" target="_blank" rel="noreferrer">
            decentraland.org
          </a>
        </p>
        <label>things...</label>
        <div className="content">
          <div>
            <h2>Projects</h2>
            <div>
              {projects.map((project) => (
                <ul key={project.title} className="articles">
                  <li>{project.role}</li>
                  <li>
                    <a href={project.url} target="blank">
                      {project.title}
                    </a>
                  </li>
                </ul>
              ))}
            </div>
          </div>
          {!!gists.length && (
            <div>
              <h2>Security Reviews</h2>
              <div>
                {gists.map((gist) => (
                  <ul key={gist.title} className="articles">
                    <li>{`${gist.published.getMonth()}-${gist.published.getFullYear()}`}</li>
                    <li>
                      <a href={gist.url} target="blank" rel="noreferrer">
                        {gist.title.replace(' - Security Review', '')}
                      </a>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer>
        <a
          href="https://github.com/nachomazzara"
          target="blank"
          rel="noreferrer"
        >
          Github
        </a>
        <a
          href="https://twitter.com/nachomazzara"
          target="blank"
          rel="noreferrer"
        >
          Twitter
        </a>
      </footer>
    </>
  )
}

export default App
