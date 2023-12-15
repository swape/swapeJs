import type { CachedTemplates } from './types'

const cachedTemplates: CachedTemplates = {}
export async function getTemplate(templateUrl: string) {
  if (cachedTemplates[templateUrl]) {
    return new Promise((resolve) => resolve(cachedTemplates[templateUrl]))
  }

  const res = await fetch(templateUrl)
  const template = await res.text()
  cachedTemplates[templateUrl] = template
  return template
}
