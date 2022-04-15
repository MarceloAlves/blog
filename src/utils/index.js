import { BREAKPOINTS } from '../constants'

const createMediaQuery = breakpoint => `@media (min-width: ${breakpoint})`

export const mq = Object.entries(BREAKPOINTS).reduce((acc, [key, value]) => {
  acc[key] = createMediaQuery(value)
  return acc
}, {})

export const formatStrForPath = str => str.toLowerCase().split(' ').join('-')

export const inflect =
  (singular, plural = `${singular}s`) =>
  quantity =>
    Math.abs(quantity) === 1 ? singular : plural

// Copied from https://github.com/vigour-io/nice-is-email/blob/master/lib/index.js
const EMAIL_PATTERN =
  /^([^.](?![a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+\.\.)([a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+[^.])|([a-zA-Z0-9]{1,2}))@([A-Za-z0-9-]{1,64}\.){1,10}[a-zA-Z]{2,64}$/

export const isEmail = value => {
  return (
    typeof value === 'string' &&
    EMAIL_PATTERN.test(value) &&
    value.indexOf('@') < 65 &&
    value.length < 255
  )
}

export const getNodes = obj => obj.edges.map(edge => edge.node)

export const makeHeadingId = heading => {
  // TODO: handle situation where `children` is an array of elements and
  // not just a string.
  if (typeof heading !== 'string') {
    return null
  }

  return heading
    .trim()
    .split(' ')
    .map(x => x.toLowerCase())
    .join('-')
}

export const random255 = () => Math.floor(Math.random() * 255)

export const randomRGB = () => {
  const r = random255()
  const g = random255()
  const b = random255()

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * This regex checks for an opening `<`
 * Then an optional `/` for the closing tags
 * Then any number of lowercase alphabetic characters
 * Followed by a closing `>`
 */
const ELEMENT_TAGS_PATTERN = /<\/?[a-z]+>/g

export function stripElementTags(str) {
  return str.replace(ELEMENT_TAGS_PATTERN, '')
}
