import { BlogPost } from './types'

// Import HTML content using Vite's ?raw suffix
import thePrisionOfCareerMediocrityContent from './content/posts/the-prison-of-career-mediocrity.html?raw'

export const blogPosts: BlogPost[] = [
  {
    slug: 'the-prison-of-career-mediocrity',
    title: 'The Prison of Career Mediocrity',
    hero: '∞',
    published: new Date('2026-01-08'),
    content: thePrisionOfCareerMediocrityContent,
  },
]

