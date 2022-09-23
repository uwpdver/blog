// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
// normalize CSS across browsers
// custom CSS styles
import "./src/styles/index.css"

// Highlighting for code blocks
import "prismjs/themes/prism.css"
import React from 'react';
import { AnimatePresence } from "framer-motion"

export const wrapPageElement = ({ element }) => (
  <AnimatePresence mode='wait'>{element}</AnimatePresence>
)