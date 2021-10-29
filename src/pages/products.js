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
}) => (
  <Layout location={location} title={title}>
    <Seo title="所有作品" />
    <Helmet title={title} />
    <div className="tags-page">
      <PageHeading>所有作品</PageHeading>
      <ul className="space-y-8">
        {products.nodes.map(
          product => (
            <li key={product.name}>
              <Link to={`/product/${kebabCase(product.name)}`}>
                <article className="relative rounded-lg overflow-hidden group">
                  <div className="absolute inset-0 bg-white bg-opacity-50 z-10 opacity-0 group-hover:opacity-100" />
                  <img className="" src={product.snapshots[0]?.src} alt="snapshots"/>
                  <header className="absolute bottom-0 left-0 w-full h-32 z-20 text-secondary p-4 bg-blue-50 bg-opacity-70 backdrop-blur">
                    <h4 className="text-2xl font-bold mb-4">{product.name}</h4>
                    <p className="text-sm line-clamp-2">{product.description}</p>
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
        name
        siteUrl
        description
        snapshots {
          src
        }
      }
    }
  }
`