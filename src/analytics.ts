// Google Analytics utility functions

const GA_TRACKING_ID = 'G-E5M8LRSL9P'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    })
  }
}

export function trackLinkClick(url: string, linkText: string, linkType?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'link',
      event_label: linkText,
      link_url: url,
      link_type: linkType || 'external',
    })
  }
}

export function trackScrollDepth(percentage: number, postSlug: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    if (!postSlug) {
      console.warn('trackScrollDepth called without postSlug')
      return
    }
    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      scroll_depth: percentage,
      post_slug: postSlug,
    })
  }
}

