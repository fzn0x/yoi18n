import { readFileSync } from 'node:fs'

// Helper function to read files
function readFile(filePath: string): string {
  return readFileSync(filePath, 'utf-8')
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!cookieHeader) {
    return cookies
  }

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=')
    if (name) {
      cookies[name.trim()] = decodeURIComponent(rest.join('='))
    }
  })

  return cookies
}

function parseQueryString(queryString: string): Record<string, string> {
  const query: Record<string, string> = {}
  if (!queryString) {
    return query
  }

  queryString
    .replace(/^\?/, '')
    .split('&')
    .forEach((param) => {
      const [key, value] = param.split('=')
      if (key && value) {
        query[key] = decodeURIComponent(value)
      }
    })

  return query
}

function loadJSON(filePath: string): Promise<Record<string, unknown>> {
  return JSON.parse(readFile(filePath))
}

interface I18nConfig {
  namespace: Record<
    string,
    {
      load: string
      type?: string
      storage?: string
      defaultLang?: string
    }
  >
  detection: {
    order: string[]
    defaultLang: string
  }
}

function fromCookie(cookies: string | undefined): string | null {
  const parsedCookies = parseCookies(cookies)
  return parsedCookies['lang'] || null
}

function fromPath(reqPath: string): string | null {
  const pathParts = reqPath.split('/')
  const lang = pathParts.find((part) => /^[a-z]{2}$/.test(part))
  return lang || null
}

function fromQuery(queryString: string): string | null {
  const parsedQuery = parseQueryString(queryString)
  return parsedQuery['lang'] || null
}

function detectLanguage(detectionConfig: I18nConfig['detection']) {
  const { order, defaultLang } = detectionConfig

  return (req: { headers: { cookie?: string }; url: string }) => {
    for (const method of order) {
      let lang: string | null = null
      if (method === 'cookie') {
        lang = fromCookie(req.headers.cookie)
      } else if (method === 'path') {
        lang = fromPath(req.url)
      } else if (method === 'query') {
        lang = fromQuery(req.url)
      }
      if (lang) {
        return lang
      }
    }
    return defaultLang
  }
}

interface TranslateFunction {
  (key: string, req?: { headers: { cookie?: string }; url: string }): string
  switch: (newLang: string, ns: string) => void
}

function i18nInit(config: I18nConfig): TranslateFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const languages: Record<string, any> = {}
  for (const ns in config.namespace) {
    const namespaceConfig = config.namespace[ns]

    if (namespaceConfig) {
      languages[ns] = loadJSON(namespaceConfig.load)
    } else {
      throw new Error('Invalid namespace configuration')
    }
  }

  const detectLang = detectLanguage(config.detection)

  function t(key: string, req?: { headers: { cookie?: string }; url: string }): string {
    const [ns, langKey] = key.split('.')
    const lang =
      req && Object.keys(req).length
        ? detectLang(req)
        : ns
          ? config?.namespace?.[ns]?.defaultLang || config.detection.defaultLang
          : config.detection.defaultLang

    if (ns && langKey && ns in languages && lang in languages[ns]) {
      return languages[ns][lang][langKey] || key
    }

    return languages['default'][lang][key] || key
  }

  t.switch = (newLang: string, ns: string) => {
    config.detection.defaultLang = newLang

    if (ns) {
      if (config.namespace[ns]) {
        config.namespace[ns].defaultLang = newLang
      } else {
        throw new Error(`Namespace ${ns} not found`)
      }
    }
  }

  return t
}

export default {
  init: i18nInit,
}
