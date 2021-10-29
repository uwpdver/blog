import React from "react"
import PropTypes from "prop-types"

// Components
import { graphql } from "gatsby"
import TagList from "../components/tagList"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PostItem from "../components/postItem"
import PageHeading from "../components/pageHeading"

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${tag}：${totalCount} 篇文章`

  return (
    <Layout location={location} title="全部标签" to="/tags">
      <Seo title={tagHeader} />
      <Helmet title={tagHeader} />
      <div className="tags-page">
        <PageHeading >{tagHeader}</PageHeading>
        <TagList />
        <ul style={{ listStyle: 'none' }}>
          {edges.map(({ node }) => {
            const { fields: { slug }, excerpt } = node
            const { title, date, description } = node.frontmatter
            return (
              <li key={slug}>
                <PostItem
                  link={slug}
                  title={title}
                  date={date}
                  description={description}
                  excerpt={excerpt}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            excerpt: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              date: PropTypes.string,
              description: PropTypes.string,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
          }
        }
      }
    }
  }
`