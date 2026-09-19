/**
 * Extracts src and attributes from the raw iframe HTML string stored in games.json
 */
export function extractIframeSrc(iframeHtml: string): string {
  if (!iframeHtml) return '';
  let url = '';
  // Check if it's already just a URL
  if (iframeHtml.startsWith('http://') || iframeHtml.startsWith('https://') || iframeHtml.startsWith('/')) {
    url = iframeHtml.trim();
  } else {
    // Extract src specifically from <iframe src="...">
    const match = iframeHtml.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    if (match && match[1]) {
      url = match[1];
    }
  }
  if (url) {
    return url.replace(/&amp;/g, '&');
  }
  return '';
}

export function extractIframeTitle(iframeHtml: string, fallback: string): string {
  const match = iframeHtml.match(/title=["']([^"']+)["']/i);
  return match && match[1] ? match[1] : fallback;
}
