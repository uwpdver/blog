import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import PageHeading from "../components/pageHeading"
import Section from "../components/productPageSection"
import TechStackGroup from "../components/techStackGroup"
import { StaticImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet"


const AboutPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const social = data.site.siteMetadata.social
  const skills = data.allYaml.nodes[0].skills
  const pageTitle = '关于';
  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={pageTitle} />
      <Helmet title={pageTitle} />
      <PageHeading>{pageTitle}</PageHeading>
      <div className="divide-y">
        <Section title="关于这个博客" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up" contentClassName="space-y-2">
          <p>这个博客创建于 2021 年 8 月，起初只是用于学习 Gatsby 的一个例子，后来变成了我的个人博客。这个博客是我个人用作学习的一个地方，我会用我自己的方式记录和总结一些自己看到的和学到的知识，以便加深自己对知识的理解。当然也起到了分享和展示的作用，但这是次要的。</p>
          <p>我认为自建的博客比其他写作平台更自由，无论是内容或者形式上，我可以把它建设成我想要的样子。这是一块属于我自己的地盘。</p>
          <p>限于个人能力问题，文章的部分内容可能只是一些东拼西凑的东西，或者只是对英语原文的翻译，偶尔穿插一些个人的理解。虽然我自己在写作的过程会有所收获，但这毕竟不是教程，如果能对来访的读者提供一点点小小的帮助那是再好不过，但是教会他人并不是这个博客本身的意义。</p>
        </Section>
        <Section title="关于我" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
          <p>职业是前端开发，早餐喜欢吃 711 的芝士猪排饭团。喜欢写代码，爱折腾，喜欢实用有趣的工具，喜欢捣鼓自己的东西。喜欢好看的东西，喜欢的颜色是蓝色，白色，绿色。热爱篮球，喜欢听说唱音乐。</p>
          <p className="mt-2"><Link to="/我的经历——从毕业到离开长沙/">我的经历——从毕业到离开长沙</Link></p>
        </Section>
        <Section title="技术栈" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
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
        <Section title="GitHub" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
          <img src="http://ghchart.rshah.org/uwpdver" alt="uwpdver's Github chart" />
        </Section>
        <Section title="关注我" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
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
              <span>Github：</span>
              <Link to={social.github}>uwpdver</Link>
            </li>
            <li className="flex items-center">
              <StaticImage
                className="flex-shrink-0 mr-2"
                width={24}
                height={24}
                src="../images/rss-32.png" alt="rss"
                quality={100}
              />
              <span>RSS：</span><Link to="/rss.xml">{siteTitle}</Link>
            </li>
          </ul>
        </Section>
        <Section title="联系我" className="delay-animate-list-item delay-animate-fade-in fade-in-slide-up">
          <div className="flex items-center">
            <StaticImage
              className="flex-shrink-0 mr-2"
              width={24}
              height={24}
              src="../images/email-60.png" alt="email"
              quality={100}
            />
            <span>邮箱：</span><span >{social.email}</span>
          </div>
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