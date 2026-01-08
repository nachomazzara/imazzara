import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blogPosts } from '../blogPosts'
import { trackScrollDepth, trackPageView } from '../analytics'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-solidity'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import './BlogPost.css'

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const trackedMilestones = useRef<Set<number>>(new Set())

  // Extract first paragraph as description if not provided
  const getDescription = () => {
    if (!post) return 'Personal website where I show things but not only'
    if (post.description) return post.description
    
    if (typeof document !== 'undefined') {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = post.content
      const firstParagraph = tempDiv.querySelector('p')?.textContent || ''
      return firstParagraph.substring(0, 160) || 'Personal website where I show things but not only'
    }
    return 'Personal website where I show things but not only'
  }

  const description = getDescription()

  useEffect(() => {
    if (post) {
      trackPageView(`/blog/${slug}`, post.title)
    }
  }, [post, slug])

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (post && contentRef.current) {
      // Set all code blocks to TypeScript (hardcoded as requested)
      const codeBlocks = contentRef.current.querySelectorAll('pre code')
      codeBlocks.forEach((code) => {
        const pre = code.parentElement
        if (pre) {
          // Always use TypeScript for code blocks
          pre.className = 'language-typescript'
          
          // Add copy button if it doesn't exist
          if (!pre.querySelector('.copy-button')) {
            const copyButton = document.createElement('button')
            copyButton.className = 'copy-button'
            copyButton.textContent = 'Copy'
            copyButton.setAttribute('aria-label', 'Copy code')
            
            copyButton.addEventListener('click', async () => {
              const codeText = code.textContent || ''
              try {
                await navigator.clipboard.writeText(codeText)
                copyButton.textContent = 'Copied!'
                setTimeout(() => {
                  copyButton.textContent = 'Copy'
                }, 2000)
              } catch (err) {
                console.error('Failed to copy:', err)
              }
            })
            
            pre.style.position = 'relative'
            pre.appendChild(copyButton)
          }
        }
      })
      
      // Apply syntax highlighting after content is rendered
      setTimeout(() => {
        Prism.highlightAllUnder(contentRef.current!)
      }, 100)
    }
  }, [post])

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

  const title = `${post.title} | Nacho Mazzara`
  const url = `https://imazzara.com/blog/${slug}`
  const imageUrl = post.ogImage 
    ? `https://imazzara.com${post.ogImage}`
    : 'https://imazzara.com/favicon.ico'

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      <div className="blog-container">
        {post.hero && (
          <div className="blog-hero">
            <div className="blog-hero-content">{post.hero}</div>
          </div>
        )}
        <div className="blog-content">
          <h1 className="blog-title">{post.title}</h1>
          <div
            ref={contentRef}
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="blog-footer">
            <Link to="/">← Back to home</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogPost

