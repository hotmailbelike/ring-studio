import { PORTFOLIO_URL, SOURCE_URL } from '../../lib/siteLinks';

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Built by{' '}
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
          Abdullah Omar
        </a>
      </p>
      <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
        Source
      </a>
    </footer>
  );
}
