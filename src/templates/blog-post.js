import * as React from "react"
import { Link, graphql } from "gatsby"

import kebabCase from "lodash/kebabCase"

import Layout from "../components/layout"
import Seo from "../components/seo"
import PageHeading from "../components/pageHeading"
import TagItem from "../components/tagItem"
import { motion } from 'framer-motion';

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <div className="grid grid-cols-content-toc gap-12">
        <main>
          <article
            className="blog-post mb-10"
            itemScope
            itemType="http://schema.org/Article"
          >
            <motion.header className="mb-4">
              <PageHeading >{post.frontmatter.title}</PageHeading>
              <p className="text-sm mb-2 text-gray-400">
                <span>{post.frontmatter.date}</span>
              </p>
              <ul className="text-sm">
                {post.frontmatter.tags?.map(tag => (
                  <TagItem
                    link={`/posts/tags/${kebabCase(tag)}/`}
                    key={tag}
                  >
                    {tag}
                  </TagItem>
                ))}
              </ul>
            </motion.header>
            <section
              className="prose max-w-full pt-4 pb-8"
              dangerouslySetInnerHTML={{ __html: post.html }}
              itemProp="articleBody"
            />
            <hr />
          </article>
          <nav className="blog-post-nav">
            <ul
              style={{
                display: `flex`,
                flexWrap: `wrap`,
                justifyContent: `space-between`,
                listStyle: `none`,
                padding: 0,
              }}
            >
              <li>
                {previous && (
                  <Link to={previous.fields.slug} rel="prev">
                    ← {previous.frontmatter.title}
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={next.fields.slug} rel="next">
                    {next.frontmatter.title} →
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </main>
        <div className="hidden lg:block">
          <nav className="sticky top-8 right-0" >
            <h2 className="text-xl leading-10 mb-5">
              文章内容
            </h2>
            <div className="toc" dangerouslySetInnerHTML={{ __html: post.tableOfContents }} />
          </nav>
        </div>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents(
          absolute: false
          maxDepth: 2
      )
      frontmatter {
        title
        date(formatString: "YYYY年MM月DD日")
        description
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
