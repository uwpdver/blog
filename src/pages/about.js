import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import PageHeading from "../components/pageHeading"
import Section from "../components/productPageSection"
import TechStackGroup from "../components/techStackGroup"
import { StaticImage } from "gatsby-plugin-image"


const AboutPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const introduction = data.site.siteMetadata.author.introduction
  const social = data.site.siteMetadata.social
  const skills = data.allYaml.nodes[0].skills

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="关于这个博客" />
      <PageHeading>关于</PageHeading>
      <div className="divide-y">
        <Section title="关于我">
          <p>{introduction}</p>
          <ul className="mt-2">
            <li>
              <Link to="/我的经历——从毕业到离开长沙/">我的经历——从毕业到离开长沙</Link>
            </li>
          </ul>
        </Section>
        <Section title="技术栈">
          <div className="tech-stack-content grid grid-cols-2 sm:grid-cols-4 gap-4">
            {skills.map((item, index) => (
              <TechStackGroup
                className=""
                key={index}
                title={item.title}
                list={item.list}
              />
            ))}
          </div>
        </Section>
        <Section title="GitHub">
          <img src="http://ghchart.rshah.org/uwpdver" alt="uwpdver's Github chart" />
        </Section>
        <Section title="联系">
          <ul className="space-y-2">
            <li className="flex items-center">
              <StaticImage
                className="flex-shrink-0 mr-2"
                width={24}
                height={23}
                src="../images/github-60.png"
                alt="github"
                quality={100}
              />
              <Link to={social.github}>github</Link>
            </li>
            <li className="flex items-center">
              <StaticImage
                className="flex-shrink-0 mr-2"
                width={24}
                height={24}
                src="../images/email-60.png" alt="email"
                quality={100}
              />
              <a href={social.email} target="_blank">{social.email}</a>
            </li>
          </ul>
        </Section>
      </div>
    </Layout>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author {
          introduction
        }
        social {
          github
          email
        }
      }
    }
    allYaml {
      nodes {
        skills {
          title
          list {
            name
            icon {
              childImageSharp {
                gatsbyImageData(
                  width: 20
                  layout: CONSTRAINED
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }          
        }
      }
    }
  }
`