import React from 'react'
import { Link } from 'gatsby'
import { EGGHEAD_AFFILIATE_QUERY_PARAM } from '../constants'
import shevy, { bs } from '../shevy'
import { mq } from '../utils'
import { useCoursesContext } from './CoursesProvider'
import { shadowSize } from './Button'
import LinkButton from './LinkButton'

const randomIndex = length => Math.floor(Math.random() * length)

const chooseCourse = (courses, nickname) => {
  if (!courses.length) return null

  const randomCourse = courses[randomIndex(courses.length)]

  if (!nickname) return randomCourse

  const course = courses.find(course => course.nickname === nickname)

  if (!course) return randomCourse

  return course
}

const BUTTON_TEXT_BY_URL_TYPE = {
  default: 'View the course',
  egghead: 'View on egghead.io',
}

function getUrlType(url) {
  switch (true) {
    case /egghead/g.test(url):
      return 'egghead'

    default:
      return 'default'
  }
}

function formatUrl(url, urlType) {
  if (urlType === 'egghead') {
    return url + EGGHEAD_AFFILIATE_QUERY_PARAM
  }

  return url
}

export default function ValueSell({ courseNickname }) {
  const courses = useCoursesContext()
  const course = React.useMemo(
    () => chooseCourse(courses, courseNickname),
    [courses, courseNickname]
  )

  if (!course) return null

  const { logo, title, url } = course

  const publicURL = logo?.publicURL
  const urlType = getUrlType(url)
  const formattedUrl = formatUrl(url, urlType)

  return (
    <div
      css={{
        backgroundColor: 'var(--colors-offset)',
        padding: bs(2),
      }}
    >
      <div
        css={{
          [mq.alpha]: {
            display: 'grid',
            gridGap: bs(2),
            gridTemplateColumns: '1fr 2fr',
            alignItems: 'center',
          },
        }}
      >
        <div
          css={{
            marginBottom: bs(),
            [mq.alpha]: {
              marginBottom: 0,
            },
          }}
        >
          <div css={{ textAlign: 'center' }}>
            {publicURL && (
              <img
                css={{
                  display: 'block',
                  width: '100%',
                  marginBottom: bs(0.5),
                }}
                src={publicURL}
                alt={`${title} Logo`}
              />
            )}
            <div
              css={{
                fontSize: publicURL ? 'inherit' : shevy.h2.fontSize,
                fontFamily: 'var(--fonts-catamaran)',
              }}
            >
              {title}
            </div>
          </div>
        </div>
        <div
          css={{
            textAlign: 'center',
            [mq.alpha]: {
              textAlign: 'left',
            },
          }}
        >
          <h2>Check out my courses!</h2>
          <div
            css={{
              fontFamily: 'var(--fonts-catamaran)',
              marginBottom: bs(1),
            }}
          >
            Liked the post? You might like my courses, too. Click the button to
            view this course or go to <Link to="/courses">Courses</Link> for
            more information.
          </div>
          <div css={{ a: { marginTop: bs(0.5), marginRight: bs(0.5) } }}>
            <LinkButton
              href={formattedUrl}
              overrideStyles={{
                boxShadow: `
                ${shadowSize()} ${shadowSize()} var(--colors-offset),
                ${shadowSize(2)} ${shadowSize(2)} var(--colors-offsetMore)
              `,
              }}
            >
              {BUTTON_TEXT_BY_URL_TYPE[urlType]}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  )
}
