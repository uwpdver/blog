import * as React from "react"
import { Link } from "gatsby"
import { motion } from 'framer-motion';

const TagItem = ({ className='', link, children }) => {
  return (
    <motion.li className={`mr-2 py-1 px-2 inline-flex items-center text-sm justify-center rounded mb-2 bg-blue-50 ${className}`}>
      <Link to={link} >
        {children}
      </Link>
    </motion.li>
  )
}

export default TagItem
