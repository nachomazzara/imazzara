// Script to generate and link OG images for blog posts
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Read blog posts from TypeScript file
function parseBlogPosts() {
  const blogPostsPath = join(rootDir, 'src', 'blogPosts.ts')
  const content = readFileSync(blogPostsPath, 'utf-8')
  
  const posts = []
  
  // Parse each blog post object
  const postRegex = /\{\s*slug:\s*(['"])((?:(?:\\.|(?!\1).)+)*)\1/g
  let match
  let postIndex = 0
  
  while ((match = postRegex.exec(content)) !== null) {
    const postStart = match.index
    const slug = match[2].replace(/\\(.)/g, '$1') // Unescape
    
    // Find the matching closing brace for this post
    let braceCount = 0
    let inString = false
    let stringChar = null
    let i = postStart
    let postEnd = postStart
    
    while (i < content.length) {
      const char = content[i]
      const prevChar = i > 0 ? content[i - 1] : ''
      
      if (!inString && (char === '{' || char === '}')) {
        if (char === '{') braceCount++
        if (char === '}') braceCount--
        if (braceCount === 0 && char === '}') {
          postEnd = i + 1
          break
        }
      } else if (!inString && (char === '"' || char === "'")) {
        inString = true
        stringChar = char
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false
        stringChar = null
      }
      
      i++
    }
    
    const postContent = content.substring(postStart, postEnd)
    
    // Extract title (handling escaped quotes)
    const titleMatch = postContent.match(/title:\s*(['"])((?:(?:\\.|(?!\1).)+)*)\1/)
    const title = titleMatch ? titleMatch[2].replace(/\\(.)/g, '$1') : ''
    
    // Extract hero
    const heroMatch = postContent.match(/hero:\s*(['"])((?:(?:\\.|(?!\1).)+)*)\1/)
    const hero = heroMatch ? heroMatch[2].replace(/\\(.)/g, '$1') : ''
    
    // Extract published date
    const publishedMatch = postContent.match(/published:\s*new\s+Date\((['"])([^'"]+)\1\)/)
    const published = publishedMatch ? publishedMatch[2] : new Date().toISOString().split('T')[0]
    
    posts.push({
      slug,
      title,
      hero,
      published,
    })
    
    postIndex++
  }
  
  return posts
}

// Get existing OG images
function getExistingOGImages() {
  const ogImagesDir = join(rootDir, 'public', 'og-images')
  if (!existsSync(ogImagesDir)) {
    mkdirSync(ogImagesDir, { recursive: true })
    return []
  }
  
  const files = readdirSync(ogImagesDir)
  return files
    .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.webp'))
    .map(file => ({
      filename: file,
      slug: file.replace(/\.(png|jpg|webp)$/, '').replace(/-[a-f0-9]{8}$/, ''),
    }))
}

// Calculate hash for cache busting
function getPostHash(post) {
  const content = `${post.hero || ''}-${post.title}-${post.published}`
  return createHash('md5').update(content).digest('hex').substring(0, 8)
}

async function generateOGImage(post) {
  const hash = getPostHash(post)
  const imagePath = join(rootDir, 'public', 'og-images', `${post.slug}-${hash}.png`)
  const imageUrl = `/og-images/${post.slug}-${hash}.png`

  // Check if image already exists
  if (existsSync(imagePath)) {
    console.log(`✓ OG image exists: ${post.slug} (${hash})`)
    return imageUrl
  }

  console.log(`📸 Generating OG image for: ${post.slug}...`)

  // Ensure directory exists
  mkdirSync(join(rootDir, 'public', 'og-images'), { recursive: true })

  // Read HTML template
  const htmlTemplate = readFileSync(
    join(__dirname, 'generate-og-image.html'),
    'utf-8'
  )

  // Escape HTML special characters
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }

  // Replace hero and title in template
  const hero = post.hero || ''
  const escapedTitle = escapeHtml(post.title)
  const html = htmlTemplate
    .replace(
      /<div class="hero" id="hero">.*?<\/div>/,
      hero ? `<div class="hero" id="hero">${escapeHtml(hero)}</div>` : '<div class="hero" id="hero" style="display: none;"></div>'
    )
    .replace(
      /<span class="separator" id="separator">.*?<\/span>/,
      hero ? `<span class="separator" id="separator">-</span>` : '<span class="separator" id="separator" style="display: none;">-</span>'
    )
    .replace(
      /<div class="title" id="title">.*?<\/div>/,
      `<div class="title" id="title">${escapedTitle}</div>`
    )
    .replace(
      /document\.getElementById\('hero'\)\.textContent = .*?;/,
      `document.getElementById('hero').textContent = ${JSON.stringify(hero)};`
    )
    .replace(
      /document\.getElementById\('separator'\)\.textContent = .*?;/,
      hero ? `document.getElementById('separator').textContent = '-';` : `document.getElementById('separator').style.display = 'none';`
    )
    .replace(
      /document\.getElementById\('title'\)\.textContent = .*?;/,
      `document.getElementById('title').textContent = ${JSON.stringify(post.title)};`
    )

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 630 })
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // Wait for fonts to load
    await page.evaluateHandle(() => document.fonts.ready)
    await new Promise(resolve => setTimeout(resolve, 500)) // Extra wait for rendering

    // Take screenshot
    await page.screenshot({
      path: imagePath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    })

    console.log(`✓ Generated: ${post.slug}-${hash}.png`)
  } finally {
    await browser.close()
  }

  return imageUrl
}

async function main() {
  console.log('🚀 Generating OG images for blog posts...\n')

  const blogPosts = parseBlogPosts()
  const existingImages = getExistingOGImages()
  const results = {}

  // Generate missing images
  for (const post of blogPosts) {
    try {
      // Check if image already exists (with or without hash)
      const existingImage = existingImages.find(img => 
        img.slug === post.slug || img.filename.startsWith(post.slug)
      )

      if (existingImage) {
        // Use existing image
        const imagePath = `/og-images/${existingImage.filename}`
        results[post.slug] = imagePath
        console.log(`✓ Using existing image: ${post.slug} -> ${existingImage.filename}`)
      } else {
        // Generate new image
        const imageUrl = await generateOGImage(post)
        results[post.slug] = imageUrl
      }
    } catch (error) {
      console.error(`❌ Error processing ${post.slug}:`, error.message)
    }
  }

  // Update blogPosts.ts with ogImage paths
  const blogPostsPath = join(rootDir, 'src', 'blogPosts.ts')
  let blogPostsContent = readFileSync(blogPostsPath, 'utf-8')

  let updated = false

  for (const post of blogPosts) {
    const imageUrl = results[post.slug]
    if (imageUrl) {
      // Check if ogImage already exists for this post
      const postRegex = new RegExp(
        `(slug:\\s*['"]${post.slug}['"][^}]*?)(\\n\\s*\\})`,
        's'
      )
      const match = blogPostsContent.match(postRegex)

      if (match) {
        const postContent = match[1]
        
        // Update or add ogImage
        if (postContent.includes('ogImage:')) {
          // Update existing ogImage
          const updatedContent = blogPostsContent.replace(
            new RegExp(
              `(slug:\\s*['"]${post.slug}['"][^}]*?ogImage:\\s*['"])[^'"]*(['"])`,
              's'
            ),
            `$1${imageUrl}$2`
          )
          if (updatedContent !== blogPostsContent) {
            blogPostsContent = updatedContent
            updated = true
            console.log(`✓ Updated ogImage for: ${post.slug}`)
          }
        } else {
          // Add ogImage
          blogPostsContent = blogPostsContent.replace(
            postRegex,
            `$1,\n    ogImage: '${imageUrl}',\n  $2`
          )
          updated = true
          console.log(`✓ Added ogImage for: ${post.slug}`)
        }
      }
    }
  }

  if (updated) {
    writeFileSync(blogPostsPath, blogPostsContent)
    console.log('\n✅ blogPosts.ts updated!')
  } else {
    console.log('\n✅ All OG images linked.')
  }
}

try {
  await main()
} catch (error) {
  console.error('Error:', error)
  process.exit(1)
}

