import * as React from "react"
import PropTypes from "prop-types"

const productPageSection = ({ title, children }) => {
  return (
    <section className="product-page-section pt-2 pb-4 sm:pt-4 sm:pb-8">
      <h4 className="product-page-section-header mb-4 font-bold">{title}</h4>
      <div>{children}</div>
    </section>
  )
}

export default productPageSection

productPageSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
}