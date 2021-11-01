import React, { useRef } from "react"
import PropTypes from "prop-types"

import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/productPageSection"

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductTemplate = ({ pageContext, location }) => {
  const { name, snapshots, description, siteUrl } = pageContext;
  const snapshotListRef = useRef(null);

  const handleNavBtnClick = (isPrev) => {
    if (snapshotListRef.current) {
      const children = snapshotListRef.current.children;
      const childWidth = children[0].getBoundingClientRect().width;
      const scrollWidth = snapshotListRef.current.scrollWidth;
      const scrollLeft = snapshotListRef.current.scrollLeft;
      const currentIndex = parseInt(((childWidth + scrollLeft) / scrollWidth) * children.length)
      const navIndex = isPrev ? Math.max(0, currentIndex - 1) : Math.min(currentIndex + 1, children.length - 1);
      snapshotListRef.current.children[navIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' })
    }
  }

  return (
    <Layout location={location} title="所有作品" to="/products">
      <Seo title={name} />
      <Helmet title={name} />
      <div className="product-page divide-y">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" >{name}</h1>
          <a className="bg-blue-50 p-2 px-3 rounded-lg" href={siteUrl} target="_blank" rel="noreferrer">访问网站</a>
        </header>
        <Section title="屏幕截图">
          <div className="relative">
            <button className="hidden sm:block absolute z-20 top-1/2 bg-gray-100 hover:bg-gray-300 hover:shadow-xl rounded-lg py-4 px-2 transform -translate-y-1/2 left-2" onClick={handleNavBtnClick.bind(null, true)}>{'<'}</button>
            <button className="hidden sm:block absolute z-20 top-1/2 bg-gray-100 hover:bg-gray-300 hover:shadow-xl rounded-lg py-4 px-2 transform -translate-y-1/2 right-2" onClick={handleNavBtnClick.bind(null, false)}>{'>'}</button>
            <ul className="product-snapshots-wrapper space-x-4" ref={snapshotListRef}>
              {snapshots.map((snapshot, index) => (
                <li className="product-snapshot-item rounded-lg" key={index}>
                  <Zoom>
                    <img
                      className="product-snapshot-img"
                      src={snapshot.src}
                      alt={`snapshot ${index + 1}`}
                    />
                  </Zoom>
                </li>
              ))}
            </ul>
          </div>
        </Section>
        <Section title="描述">
          <p className="text-sm leading-6">{description}</p>
        </Section>
      </div>
    </Layout>
  )
}

ProductTemplate.propTypes = {
  pageContext: PropTypes.shape({
    name: PropTypes.string.isRequired,
    snapshots: PropTypes.arrayOf(PropTypes.shape({
      src: PropTypes.string.isRequired
    })).isRequired,
    description: PropTypes.string.isRequired,
    siteUrl: PropTypes.string.isRequired
  }),
}

export default ProductTemplate;
