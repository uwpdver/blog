import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import classnames from 'classnames'
import { motion } from 'framer-motion';
import { listContainer, listItem } from '../common'
import { useIsSmall } from '../utils/useMediaQuery'

const Layout = ({ location, title, children, to = '/' }) => {
  const [isMenuExtended, setIsMenuExtended] = React.useState(false);
  const isSmall = useIsSmall();
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

  const menus = data.site.siteMetadata?.menus
  const description = data.site.siteMetadata?.description

  const handleKeyDownOnMask = (e) => { }

  return (
    <div className="root-container">
      <div className="global-wrapper my-0 mx-auto max-w-2xl" data-is-root-path={isRootPath}>
        <header className="global-header" aria-expanded={isMenuExtended}>
          <div className="global-header-mask hidden fixed inset-0 w-screen h-screen" onClick={() => setIsMenuExtended(false)} onKeyDown={handleKeyDownOnMask} role="button" aria-label="mask" tabIndex={0} />
          <div className="heading-container relative flex items-center justify-between flex-wrap p-5">
            <h1 className={classnames('flex-1 h-10 flex items-center text-lg align-middle')}>
              <Link to={to}>{title}</Link>
            </h1>
            <button className="global-menu-btn" onClick={handleMenuBtnClick} title="open the nav menu">
              <div className="hamburger-btn">
                <div className="hamburger-btn-line text-primary" />
              </div>
            </button>
            <nav className="global-nav flex justify-between">
              <motion.ul className="global-nav-list flex sm:space-x-4 divide-y sm:divide-y-0 sm:space-y-0" variants={!isSmall && listContainer} animate={isMenuExtended ? "show" : "hidden"}>
                {
                  menus.map((item, idx) =>
                    <motion.li key={idx} className="text-lg py-3 sm:py-0" variants={!isSmall && listItem}>
                      <Link className="block w-full" to={item.slug}>{item.name}</Link>
                    </motion.li>
                  )
                }
              </motion.ul>
            </nav>
          </div>
        </header>
        <main className="py-0 px-5">{children}</main>
        <footer className="p-5 text-sm text-gray-400">
          © {new Date().getFullYear()}, {description}
        </footer>
      </div>
    </div>
  )
}

export default Layout
