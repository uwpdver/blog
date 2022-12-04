import * as React from "react"
import { graphql, Link } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import IconChevronRight from '../assets/ic_fluent_chevron_right_24_regular.svg'

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="要没时间了" />
        <Bio />
        <p>还没有发布文章。</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="全部文章" />
      <Bio />
      <section>
        <header className="flex items-center justify-between">
          <h2 className="text-2xl mb-4">最近文章</h2>
          <Link className="flex items-center space-x-1" to="/posts">
            <span>查看全部文章</span>
            <IconChevronRight className="text-xl" />
          </Link>
        </header>
        <ol
          className="list-style-none grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6"
        >
          {posts.map((post, index) => {
            const title = post.frontmatter.title || post.fields.slug
            return (
              <li key={post.fields.slug}>
                <Link to={post.fields.slug} className="text-secondary">
                  <article className="space-y-3">
                    <div className="space-x-1">
                      <span>{post.frontmatter.date}</span>
                      <span>{post.frontmatter.category}</span>
                    </div>
                    <h3 className="text-xl text-primary hover:underline font-bold">{title}</h3>
                    <p className="text-secondary">{post.frontmatter.description}</p>
                  </article>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
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
    allMarkdownRemark(limit: 4, sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY年MM月DD日")
          title
          description
          category
        }
      }
    }
  }
`
