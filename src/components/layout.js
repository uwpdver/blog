import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Layout = ({ location, title, children, to = '/' }) => {
  const [isMenuExtended, setIsMenuExtended] = React.useState(false);
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

  const handleMenuBtnClick = () => setIsMenuExtended(isMenuExtended => !isMenuExtended)

  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  const menus = data.site.siteMetadata?.menus
  const description = data.site.siteMetadata?.description

  header = (
    <>
      <div className="global-header-mask" onClick={()=>setIsMenuExtended(false)}/>
      <div className="heading-container">
        <h1 className={`main-heading ${isRootPath ? '' : 'main-heading-other-path'}`}>
          <Link to={to}>{title}</Link>
        </h1>
        <button className="global-menu-btn" onClick={handleMenuBtnClick} title="open the nav menu">
          <div className="hamburger-btn">
            <div className="hamburger-btn-line" />
          </div>
        </button>
        <nav className="global-nav flex justify-between">
          <ul className="global-nav-list">
            {
              menus.map((item, idx) => <li key={idx} className="nav-item"><Link className="nav-item-link" to={item.slug}>{item.name}</Link></li>)
            }
          </ul>
        </nav>
      </div>
    </>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header" aria-expanded={isMenuExtended}>{header}</header>
      <main className="main-wrapper">{children}</main>
      <footer>
        © {new Date().getFullYear()}, {description}
      </footer>
    </div>
  )
}

export default Layout
