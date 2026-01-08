import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useGists, useProjects } from '../hooks'
import { trackLinkClick, trackPageView } from '../analytics'
import { blogPosts } from '../blogPosts'
import '../App.css'

function Home() {
  const projects = useProjects()
  const gists = useGists()

  useEffect(() => {
    trackPageView('/', 'Nacho Mazzara')
  }, [])

  return (
    <>
      <Helmet>
        <title>Nacho Mazzara</title>
        <meta name="title" content="Nacho Mazzara" />
        <meta name="description" content="Personal website where I show things but not only" />
        <meta property="og:title" content="Nacho Mazzara" />
        <meta property="og:description" content="Personal website where I show things but not only" />
        <meta property="og:url" content="https://imazzara.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://imazzara.com/favicon.ico" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nacho Mazzara" />
        <meta name="twitter:description" content="Personal website where I show things but not only" />
        <meta name="twitter:image" content="https://imazzara.com/favicon.ico" />
      </Helmet>
      <div className="container">
        <h1> Hi, I'm Nacho Mazzara</h1>
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

