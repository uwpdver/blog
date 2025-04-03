import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "刘志豪的QQ空间",
  EMAIL: "bnwporcelain@outlook.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
  LOGO: "/blog/logo.png",
};

export enum PAGE_KEY {
  HOME = "HOME",
  BLOG = "BLOG",
  WORK = "WORK",
  PROJECT = "PROJECT"
}

export const PAGE_METADATA: Record<PAGE_KEY, Metadata> = {
  [PAGE_KEY.HOME]: {
    TITLE: "主页",
    DESCRIPTION: "Astro Nano is a minimal and lightweight blog and portfolio.",
    PATHNAME: "/",
  },
  [PAGE_KEY.BLOG]: {
    TITLE: "文章",
    DESCRIPTION: "A collection of articles on topics I am passionate about.",
    PATHNAME: "/blog",
  },
  [PAGE_KEY.WORK]: {
    TITLE: "工作",
    DESCRIPTION: "Where I have worked and what I have done.",
    PATHNAME: "/work",
  },
  [PAGE_KEY.PROJECT]: {
    TITLE: "项目",
    DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
    PATHNAME: "/project",
  }
};

export const ROUTERS: Metadata[] = [
  PAGE_KEY.HOME,
  PAGE_KEY.BLOG,
  PAGE_KEY.WORK,
  PAGE_KEY.PROJECT
].map((key) => PAGE_METADATA[key]);

export const WEBSITE_PATHNAME: Record<PAGE_KEY, string> = Object.entries(PAGE_METADATA).reduce((acc, [key, { PATHNAME }]) => {
  acc[key as PAGE_KEY] = PATHNAME;
  return acc;
}, {} as Record<PAGE_KEY, string>);

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/ymsjl",
  },
];
