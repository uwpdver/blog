import * as React from "react"
import { graphql } from "gatsby"

import { motion } from 'framer-motion';
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PostItem from "../components/postItem"
import { listContainer, listItem } from '../common'

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="全部文章" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="全部文章" />
      <Bio />
      <motion.ul
        className="list-style-none"
        variants={listContainer}
        initial="hidden"
        animate="show"
      >
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          return (
            <motion.li
              key={post.fields.slug}
              variants={listItem}
            >
              <PostItem
                className=""
                link={post.fields.slug}
                title={title}
                date={post.frontmatter.date}
                description={post.frontmatter.description}
                excerpt={post.excerpt}
                category={post.frontmatter.category}
              />
            </motion.li>
          )
        })}
      </motion.ul>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
        }
      }
    }
  }
`
