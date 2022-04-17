import React from 'react'
import Layout from './components/Layout'
import CoursesProvider from './components/CoursesProvider'
import Flex from './components/Flex'
import Gif from './components/Gif'
import OffsetWrap from './components/OffsetWrap'
import { FootnotesProvider, FootnoteMarker } from './components/Footnotes'
import Margin from './components/Margin'
import YoutubeEmbed from './components/YoutubeEmbed'
import { ThemeProvider } from './components/ThemeProvider'
import { MDXProvider } from '@mdx-js/react'
import { makeHeadingId } from './utils'

const makeHeading =
  element =>
  // eslint-disable-next-line react/display-name
  ({ children, ...props }) =>
    React.createElement(
      element,
      { id: makeHeadingId(children), ...props },
      children
    )

const H2 = makeHeading('h2')
const H3 = makeHeading('h3')
const H4 = makeHeading('h4')
const H5 = makeHeading('h5')
const H6 = makeHeading('h6')

const wrapPageElement = ({ element, props }) => {
  return (
    <ThemeProvider>
      <CoursesProvider>
        <FootnotesProvider>
          <MDXProvider
            components={{
              Flex,
              Gif,
              h2: H2,
              h3: H3,
              h4: H4,
              h5: H5,
              h6: H6,
              Marker: FootnoteMarker,
              OffsetWrap,
              Margin,
              YoutubeEmbed,
            }}
          >
            <Layout {...props}>{element}</Layout>
          </MDXProvider>
        </FootnotesProvider>
      </CoursesProvider>
    </ThemeProvider>
  )
}

export default wrapPageElement
