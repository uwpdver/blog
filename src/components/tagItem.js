import { Link } from "gatsby"
import * as React from "react"

const TagItem = ({ className='', link, children }) => {
  return (
    <li className={`${className} tag-item inline-flex items-center justify-center rounded mb-2 bg-blue-50`}>
      <Link to={link} className="tag-item-link">
        {children}
      </Link>
    </li>
  )
}

export default TagItem
