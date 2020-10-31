import { useState, useEffect } from 'react'

import { Gist, Project } from './types'

export function useGists(): Gist[] {
  const [gists, setGists] = useState<Gist[]>([])

  useEffect(() => {
    fetch('https://api.github.com/users/nachomazzara/gists').then((res) =>
      res.json().then((gists) =>
        // Normalize gists
        setGists(
          gists.map((gist: any) => ({
            title: gist.description,
            published: new Date(gist.created_at),
            url: gist.html_url,
          }))
        )
      )
    )
  }, [])

  return gists
}

export function useProjects(): Project[] {
  return [
    {
      role: 'Co-founder',
      title: 'pine.finance 🌲',
      url: 'https://pine.finance',
    },
    {
      role: 'Creator',
      title: 'abitopic ⛓',
      url: 'https://abitopic.io',
    },
    {
      role: 'Creator',
      title: 'web3playground 🎪',
      url: 'https://web3playground.io',
    },
    {
      role: 'Creator',
      title: 'blockbytime 🕰',
      url: 'https://blockbytime.com/',
    },
  ]
}
