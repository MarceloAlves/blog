import React from 'react'
import { useTheme } from 'emotion-theming'
import { graphql, Link, StaticQuery } from 'gatsby'
import { bs } from '../shevy'
import Container from './Container'
import Nav from './Nav'
import { BREAKPOINTS } from '../constants'
import { createMediaQuery } from '../utils'

export default function Header() {
  const theme = useTheme()

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
              subTitle
            }
          }
        }
      `}
      render={data => {
        const { subTitle, title } = data.site.siteMetadata

        return (
          <header
            css={{
              paddingTop: bs(),
              paddingBottom: bs(),
              marginBottom: bs(),
            }}
          >
            <Container>
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'column',

                  [createMediaQuery(BREAKPOINTS.alpha)]: {
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                }}
              >
                <Link
                  css={{
                    color: theme.colors.text,
                    display: 'block',
                  }}
                  to="/"
                >
                  <h1
                    css={{
                      lineHeight: 1,
                      marginBottom: 0,
                    }}
                  >
                    {title}
                  </h1>
                  <div
                    css={{
                      fontFamily: theme.fonts.catamaran,
                      fontSize: '1rem',
                      marginBottom: 0,
                    }}
                  >
                    {subTitle}
                  </div>
                </Link>
              </div>
              <Nav />
            </Container>
          </header>
        )
      }}
    />
  )
}
