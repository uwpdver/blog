import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { motion } from 'framer-motion';
import kebabCase from "lodash/kebabCase"
import TagItem from "./tagItem"

const TagList = () => {
  const data = useStaticQuery(graphql`
     query TagsGroupQuery {
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
     }
   `)

  const group = data.tagsGroup.group;

  return (
    <motion.ul className="flex flex-wrap">
      {group.map(tag => (
        <TagItem
          link={`/tags/${kebabCase(tag.fieldValue)}/`}
          key={tag.fieldValue}
        >
          {tag.fieldValue} ({tag.totalCount})
        </TagItem>
      ))}
    </motion.ul>
  )
}

export default TagList
