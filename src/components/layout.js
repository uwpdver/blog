import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import GlobalHeader from "./GlobalHeader"


const Layout = ({ location, title, children, to = '/', }) => {
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
  const menus = data.site.siteMetadata?.menus
  const description = data.site.siteMetadata?.description

  return (
    <div className="root-container">
      <div className="global-wrapper my-0 mx-auto max-w-2xl" data-is-root-path={isRootPath}>
        <GlobalHeader title={title} to={to} menus={menus} />
        <main className="py-0 px-5">{children}</main>
        <footer className="p-5 text-sm text-gray-400">
          © {new Date().getFullYear()}, {description}
        </footer>
      </div>
    </div>
  )
}

export default Layout
