import puppeteer from 'puppeteer'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const buildDir = join(root, 'build')
const baseUrl = 'http://localhost:4173'

// Routes to prerender
const routes = [
  '/',
  '/blog/the-prison-of-career-mediocrity',
  '/blog/engineering-isnt-here-to-build-features',
  '/blog/implementing-eip-7702',
]

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        console.log('✓ Server is ready')
        return true
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error('Server did not start in time')
}

async function prerender() {
  console.log('🚀 Starting prerender process...')

  // Start vite preview server
  console.log('📦 Starting preview server...')
  const previewProcess = exec('npm run preview -- --port 4173 --host', {
    cwd: root,
    env: { ...process.env, NODE_ENV: 'production' },
  })

  // Capture stderr to avoid noise in logs
  previewProcess.stderr?.on('data', (data) => {
    // Only log errors, not warnings
    if (data.toString().includes('Error') || data.toString().includes('error')) {
      console.error('Preview server error:', data.toString())
    }
  })

  // Wait for server to be ready
  await waitForServer(baseUrl)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    for (const route of routes) {
      console.log(`\n📄 Prerendering: ${route}`)

      const page = await browser.newPage()

      // Navigate to the route
      await page.goto(`${baseUrl}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })

      // Wait for React to hydrate and render
      await page.waitForSelector('#root', { timeout: 10000 })
      
      // Wait for react-helmet to update meta tags in the head
      // Check if meta tags are present (react-helmet updates them)
      try {
        await page.waitForFunction(
          () => {
            const metaTags = document.querySelectorAll('meta[property], meta[name]')
            return metaTags.length > 5 // At least some meta tags should be present
          },
          { timeout: 5000 }
        )
      } catch (error) {
        // If it times out, continue anyway
        console.log('  ⚠️  Meta tags check timed out, continuing...')
      }
      
      // Extra wait to ensure all async content is loaded
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get the fully rendered HTML with meta tags
      const html = await page.content()

      // Determine output path
      let outputPath
      if (route === '/') {
        outputPath = join(buildDir, 'index.html')
      } else {
        // For routes like /blog/slug, create blog/slug/index.html
        const pathParts = route.split('/').filter(Boolean)
        outputPath = join(buildDir, ...pathParts, 'index.html')
      }

      // Create directory if needed
      mkdirSync(dirname(outputPath), { recursive: true })

      // Write the HTML file
      writeFileSync(outputPath, html, 'utf-8')
      console.log(`✓ Generated: ${outputPath}`)

      await page.close()
    }

    console.log('\n✅ Prerender complete!')
  } catch (error) {
    console.error('❌ Prerender failed:', error)
    throw error
  } finally {
    await browser.close()
    // Kill the preview server
    previewProcess.kill()
    console.log('🛑 Preview server stopped')
  }
}

prerender().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
