import { useUI } from '../ui';

export default function PostingOverlay({ image }: { image: string }) {
  const { t } = useUI();
  return (
    <div className="posting" role="status" aria-live="polite">
      <div className="posting__card">
        <div className="posting__frame">
          <img src={image} alt="" />
          <span className="posting__develop" />
          <span className="posting__scan" />
          <span className="posting__cam">◉ {t.social.cam}</span>
        </div>
        <div className="posting__bar">
          <span />
        </div>
        <div className="posting__label">
          <span className="posting__spin" />
          {t.posting}…
        </div>
      </div>
    </div>
  );
}
