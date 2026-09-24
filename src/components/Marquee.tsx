import { useUI } from '../ui';
import { SCENES } from '../data/scenes';
import { pick } from '../types';

export default function Marquee() {
  const { lang, t } = useUI();
  const items = [...SCENES.map((s) => pick(s.title, lang)), ...t.marqueeTail];
  const loop = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
            <span className="marquee__star">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
