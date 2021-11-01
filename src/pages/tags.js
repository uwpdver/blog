import React from "react"
import PropTypes from "prop-types"

// Components
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import TagList from "../components/tagList"
import PageHeading from "../components/pageHeading"

const TagsPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
  },
  location
}) => {
  const pageTitle = '全部标签';
  return (
    <Layout location={location} title={title}>
      <Seo title={pageTitle} />
      <Helmet title={pageTitle} />
      <div className="tags-page">
        <PageHeading>{pageTitle}</PageHeading>
        <TagList />
      </div>
    </Layout>
  )
}

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