export const COMMON_CONSTANTS = () => {
  return {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
  };
};
