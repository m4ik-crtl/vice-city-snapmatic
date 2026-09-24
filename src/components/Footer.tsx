import { useUI } from '../ui';

export default function Footer() {
  const { t } = useUI();
  return (
    <footer className="footer">
      <div className="footer__in">
        <div className="footer__big">
          {t.footer.t1}
          <br />
          <span className="accent">{t.footer.t2}</span>
        </div>
        <div className="footer__meta">
          #BUILTWITHIMAGEEDITOR
          <br />
          POWERED BY{' '}
          <a
            href="https://github.com/unlayer/react-image-editor"
            target="_blank"
            rel="noreferrer"
          >
            REACT IMAGE EDITOR
          </a>
          <br />
          BY{' '}
          <a href="https://portfoliomaikon.netlify.app" target="_blank" rel="noreferrer">
            MAIKON SILVA
          </a>
          <br />
          <span style={{ textTransform: 'none', letterSpacing: 0 }}>
            {t.footer.disclaimer}
          </span>
        </div>
      </div>
    </footer>
  );
}
