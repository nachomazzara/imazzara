export type Gist = {
  title: string
  published: Date
  url: string
}

export type Project = {
  role: string
  title: string
  url: string
}

export type BlogPost = {
  slug: string
  title: string
  description?: string
  hero?: string
  ogImage?: string
  content: string
  published: Date
}
