/**
 * Tag List component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import kebabCase from "lodash/kebabCase"

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
    <ul className="tag-list">
      {group.map(tag => (
        <li className="tag-item" key={tag.fieldValue}>
          <Link to={`/tags/${kebabCase(tag.fieldValue)}/`} className="tag-item-link">
            {tag.fieldValue} ({tag.totalCount})
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default TagList
