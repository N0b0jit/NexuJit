import { MetadataRoute } from 'next';
import { categories } from '@/data/tools';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://nexujit.app';

    const toolUrls = categories.flatMap((category) =>
        category.tools.map((tool) => ({
            url: `${baseUrl}${tool.href}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    );

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...toolUrls,
    ];
}
