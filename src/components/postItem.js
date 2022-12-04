import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const PostItem = ({ link, title, date, description, excerpt, category }) => {
  return (
    <article
      className="post-item"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header className="mb-1">
        <h2 className="mb-2 text-xl font-bold">
          <Link to={link} itemProp="url">
            <span itemProp="headline">{title}</span>
          </Link>
        </h2>
        <small className="text-xs text-gray-400">{`${date} | ${category}`}</small>
      </header>
      <section className="text-base">
        <p
          className="line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: description || excerpt,
          }}
          itemProp="description"
        />
      </section>
    </article>

  )
}

export default PostItem

PostItem.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
  excerpt: PropTypes.string
}