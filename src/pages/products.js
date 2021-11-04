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
                  <article className="relative rounded-lg overflow-hidden group">
                    <div className="absolute inset-0 bg-white bg-opacity-50 z-10 opacity-0 group-hover:opacity-100" />
                    <img className="" src={product.snapshots[0]?.src} alt="snapshots" />
                    <header className="absolute bottom-0 left-0 w-full h-32 z-20 text-secondary p-4 bg-blue-50 bg-opacity-70 backdrop-blur">
                      <h4 className="text-xl font-bold mb-4">{product.name}</h4>
                      <p className="text-sm line-clamp-2 text-gray-600">{product.description}</p>
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