require("dotenv").config();
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    CURRENT_URL: process.env.CURRENT_URL,
    DB_URL: process.env.DB_URL,
    COOKIE_NAME: process.env.COOKIE_NAME,

    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,

    IMOVIE_BASE_URL: "https://api.imovies.cc/api/v1",
    EPISODE_URL: "ajax/v2/episode/servers",

    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    PUBLIC_EMAIL: process.env.PUBLIC_EMAIL,
  },
  images: {
    unoptimized: true,
    domains: [
      "cdn.cdnlogo.com",
      "res.cloudinary.com",
      "cdn.pixabay.com",
      "www.biography.com",
      "react.semantic-ui.com",
      "static.imovies.cc",
      "dezpolycarpe.files.wordpress.com",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
};
