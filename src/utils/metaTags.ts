export function updateMetaTags({
  title,
  description,
  image,
  url,
  type = 'article',
}: {
  title: string
  description: string
  image?: string
  url: string
  type?: string
}) {
  const baseUrl = 'https://imazzara.com'
  const fullUrl = `${baseUrl}${url}`
  const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/favicon.ico`

  // Update or create meta tags
  const setMetaTag = (property: string, content: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
    let meta = document.querySelector(selector) as HTMLMetaElement

    if (!meta) {
      meta = document.createElement('meta')
      if (isProperty) {
        meta.setAttribute('property', property)
      } else {
        meta.setAttribute('name', property)
      }
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // Update title
  document.title = title

  // Basic meta tags
  setMetaTag('title', title)
  setMetaTag('description', description)

  // Open Graph tags
  setMetaTag('og:title', title, true)
  setMetaTag('og:description', description, true)
  setMetaTag('og:url', fullUrl, true)
  setMetaTag('og:type', type, true)
  setMetaTag('og:image', imageUrl, true)

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image')
  setMetaTag('twitter:title', title)
  setMetaTag('twitter:description', description)
  setMetaTag('twitter:image', imageUrl)
}

export function resetMetaTags() {
  const defaultTitle = 'Ignacio Mazzara'
  const defaultDescription = 'Personal website where I show things but not only'
  const defaultUrl = 'https://imazzara.com'

  updateMetaTags({
    title: defaultTitle,
    description: defaultDescription,
    url: '/',
  })
}

