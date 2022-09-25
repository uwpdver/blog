import React from 'react';
import { Link } from "gatsby"
import classnames from 'classnames'
import { motion } from 'framer-motion';
import { listContainer, listItem } from '../../common'
import { useIsSmall } from '../../utils/useMediaQuery'

const GlobalHeader = ({ title = '', to = '', menus = [], tags = [] }) => {
  const [isMenuExtended, setIsMenuExtended] = React.useState(false);
  const isSmall = useIsSmall();

  const handleMenuBtnClick = () => setIsMenuExtended(isMenuExtended => !isMenuExtended)

  const handleKeyDownOnMask = (e) => { }

  return (
    <header className="global-header" aria-expanded={isMenuExtended}>
      <div className="global-header-mask hidden fixed inset-0 w-screen h-screen" onClick={() => setIsMenuExtended(false)} onKeyDown={handleKeyDownOnMask} role="button" aria-label="mask" tabIndex={0} />
      <div className="heading-container relative flex items-center justify-between flex-wrap p-5">
        <h1 className={classnames('flex-1 h-10 flex items-center text-lg align-middle')}>
          <Link to={to}>{title}</Link>
        </h1>
        <button className="global-menu-btn" onClick={handleMenuBtnClick} title="open the nav menu">
          <div className="hamburger-btn">
            <div className="hamburger-btn-line text-primary" />
          </div>
        </button>
        <nav className="global-nav absolute top-full left-0 w-full sm:relative sm:top-auto sm:left-auto sm:w-auto">
          <motion.ul className='flex flex-col sm:flex-row justify-between list-none divide-y sm:divide-y-0 sm:space-x-4 sm:space-y-0' variants={!isSmall && listContainer} animate={isMenuExtended ? "show" : "hidden"}>
            {
              menus.map((item, idx) =>
                <motion.li key={idx} className="text-lg py-3 sm:py-0" variants={!isSmall && listItem}>
                  <Link className="block w-full" to={item.slug}>{item.name}</Link>
                </motion.li>
              )
            }
          </motion.ul>
        </nav>
      </div>
    </header>
  )
}

export default GlobalHeader;