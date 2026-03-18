declare module "*.webp" {
  const content: string;
  export default content;
}

// Optionally add other formats if you run into this again
declare module "*.png";
declare module "*.jpg";
declare module "*.svg";