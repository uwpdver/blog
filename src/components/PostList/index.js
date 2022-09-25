import React from 'react';
import { motion } from 'framer-motion';
import PostItem from '../postItem';
import { listItem, listContainer } from '../../common';

const PostList = ({ posts = [] }) => {
  return (
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
  )
}

export default PostList;