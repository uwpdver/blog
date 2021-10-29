import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import classnames from 'classnames'

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
      <div className="global-header-mask hidden fixed inset-0 w-screen h-screen" onClick={() => setIsMenuExtended(false)} />
      <div className="heading-container relative flex items-center justify-between flex-wrap p-5">
        <h1 className={classnames('flex-1 h-10 flex items-center', {
          'font-bold text-3xl': isRootPath,
          'text-lg align-middle': !isRootPath,
        })}
        >
          <Link to={to}>{title}</Link>
        </h1>
        <button className="global-menu-btn" onClick={handleMenuBtnClick} title="open the nav menu">
          <div className="hamburger-btn">
            <div className="hamburger-btn-line text-primary" />
          </div>
        </button>
        <nav className="global-nav flex justify-between">
          <ul className="global-nav-list flex sm:space-x-4 divide-y  sm:divide-y-0 sm:space-y-0">
            {
              menus.map((item, idx) => <li key={idx} className=" text-lg py-3 sm:py-0"><Link className="block w-full" to={item.slug}>{item.name}</Link></li>)
            }
          </ul>
        </nav>
      </div>
    </>
  )

  return (
    <div className="global-wrapper my-0 mx-auto max-w-2xl" data-is-root-path={isRootPath}>
      <header className="global-header" aria-expanded={isMenuExtended}>{header}</header>
      <main className="py-0 px-5">{children}</main>
      <footer className="p-5 text-sm">
        © {new Date().getFullYear()}, {description}
      </footer>
    </div>
  )
}

export default Layout
