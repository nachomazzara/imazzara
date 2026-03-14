import { BlogPost } from './types'

// Import HTML content using Vite's ?raw suffix
import missingLayerContent from './content/posts/the-missing-layer-between-your-codebase-and-a-coding-agent.html?raw'
import thePrisionOfCareerMediocrityContent from './content/posts/the-prison-of-career-mediocrity.html?raw'
import leadersCanBreakTheCareerCasinoContent from './content/posts/how-leaders-can-break-the-career-casino.html?raw'
import engineeringIsntHereContent from './content/posts/engineering-isnt-here-to-build-features.html?raw'
import implementingEip7702Content from './content/posts/implementing-eip-7702.html?raw'

export const blogPosts: BlogPost[] = [
  {
    slug: 'the-missing-layer-between-your-codebase-and-a-coding-agent',
    title: 'The Missing Layer Between Your Codebase and a Coding Agent',
    hero: '<>',
    published: new Date('2026-03-11'),
    content: missingLayerContent,
    ogImage: '/og-images/the-missing-layer-between-your-codebase-and-a-coding-agent-60d6a4d3.png',
  },
  {
    slug: 'leaders-can-break-the-career-casino',
    title: 'How Leaders Can Break the Career Casino',
    hero: '⟐',
    published: new Date('2026-01-22'),
    content: leadersCanBreakTheCareerCasinoContent,
    ogImage: '/og-images/leaders-can-break-the-career-casino-57f2eade.png',
  },
  {
    slug: 'the-prison-of-career-mediocrity',
    title: 'The Prison of Career Mediocrity',
    hero: '⛓',
    published: new Date('2026-01-08'),
    content: thePrisionOfCareerMediocrityContent,
    ogImage: '/og-images/the-prison-of-career-mediocrity-5214a35d.png',
  },
  {
    slug: 'engineering-isnt-here-to-build-features',
    title: 'Engineering Isn\'t Here to Build Features — It\'s Here to Enable the Business',
    hero: '→',
    published: new Date('2025-10-14'),
    content: engineeringIsntHereContent,
    ogImage: '/og-images/engineering-isnt-here-to-build-features-c7f52089.png',
  },
  {
    slug: 'implementing-eip-7702',
    title: 'Implementing EIP-7702: A (almost) Low-Level Guide',
    hero: '◉',
    published: new Date('2025-07-01'),
    content: implementingEip7702Content,
    ogImage: '/og-images/implementing-eip-7702-de5d72ea.png',
  },
]

