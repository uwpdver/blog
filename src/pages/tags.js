import React from "react"
import PropTypes from "prop-types"

// Components
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import TagList from "../components/tagList"

const TagsPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
  },
  location
}) => (
  <Layout location={location} title={title}>
    <Seo title="所有标签" />
    <Helmet title={title} />
    <div className="tags-page">
      <header>
        <h1>文章标签</h1>
      </header>
      <TagList />
    </div>
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`