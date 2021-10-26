import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Layout = ({ location, title, children, to='/' }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          menus {
            name
            slug
          }
          description
        }
      }
    }
  `)

  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  const menus = data.site.siteMetadata?.menus
  const description = data.site.siteMetadata?.description

  if (isRootPath) {
    header = (
      <>
        <div className="heading-container">
          <h1 className="main-heading">
            <Link to={to}>{title}</Link>
          </h1>
          <nav className="nav flex justify-between">
            {
              menus.map((item, idx) => <li key={idx} className="nav-item"><Link className="nav-item-link" to={item.slug}>{item.name}</Link></li>)
            }
          </nav>
        </div>
      </>
    )
  } else {
    header = (
      <Link className="header-link-home" to={to}>
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, {description}
      </footer>
    </div>
  )
}

export default Layout
