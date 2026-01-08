import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../blogPosts'
import { trackScrollDepth, trackPageView } from '../analytics'
import { updateMetaTags, resetMetaTags } from '../utils/metaTags'
import './BlogPost.css'

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const trackedMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (post) {
      // Extract first paragraph as description if not provided
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = post.content
      const firstParagraph = tempDiv.querySelector('p')?.textContent || ''
      const description = post.description || firstParagraph.substring(0, 160)

      updateMetaTags({
        title: `${post.title} | Ignacio Mazzara`,
        description: description,
        url: `/blog/${slug}`,
        type: 'article',
      })

      trackPageView(`/blog/${slug}`, post.title)
    }

    return () => {
      resetMetaTags()
    }
  }, [post, slug])

  useEffect(() => {
    if (!post) return

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      )

      // Track 50% (middle) and 100% (bottom) milestones
      const milestones = [50, 100]
      
      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !trackedMilestones.current.has(milestone)
        ) {
          trackedMilestones.current.add(milestone)
          trackScrollDepth(milestone, slug)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Check initial scroll position in case user loads page mid-scroll
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [post, slug])

  if (!post) {
    return (
      <div className="blog-container">
        <div className="blog-content">
          <h1>Post not found</h1>
          <Link to="/">← Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-container">
      {post.hero && (
        <div className="blog-hero">
          <div className="blog-hero-content">{post.hero}</div>
        </div>
      )}
      <div className="blog-content">
        <h1 className="blog-title">{post.title}</h1>
        <div
          className="blog-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="blog-footer">
          <Link to="/">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPost

