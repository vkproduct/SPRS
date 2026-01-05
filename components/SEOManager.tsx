import React, { useEffect } from 'react';

interface SEOManagerProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, any>;
}

export const SEOManager: React.FC<SEOManagerProps> = ({ 
  title, 
  description, 
  canonical = 'https://svezaproslavu.rs/', 
  type = 'website',
  image = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  jsonLd 
}) => {

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Meta Tags
    const setMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:image', image, 'property');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // 3. Update Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    // 4. Inject JSON-LD
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

  }, [title, description, canonical, type, image, jsonLd]);

  return null;
};