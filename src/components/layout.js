import React, { Component } from "react"
import { Link } from "gatsby"
import { ThemeToggler } from "gatsby-plugin-dark-mode"

class Layout extends Component {
  render() {
    const { title, children } = this.props
    const toggler = (
      <div className="toggler">
        <ThemeToggler>
          {({ theme, toggleTheme }) => {
            const isDark = theme === "dark"
            return (
              <label className="tog">
                <input
                  type="checkbox"
                  onChange={e =>
                    toggleTheme(e.target.checked ? "dark" : "light")
                  }
                  checked={isDark}
                  className="tog-checkbox"
                />
                <div className="tog-wrapper">
                  <div className={`tog-text ${isDark ? "hidden" : ""}`}>
                    <span role="img">✨</span>
                  </div>
                  <div className={`tog-text ${!isDark ? "hidden" : ""}`}>
                    <span role="img">🌚</span>
                  </div>
                </div>
              </label>
            )
          }}
        </ThemeToggler>
      </div>
    )

    return (
      <div className="site-container">
        <div className="header-container">
          <Link className="header-title" to={`/`}>
            {title}
          </Link>
          <div className="nav-container">
            <ul className="header-nav">
              <li id="header-nav-first">
                <Link to={`/tags`}>Tags</Link>
              </li>
              <li>
                <Link to={`/search`}>Search</Link>
              </li>
              <li>{toggler}</li>
            </ul>
            <ul className="header-link">
              <li>
                <a
                  href="https://github.com/dowookims"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <main>{children}</main>
        <footer className="footer-copyright">
          © {new Date().getFullYear()} {title}, Built with Vapor blog Theme
          {` `}
          <a className="footer-gatsby" href="https://www.gatsbyjs.org">
            Gatsby
          </a>
        </footer>
      </div>
    )
  }
}

export default Layout
