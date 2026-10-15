import React, { useRef, useState } from 'react';

// Rendu d'un champ du questionnaire (types décrits dans schema.js).
// Choix multiples et radios avec « Autre » : la précision est stockée sous `${id}_autre`.

const fmtSize = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} Mo` : `${Math.max(1, Math.round(n / 1024))} Ko`);

export function Field({ f, answers, setValue, files, onUpload, onRemove }) {
  const v = answers[f.id];
  const label = (
    <span className="ob-label">
      {f.label}{f.required && <em aria-label="obligatoire"> *</em>}
    </span>
  );
  const hint = f.hint && <span className="ob-hint">{f.hint}</span>;

  if (['text', 'email', 'tel', 'url'].includes(f.type)) {
    return (
      <label className="ob-field">
        {label}{hint}
        <input type={f.type} value={v || ''} placeholder={f.placeholder || (f.type === 'url' ? 'https://' : '')} onChange={(e) => setValue(f.id, e.target.value)} autoComplete="off" />
      </label>
    );
  }

  if (f.type === 'textarea') {
    return (
      <label className="ob-field">
        {label}{hint}
        <textarea rows={4} value={v || ''} placeholder={f.placeholder || ''} onChange={(e) => setValue(f.id, e.target.value)} />
      </label>
    );
  }

  if (f.type === 'radio' || f.type === 'checks') {
    const multi = f.type === 'checks';
    const list = multi ? (Array.isArray(v) ? v : []) : v;
    const options = f.other ? [...f.options, 'Autre'] : f.options;
    const isOn = (o) => (multi ? list.includes(o) : list === o);
    const toggle = (o) => {
      if (multi) setValue(f.id, isOn(o) ? list.filter((x) => x !== o) : [...list, o]);
      else setValue(f.id, isOn(o) ? '' : o);
    };
    return (
      <fieldset className="ob-field">
        <legend>{label}{hint}</legend>
        <div className="ob-chips" role={multi ? 'group' : 'radiogroup'}>
          {options.map((o) => (
            <button key={o} type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={isOn(o)} className={`ob-chip${isOn(o) ? ' is-on' : ''}`} onClick={() => toggle(o)}>
              <span className={multi ? 'ob-box' : 'ob-radio'} aria-hidden="true" />{o}
            </button>
          ))}
        </div>
        {f.other && isOn('Autre') && (
          <input className="ob-other" placeholder="Précisez" value={answers[`${f.id}_autre`] || ''} onChange={(e) => setValue(`${f.id}_autre`, e.target.value)} />
        )}
      </fieldset>
    );
  }

  if (f.type === 'list') {
    const rows = Array.isArray(v) && v.length ? v : [{}];
    const update = (i, key, val) => setValue(f.id, rows.map((r, k) => (k === i ? { ...r, [key]: val } : r)));
    return (
      <fieldset className="ob-field">
        <legend>{label}{hint}</legend>
        <div className="ob-rows">
          {rows.map((r, i) => (
            <div className="ob-row" key={i}>
              <div className="ob-row-grid">
                {f.fields.map((sub) => (
                  <label key={sub.id} className="ob-sub">
                    <span>{sub.label}</span>
                    <input value={r[sub.id] || ''} placeholder={sub.placeholder || ''} onChange={(e) => update(i, sub.id, e.target.value)} autoComplete="off" />
                  </label>
                ))}
              </div>
              {rows.length > 1 && (
                <button type="button" className="ob-row-del" onClick={() => setValue(f.id, rows.filter((_, k) => k !== i))} aria-label="Supprimer cette ligne">Retirer</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="ob-add" onClick={() => setValue(f.id, [...rows, {}])}>+ {f.addLabel || 'Ajouter'}</button>
      </fieldset>
    );
  }

  if (f.type === 'colors') {
    const list = Array.isArray(v) ? v : [];
    return (
      <fieldset className="ob-field">
        <legend>{label}{hint}</legend>
        <div className="ob-colors">
          {list.map((c, i) => (
            <span key={i} className="ob-color">
              <input type="color" value={c} onChange={(e) => setValue(f.id, list.map((x, k) => (k === i ? e.target.value : x)))} aria-label={`Couleur ${i + 1}`} />
              <code>{c.toUpperCase()}</code>
              <button type="button" onClick={() => setValue(f.id, list.filter((_, k) => k !== i))} aria-label="Retirer la couleur">×</button>
            </span>
          ))}
          {list.length < 6 && <button type="button" className="ob-add" onClick={() => setValue(f.id, [...list, '#2F5BEA'])}>+ Ajouter une couleur</button>}
        </div>
      </fieldset>
    );
  }

  if (f.type === 'files') return <Files f={f} label={label} hint={hint} files={files.filter((x) => x.field === f.id)} onUpload={onUpload} onRemove={onRemove} />;

  return null;
}

function Files({ f, label, hint, files, onUpload, onRemove }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState([]);
  const [drag, setDrag] = useState(false);

  const send = async (list) => {
    const arr = Array.from(list || []);
    if (!arr.length) return;
    const tooBig = arr.filter((x) => x.size > 25 * 1048576);
    const ok = arr.filter((x) => x.size <= 25 * 1048576);
    setBusy(true);
    const errs = await onUpload(f.id, ok);
    setErrors([...tooBig.map((x) => `${x.name} dépasse 25 Mo : envoyez-le par e-mail.`), ...errs]);
    setBusy(false);
    if (input.current) input.current.value = '';
  };

  return (
    <div className="ob-field">
      {label}{hint}
      <div
        className={`ob-drop${drag ? ' is-drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); send(e.dataTransfer.files); }}
      >
        <input ref={input} type="file" accept={f.accept} multiple={f.multiple} onChange={(e) => send(e.target.files)} hidden />
        <button type="button" className="ob-btn is-ghost" onClick={() => input.current?.click()} disabled={busy}>{busy ? 'Envoi en cours…' : 'Choisir des fichiers'}</button>
        <span>ou glissez-les ici · 25 Mo max par fichier</span>
      </div>
      {files.length > 0 && (
        <ul className="ob-files">
          {files.map((x) => (
            <li key={x.path}>
              <span>{x.name}</span><small>{fmtSize(x.size)}</small>
              <button type="button" onClick={() => onRemove(x.path)} aria-label={`Retirer ${x.name}`}>Retirer</button>
            </li>
          ))}
        </ul>
      )}
      {errors.map((e) => <p key={e} className="ob-err">{e}</p>)}
    </div>
  );
}
