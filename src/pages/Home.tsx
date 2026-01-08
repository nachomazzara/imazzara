import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGists, useProjects } from '../hooks'
import { trackLinkClick, trackPageView } from '../analytics'
import { blogPosts } from '../blogPosts'
import { resetMetaTags } from '../utils/metaTags'
import '../App.css'

function Home() {
  const projects = useProjects()
  const gists = useGists()

  useEffect(() => {
    resetMetaTags()
    trackPageView('/', 'Ignacio Mazzara')
  }, [])

  return (
    <>
      <div className="container">
        <h1> Hi, I'm Ignacio Mazzara</h1>
        <p>
          <b>Now:</b> VP of Engineering at{' '}
          <a
            href="https://decentraland.org"
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackLinkClick(
                'https://decentraland.org',
                'decentraland.org',
                'company'
              )
            }
          >
            decentraland.org
          </a>
        </p>
        <label>things...</label>
        <div className="content">
          {blogPosts.length > 0 && (
            <div>
              <h2>Notes</h2>
              <div>
                {blogPosts.map((post) => (
                  <ul key={post.slug} className="articles">
                    <li>
                      {post.published.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </li>
                    <li>
                      <Link
                        to={`/blog/${post.slug}`}
                        onClick={() =>
                          trackLinkClick(
                            `/blog/${post.slug}`,
                            post.title,
                            'blog_post'
                          )
                        }
                      >
                        {post.title}
                      </Link>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2>Projects</h2>
            <div>
              {projects.map((project) => (
                <ul key={project.title} className="articles">
                  <li>{project.role}</li>
                  <li>
                    <a
                      href={project.url}
                      target="blank"
                      onClick={() =>
                        trackLinkClick(project.url, project.title, 'project')
                      }
                    >
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
                      <a
                        href={gist.url}
                        target="blank"
                        rel="noreferrer"
                        onClick={() =>
                          trackLinkClick(
                            gist.url,
                            gist.title.replace(' - Security Review', ''),
                            'security_review'
                          )
                        }
                      >
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
          onClick={() =>
            trackLinkClick(
              'https://github.com/nachomazzara',
              'Github',
              'social'
            )
          }
        >
          Github
        </a>
        <a
          href="https://twitter.com/nachomazzara"
          target="blank"
          rel="noreferrer"
          onClick={() =>
            trackLinkClick(
              'https://twitter.com/nachomazzara',
              'Twitter',
              'social'
            )
          }
        >
          Twitter
        </a>
      </footer>
    </>
  )
}

export default Home

