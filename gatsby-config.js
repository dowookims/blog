const remark = require("remark");

module.exports = {
  siteMetadata: {
    title: `DouglasK`,
    author: `dowookims`,
    description: `주니어 프론트엔드 개발자 DouglasK의 개발 블로그 입니다. 자바스크립트와 Vue, React와 CSS 그리고 개발 일지에 대해 기록합니다.`,
    siteUrl: `https://dowoo.kim/`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: process.env.GA_KEY,
        head: true,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        fields: [`title`, `description`, `body`],
        resolvers: {
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            tags: node => node.frontmatter.tags,
            description: node => node.frontmatter.description,
            slug: node => node.fields.slug,
            body: node => String(remark().processSync(node.rawMarkdownBody)),
            excerpt: node => {
              const text = remark().processSync(node.rawMarkdownBody);
              const excerptLength = 139; // Hard coded excerpt length
              return node.rawMarkdownBody && String(text).substring(0, excerptLength) + "...";
            },
            date: node => {
              const months= [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
              ];
              const date = new Date(node.frontmatter.date);
              return months[date.getUTCMonth(0)] + " " + date.getUTCDate(0) + ", " + date.getUTCFullYear(0);
            },
          },
        },
      },
    },
    'gatsby-plugin-dark-mode',
  ],
}
