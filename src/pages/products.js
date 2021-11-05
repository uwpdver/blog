import React from "react"
import PropTypes from "prop-types"
import kebabCase from "lodash/kebabCase"
// Components
import { Helmet } from "react-helmet"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PageHeading from "../components/pageHeading"

const ProductsPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
    products,
  },
  location
}) => {
  const pageTitle = '全部作品';
  return (
    <Layout location={location} title={title}>
      <Seo title={pageTitle} />
      <Helmet title={pageTitle} />
      <div className="tags-page">
        <PageHeading>{pageTitle}</PageHeading>
        <ul className="space-y-8">
          {products.nodes[0].products.map(
            product => (
              <li key={product.name} className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
                <Link to={`/product/${kebabCase(product.name)}`}>
                  <article className="relative grid sm:grid-cols-2 sm:grid-rows-1">
                    <img className="rounded-lg sm:rounded-none sm:col-start-2" src={product.snapshots[0]?.src} alt="snapshots" />
                    <header className=" text-secondary mt-2 sm:pr-6 sm:col-start-1 sm:row-start-1">
                      <h4 className="text-xl line-clamp-1 sm:line-clamp-none sm:text-2xl font-bold">{product.longName}</h4>
                      <p className="text-sm line-clamp-2 sm:line-clamp-4 text-gray-600 mt-2">{product.description}</p>
                    </header>
                  </article>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </Layout>
  )
}

ProductsPage.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default ProductsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    products: allYaml {
      nodes {
        products {
          name
          longName
          siteUrl
          description
          snapshots {
            src
          }          
        }
      }
    }
  }
`