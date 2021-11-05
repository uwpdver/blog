import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import PageHeading from "../components/pageHeading"
import Section from "../components/productPageSection"
import { StaticImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet"


const ShowroomPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const albums = data.allYaml.nodes[0].showroom.albums
  const movies = data.allYaml.nodes[0].showroom.movies

  const pageTitle = '陈列室';
  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={pageTitle} />
      <Helmet title={pageTitle} />
      <PageHeading>{pageTitle}</PageHeading>
      <div className="divide-y">
      <Section title="" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
        这里是我的陈列室，展示我的喜好和收藏。仅仅是展示，请勿触碰哦。
      </Section>
        <Section title="💿 音乐" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {albums.map(({ name, image }) => (
              <li className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
                <div>
                  <div className="relative rounded-lg shadow-lg overflow-hidden">
                    <img className="w-full album-cover" src={image} loading="lazy" />
                  </div>
                  <div className="mt-3 line-clamp-1 text-sm font-semibold" title={name}>{name}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="📽️ 电影" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {movies.map(({ name, image }) => (
              <li className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
                <div>
                  <div className="relative">
                    <img className="w-full rounded-lg shadow-lg movie-poster" src={image} loading="lazy"/>
                  </div>
                  <div className="mt-3 line-clamp-1 text-sm font-semibold" title={name}>{name}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </Layout>
  )
}

export default ShowroomPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allYaml {
      nodes {
        showroom {
          movies {
            name
            category
            description
            image
          }
          albums {
            name
            category
            description
            image
          }
        }
      }
    }
  }
`