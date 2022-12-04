import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { motion } from 'framer-motion';
import kebabCase from "lodash/kebabCase"
import TagItem from "../components/tagItem"
import PostItem from '../components/postItem';
import { listItem, listContainer } from '../common';

const PostsPage = ({ pageContext, data, location }) => {
  const { tags } = pageContext
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const { tagsGroup: { group } } = data;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="全部文章" />
      <div className="flex justify-between flex-wrap">
        <div className="w-full md:w-7/12 xl:w-3/4">
          <h2 className="mb-6 text-2xl font-bold">
            <Link to="/posts">全部文章</Link>
            <span>{tags?.length === 1 ? ` / ${tags[0]}` : ''}（{posts?.length}篇）</span>
          </h2>
          <motion.ul
            className="border-t pt-4 list-style-none space-y-8"
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
        </div>
        <div className="w-full mt-10 md:mt-0  md:w-4/12 xl:w-1/5">
          <h2 className="mb-6 text-2xl font-bold">按标签筛选</h2>
          <motion.ul className="border-t pt-4 flex flex-wrap">
            {group.map(tag => (
              <TagItem
                link={`/posts/tags/${kebabCase(tag.fieldValue)}`}
                key={tag.fieldValue}
              >
                {tag.fieldValue} ({tag.totalCount})
              </TagItem>
            ))}
          </motion.ul>
        </div>
      </div>
    </Layout>
  )
}

export default PostsPage

export const pageQuery = graphql`
  query PostsQuery($tags: [String]) {
    site {
      siteMetadata {
        title
      }
    }

    allMarkdownRemark(
      sort: { 
        fields: [frontmatter___date], 
        order: DESC
      }
      filter: { 
        frontmatter: {
           tags: { in: $tags }
        }
      }
    ) {
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

    tagsGroup: allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
