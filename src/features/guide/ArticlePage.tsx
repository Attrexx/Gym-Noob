import { Link, useParams } from 'react-router-dom';
import { getArticol } from '@/data/catalog/articles';
import { Sticker } from '@/design/components';
import { useT } from '@/i18n';

export function ArticlePage() {
  useT(); // abonament la limbă — conținutul vine din pachet
  const { id } = useParams();
  const art = id ? getArticol(id) : undefined;
  if (!art) {
    return (
      <div className="pagina">
        <p>Articolul nu există.</p>
        <Link to="/ghid">← Ghid</Link>
      </div>
    );
  }

  // grupăm bullet-urile consecutive în liste
  const blocuri: (string | string[])[] = [];
  for (const p of art.continut) {
    if (p.startsWith('• ')) {
      const last = blocuri[blocuri.length - 1];
      if (Array.isArray(last)) last.push(p.slice(2));
      else blocuri.push([p.slice(2)]);
    } else {
      blocuri.push(p);
    }
  }

  return (
    <div className="pagina">
      <Link to="/ghid" className="mic" style={{ fontWeight: 700 }}>
        ← Ghidul Noobului
      </Link>
      <div className="coperta" style={{ marginTop: 8 }}>
        <div className="supratitlu">lecție de la Flexu</div>
        <h1 style={{ fontSize: '1.4rem' }}>
          {art.emoji} {art.titlu}
        </h1>
      </div>
      <Sticker>
        {blocuri.map((b, i) =>
          Array.isArray(b) ? (
            <ul key={i} style={{ margin: '0 0 12px', paddingLeft: 20 }}>
              {b.map((li, j) => (
                <li key={j} style={{ marginBottom: 4 }}>
                  {li}
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>{b}</p>
          ),
        )}
      </Sticker>
    </div>
  );
}
