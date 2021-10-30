import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const TechStackGroup = ({ className, title, list }) => {
  return (
    <div className={`${className} tech-group`}>
      <h4 className="font-bold mb-2 pt-1 pb-2">{title}</h4>
      <ul className="space-y-2">
        {list.map((item, index) =>
          <li
            key={index}
            className="text-sm"
          >
            <GatsbyImage
              className="mr-2 align-middle"
              image={getImage(item.icon)}
              alt={item.name}
            />
            {item.name}
          </li>
        )}
      </ul>
    </div>
  )
}

export default TechStackGroup
