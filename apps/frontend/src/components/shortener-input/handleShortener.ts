import { confettiAnimate } from '../../lib/confetti';
import { Store } from '../../routes';
import { copyToClipboard, normalizeUrl } from '../../utils';

/**
 * Returns the shorter link from the server.
 * @param {string} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl: string, ttl: number) => {
  const result = await fetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/shortener`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl, ttl }),
  });

  return result.json();
};

export const handleShortener = async (store: Store) => {
  const urlInput = normalizeUrl(store.inputValue);
  const ttl = store.ttl;

  store.loading = true;

  try {
    const response = await getShortenUrl(urlInput, ttl);

    store.showResult = true;

    if (!response.newUrl) {
      store.urlError = 'Invalid url...';
      return;
    }

    const newUrl = response.newUrl;

    store.inputValue = '';
    store.reducedUrl = window.location.href.split('#')[0] + newUrl;

    copyToClipboard(store.reducedUrl);
    confettiAnimate();
  } catch (error) {
    store.urlError = 'An error occurred while shortening the URL. Please try again.';
    console.error('Error:', error);
  } finally {
    store.inputValue = '';
    store.loading = false;
  }
};
