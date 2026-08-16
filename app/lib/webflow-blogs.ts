const BLOGS_COLLECTION_ID = '6a7260ea77f40c20eaaa7ed5';
const BLOG_CATEGORIES_COLLECTION_ID = '6a7260ea77f40c20eaaa7ebf';
const API_TOKEN = process.env.EXPO_PUBLIC_WEBFLOW_API_TOKEN;

type WebflowImage = { url: string; alt?: string | null };

type WebflowBlogCategoryItem = {
  id: string;
  fieldData: {
    name: string;
    slug: string;
  };
};

type WebflowBlogItem = {
  id: string;
  createdOn?: string;
  lastPublished?: string;
  fieldData: {
    name: string;
    slug: string;
    'main-image-2'?: WebflowImage;
    'thumbnail-image'?: WebflowImage;
    'rich-text'?: string;
    'post-summary'?: string;
    featured?: boolean;
    category?: string;
    'next-post'?: string;
    'previous-post'?: string;
    'alt-text'?: string;
    'author-image'?: WebflowImage;
    'author-name'?: string;
    'publish-date'?: string;
  };
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogCardData = {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  imageUrl?: string;
  altText?: string;
  authorName?: string;
  authorImageUrl?: string;
  categoryId?: string;
  categoryName?: string;
  date?: string;
  featured?: boolean;
};

export type BlogDetails = BlogCardData & {
  bodyHtml?: string;
};

async function webflowGet(path: string) {
  const res = await fetch(`https://api.webflow.com/v2${path}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Webflow API fout (${res.status})`);
  }
  return res.json();
}

function mapBlogItem(item: WebflowBlogItem, categoryMap: Map<string, string>): BlogDetails {
  const fd = item.fieldData;
  const image = fd['main-image-2'] || fd['thumbnail-image'];

  return {
    id: item.id,
    slug: fd.slug,
    name: fd.name,
    summary: fd['post-summary'],
    imageUrl: image?.url,
    altText: fd['alt-text'] || image?.alt || undefined,
    authorName: fd['author-name'],
    authorImageUrl: fd['author-image']?.url,
    categoryId: fd.category,
    categoryName: fd.category ? categoryMap.get(fd.category) : undefined,
    date: fd['publish-date'] || item.lastPublished || item.createdOn,
    featured: fd.featured,
    bodyHtml: fd['rich-text'],
  };
}

/** Haalt alle blog-categorieën op (Aankondigingen, Reisverslagen, Evenementen). */
export async function fetchWebflowBlogCategories(): Promise<BlogCategory[]> {
  const data = await webflowGet(`/collections/${BLOG_CATEGORIES_COLLECTION_ID}/items`);
  const items: WebflowBlogCategoryItem[] = data.items || [];
  return items.map((item) => ({
    id: item.id,
    name: item.fieldData.name,
    slug: item.fieldData.slug,
  }));
}

/** Haalt alle blogs op uit de Webflow Blogs-collectie en zet ze om naar BlogCardData. */
export async function fetchWebflowBlogs(): Promise<BlogDetails[]> {
  const [blogData, categories] = await Promise.all([
    webflowGet(`/collections/${BLOGS_COLLECTION_ID}/items`),
    fetchWebflowBlogCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const items: WebflowBlogItem[] = blogData.items || [];

  return items.map((item) => mapBlogItem(item, categoryMap));
}

/**
 * Haalt één blog op via zijn ID — het "endpoint per blog (via ID)" uit de
 * opdracht. Wordt gebruikt door het BlogDetailsScreen: de kaart stuurt alleen
 * de ID mee via de route, dit is de aparte API-call voor dat ene item.
 */
export async function fetchWebflowBlog(blogId: string): Promise<BlogDetails> {
  const [item, categories] = await Promise.all([
    webflowGet(`/collections/${BLOGS_COLLECTION_ID}/items/${blogId}`) as Promise<WebflowBlogItem>,
    fetchWebflowBlogCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  return mapBlogItem(item, categoryMap);
}
