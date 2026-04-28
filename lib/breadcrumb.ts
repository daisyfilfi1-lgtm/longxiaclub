// BreadcrumbList JSON-LD generator for structured data

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: '面包屑导航',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Common breadcrumb definitions for the site
export const HOME_CRUMB: BreadcrumbItem = {
  name: 'AI导航站',
  url: 'https://longxiaclub.com',
};

export const TOOLS_LIST_CRUMB: BreadcrumbItem = {
  name: '产品中心',
  url: 'https://longxiaclub.com/tools',
};

export const SKILLS_LIST_CRUMB: BreadcrumbItem = {
  name: 'Skill市场',
  url: 'https://longxiaclub.com/skills',
};

export const SCENES_LIST_CRUMB: BreadcrumbItem = {
  name: '场景方案',
  url: 'https://longxiaclub.com/scenes',
};
