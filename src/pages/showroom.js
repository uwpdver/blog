import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import PageHeading from "../components/pageHeading"
import Section from "../components/Section"
import { Helmet } from "react-helmet"
import { motion } from 'framer-motion';
import { listContainer, listItem } from "../common";

const ShowroomPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const albums = data.allDoubanFavoriteMusic.edges.map(({ node }) => node);
  const films = data.allDoubanFavoriteFilm.edges.map(({ node }) => node);

  const pageTitle = '陈列室';
  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={pageTitle} />
      <Helmet title={pageTitle} />
      <PageHeading>{pageTitle}</PageHeading>
      <motion.div className="divide-y" variants={listContainer} initial="hidden" animate="show">
        <Section title="">
          这里是我的陈列室，展示我的喜好和收藏。仅仅是展示，请勿触碰哦。
        </Section>
        <Section title="💿 最喜欢的专辑" contentClassName="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {albums.map(({ id, title, cover }) => (
            <motion.div variants={listItem} key={id}>
              <div className="relative shadow-lg flash">
                <img className="w-full album-cover rounded-lg" src={`/images/${cover}`} loading="lazy" alt="" />
              </div>
              <div className="mt-3 line-clamp-1 text-sm font-semibold text-center" title={title}>{title}</div>
            </motion.div>
          ))}
        </Section>
        <Section title="📽️ 最喜欢的影视" contentClassName="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {films.map(({ id, title, cover }) => (
            <motion.div variants={listItem} key={id}>
              <div className="relative shadow-lg flash">
                <img className="w-full movie-poster rounded-lg " src={`/images/${cover}`} loading="lazy" alt="" />
              </div>
              <div className="mt-3 line-clamp-1 text-sm font-semibold text-center" title={title}>{title}</div>
            </motion.div>
          ))}
        </Section>
      </motion.div>
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
    allDoubanFavoriteMusic {
      edges {
        node {
          cover
          title
        }
      }
    }
    allDoubanFavoriteFilm {
      edges {
        node {
          cover
          title
        }
      }
    }
  }
`