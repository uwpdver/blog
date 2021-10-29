import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const PostItem = ({ link, title, date, description, excerpt }) => {
  return (
    <article
      className="post-list-item my-8"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header className="mb-2">
        <h2 className="mb-2 text-2xl font-bold">
          <Link to={link} itemProp="url">
            <span itemProp="headline">{title}</span>
          </Link>
        </h2>
        <small>{date}</small>
      </header>
      <section>
        <p
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