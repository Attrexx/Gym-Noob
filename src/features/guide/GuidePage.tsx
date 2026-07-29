import { Link } from 'react-router-dom';
import { ARTICOLE } from '@/data/catalog/articles';
import { Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { sfatulZilei } from '@/data/catalog/tips';

export function GuidePage() {
  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">școala de sală</div>
        <h1>Ghidul Noobului</h1>
      </div>
      <FlexuSpune poza="explica">{sfatulZilei()}</FlexuSpune>
      {ARTICOLE.map((a) => (
        <Link key={a.id} to={`/ghid/${a.id}`} style={{ textDecoration: 'none' }}>
          <Sticker>
            <b style={{ fontSize: '1.05rem' }}>
              {a.emoji} {a.titlu}
            </b>
            <p className="mic estompat" style={{ margin: '4px 0 0' }}>
              {a.rezumat}
            </p>
          </Sticker>
        </Link>
      ))}
    </div>
  );
}
