import * as React from "react"
import { motion } from 'framer-motion';
import { listItem } from "../common";

const Section = ({ className = '', contentClassName = '', title, children }) => {
  return (
    <motion.section className={`${className} pt-2 pb-4 sm:pt-4 sm:pb-8`} variants={listItem}>
      <h4 className="mb-4 font-bold">{title}</h4>
      <div className={contentClassName}>{children}</div>
    </motion.section>
  )
}

export default Section