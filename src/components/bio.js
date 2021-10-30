/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author

  return (
    <Link className="flex mb-12 p-6 rounded-3xl bg-blue-50 text-secondary" to="/about">
      <StaticImage
        className="mr-4 rounded-full flex-shrink-0"
        layout="fixed"
        formats={["AUTO", "WEBP", "AVIF"]}
        src="../images/profile-pic.jpg"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      />
      <div>
        <p>
          这里是<strong>{author?.name}</strong>
        </p>
        <p className="line-clamp-2">
          {author?.summary || null}
        </p>
      </div>
    </Link>
  )
}

export default Bio
