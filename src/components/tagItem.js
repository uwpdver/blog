import { Link } from "gatsby"
import * as React from "react"

const TagItem = ({ link, children, itemkey }) => {
  return (
    <li className="tag-item inline-flex items-center justify-center rounded py-1 px-3 mb-2 bg-blue-50" key={itemkey}>
      <Link to={link} className="tag-item-link">
        {children}
      </Link>
    </li>
  )
}

export default TagItem
