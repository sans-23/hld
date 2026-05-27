import { useEffect } from 'react';
import { SECTIONS } from '../config/navigation';

export function usePageTitle(articleId) {
  useEffect(() => {
    let articleTitle = 'Learn System Design';
    
    // Find the title for the active article
    for (const section of SECTIONS) {
      const item = section.items.find(i => i.id === articleId);
      if (item) {
        articleTitle = item.label;
        break;
      }
    }

    document.title = `${articleTitle} | ouii`;
  }, [articleId]);
}
