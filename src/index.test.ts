import yoi18n from '../dist'

describe('init', () => {
  const t = yoi18n.init({
    namespace: {
      default: {
        load: './lang.json',
        type: 'json',
        storage: 'cookie',
        defaultLang: 'en',
      },
      admin: {
        load: './lang-admin.json',
        type: 'json',
        storage: 'cookie',
        defaultLang: 'en',
      },
    },
    detection: {
      order: ['cookie', 'path'],
      defaultLang: 'en',
    },
  })

  it('switch language correctly', async () => {
    t.switch('de', 'default') // Switched to de in default namespace
    t.switch('de', 'admin') // Switched to de in admin namespace

    expect(t('hello')).toBe('Guten morgen')
    expect(t('admin.hello')).toBe('Guten morgen from admin')

    t.switch('en', 'default') // Switched to en in default namespace
    t.switch('en', 'admin') // Switched to en in admin namespace

    expect(t('hello')).toBe('hello world')
    expect(t('admin.hello')).toBe('hello world from admin')
  })
})
