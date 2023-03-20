/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // cssModules: true,
  images: {
    unoptimized: true
  },
  env: {
    login: "aleeva",
    password: "aleeva"
  },
  // i18n: {
  //   i18n: ['en', 'ru'],
  //   defaultLocale: 'en',
  // }
}

module.exports = nextConfig

//
// module.exports = withCSS({
//   cssModules: true,
//
// })
// // module.exports = {
// //   reactStrictMode: true,
// //   trailingSlash: true,
// //   require('@zeit/next-css')
// // }
