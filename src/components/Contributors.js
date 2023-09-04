import React from 'react'
import { Flex, useSpacing } from '@kyleshevlin/layout'
import { graphql, useStaticQuery } from 'gatsby'

export default function Contributors() {
  const bs = useSpacing()

  const data = useStaticQuery(graphql`
    query ContributorsInTheLast100PullRequests {
      github {
        repository(name: "blog", owner: "kyleshevlin") {
          pullRequests(states: MERGED, last: 100) {
            nodes {
              author {
                avatarUrl(size: 35)
                login
                ... on GitHub_User {
                  url
                }
              }
            }
          }
        }
      }
    }
  `)

  const contributorsHash = data.github.repository.pullRequests.nodes.reduce(
    (acc, cur) => {
      const {
        author: { avatarUrl, login, url },
      } = cur

      if (login === 'kyleshevlin') return acc
      if (acc[login]) return acc

      acc[login] = {
        avatarUrl,
        login,
        url,
      }

      return acc
    },
    {}
  )
  const contributors = Object.values(contributorsHash)

  return (
    <div
      css={{
        fontFamily: 'var(--fonts-secondary)',
        textAlign: 'center',
      }}
    >
      <div css={{ marginBottom: bs(0.5) }}>
        I would like give thanks to those who have contributed fixes and updates
        to this blog. If you see something that needs some love, you can join
        them. This blog is open sourced at{' '}
        <a href="https://github.com/kyleshevlin/blog">
          https://github.com/kyleshevlin/blog
        </a>
      </div>

      {contributors.length ? (
        <div
          css={{
            fontSize: '.75rem',
            fontStyle: 'normal',
          }}
        >
          <Flex justify="center" wrap="wrap">
            {contributors.map(contributor => {
              const { avatarUrl, login, url } = contributor

              return (
                <a
                  css={{
                    display: 'inline-block',
                    padding: bs(0.25),
                    width: 50,
                    opacity: 0.75,
                    transition: 'opacity .3s ease',

                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                  key={login}
                  href={url}
                  title={`@${login}`}
                >
                  <img
                    css={{ display: 'block', width: '100%' }}
                    alt={login}
                    src={avatarUrl}
                  />
                </a>
              )
            })}
          </Flex>
        </div>
      ) : null}
    </div>
  )
}
