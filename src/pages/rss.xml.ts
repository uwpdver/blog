import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { PAGE_METADATA } from "@consts";

type Context = {
  site: string
}

export async function GET(context: Context) {
  const blogs = (await getCollection("blog"))
  .filter(post => !post.data.draft);

  const projects = (await getCollection("project"))
    .filter(project => !project.data.draft);

  const items = [...blogs, ...projects]
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  return rss({
    title: PAGE_METADATA.HOME.TITLE,
    description: PAGE_METADATA.HOME.DESCRIPTION,
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${item.collection}/${item.slug}/`,
    })),
  });
}
