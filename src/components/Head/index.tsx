import { Helmet } from 'react-helmet-async'

interface HeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  canonicalUrl?: string
}

export function Head({ title, description, keywords, image, canonicalUrl }: HeadProps) {
  const siteTitle = 'ChatBot'

  return (
    <Helmet>
      {/* 标题 */}
      <title>{title ? `${title} - ${siteTitle}` : siteTitle}</title>

      {/* Meta 标签 */}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}

      {/* 规范链接 */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* 其他元数据 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
    </Helmet>
  )
}
