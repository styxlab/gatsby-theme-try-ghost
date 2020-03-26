import React from 'react'

import { SiteNav } from '.'

const HeaderPage = () => (
    <header className="site-header">
        <div className="outer site-nav-main">
            <div className="inner">
                <SiteNav className="site-nav" />
            </div>
        </div>
    </header>
)

export default HeaderPage
