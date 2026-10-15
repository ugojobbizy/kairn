import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { KairnLogo, useV2Favicon } from '../v2/layout.jsx';
import { CONTACT_EMAIL } from '../config.js';
import { sectionsFor, isFilled } from './schema.js';
import { load, save, upload, removeFile } from './store.js';
import { Field } from './fields.jsx';
import './onboarding.css';

// Questionnaire envoyé au client (/onboarding/:token) : une étape par section,
// enregistrement automatique à chaque modification, envoi final quand les champs obligatoires sont remplis.

const SAVE_DELAY = 900;
const time = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

export default function Onboarding() {
  useV2Favicon();
  const { token } = useParams();
  const [state, setState] = useState({ loading: true });
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState({ kind: 'idle' });
  const [showMissing, setShowMissing] = useState(false);
  const timer = useRef(null);
  const latest = useRef({});
  const top = useRef(null);

  useEffect(() => {
    let alive = true;
    load(token)
      .then((r) => {
        if (!alive) return;
        const data = r.data || {};
        latest.current = data;
        setAnswers(data);
        setFiles(r.files || []);
        setState({ loading: false, client: r.client_name, sector: r.sector, status: r.status });
      })
      .catch((e) => alive && setState({ loading: false, error: e.message }));
    return () => { alive = false; };
  }, [token]);

  const sections = useMemo(() => sectionsFor(state.sector), [state.sector]);

  // Sur mobile, la liste des étapes défile à l'horizontale : garder l'étape en cours visible
  useEffect(() => {
    const list = document.querySelector('.ob-steps');
    const on = list?.querySelector('button.is-on');
    if (list && on && list.scrollWidth > list.clientWidth) {
      list.scrollLeft = on.offsetLeft - (list.clientWidth - on.offsetWidth) / 2;
    }
  }, [step, state.loading]);

  const persist = useCallback(async (submit = false) => {
    clearTimeout(timer.current);
    setSaveState({ kind: 'saving' });
    try {
      const r = await save(token, latest.current, submit);
      setSaveState({ kind: 'saved', at: new Date() });
      if (submit) setState((s) => ({ ...s, status: r.status }));
      return true;
    } catch (e) {
      setSaveState({ kind: 'error', message: e.message });
      return false;
    }
  }, [token]);

  const setValue = useCallback((id, value) => {
    setAnswers((a) => {
      const next = { ...a, [id]: value };
      latest.current = next;
      return next;
    });
    setSaveState({ kind: 'pending' });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(false), SAVE_DELAY);
  }, [persist]);

  // Enregistrer avant de quitter la page si une modification attend encore
  useEffect(() => {
    const flush = () => { if (timer.current) persist(false); };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [persist]);

  const onUpload = useCallback(async (fieldId, fileList) => {
    const errors = [];
    for (const f of fileList) {
      try { setFiles(await upload(token, fieldId, f)); } catch (e) { errors.push(e.message); }
    }
    return errors;
  }, [token]);

  const onRemove = useCallback(async (path) => setFiles(await removeFile(token, path)), [token]);

  if (state.loading) return <div className="ob ob-center"><p>Chargement…</p></div>;
  if (state.error) {
    return (
      <div className="ob ob-center">
        <div className="ob-card ob-msg">
          <KairnLogo size={40} />
          <h1>Lien introuvable</h1>
          <p>{state.error}</p>
          <p>Besoin d’aide : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        </div>
      </div>
    );
  }

  const filledFor = (s) => s.fields.filter((f) => (f.type === 'files' ? files.some((x) => x.field === f.id) : isFilled(answers[f.id])));
  const missing = sections.flatMap((s, i) => s.fields
    .filter((f) => f.required && !(f.type === 'files' ? files.some((x) => x.field === f.id) : isFilled(answers[f.id])))
    .map((f) => ({ step: i, label: f.label, section: s.title })));
  const total = sections.reduce((n, s) => n + s.fields.length, 0);
  const done = sections.reduce((n, s) => n + filledFor(s).length, 0);
  const pct = Math.round((done / total) * 100);
  const isLast = step === sections.length;
  const sec = sections[step];

  const go = (i) => {
    setStep(i);
    setShowMissing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    if (missing.length) { setShowMissing(true); return; }
    await persist(true);
  };

  const pad = (n) => String(n).padStart(2, '0');
  const next = sections[step + 1];

  return (
    <div className="ob">
      <aside className="ob-side">
        <div className="ob-side-glow" aria-hidden="true" />
        <div className="ob-side-in">
          <div className="ob-brand"><KairnLogo size={28} /><span>Kairn</span></div>
          <p className="ob-eyebrow">Création de votre site</p>
          <h1 className="ob-title">{state.client || 'Votre projet'}</h1>
          <div className="ob-progress">
            <div className="ob-progress-bar"><i style={{ width: `${pct}%` }} /></div>
            <span>{pct} %</span>
          </div>
          <ol className="ob-steps">
            {sections.map((s, i) => {
              const f = filledFor(s).length;
              const st = f === s.fields.length ? 'is-full' : f ? 'is-part' : '';
              return (
                <li key={s.id}>
                  <button type="button" className={`${i === step ? 'is-on ' : ''}${st}`} onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                    <span className="ob-num">{f === s.fields.length ? '✓' : pad(i + 1)}</span>
                    <span className="ob-step-t">{s.title}</span>
                    {f > 0 && f < s.fields.length && <span className="ob-step-c">{f}/{s.fields.length}</span>}
                  </button>
                </li>
              );
            })}
            <li>
              <button type="button" className={`${isLast ? 'is-on ' : ''}${state.status === 'submitted' ? 'is-full' : ''}`} onClick={() => go(sections.length)}>
                <span className="ob-num">{state.status === 'submitted' ? '✓' : pad(sections.length + 1)}</span>
                <span className="ob-step-t">Envoi</span>
              </button>
            </li>
          </ol>
          <div className="ob-side-foot">
            <SaveBadge s={saveState} onRetry={() => persist(false)} />
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </div>
      </aside>

      <main className="ob-main" ref={top}>
        <div className="ob-main-in">
          {!isLast ? (
            <section key={sec.id} className="ob-section">
              {step === 0 && (
                <div className="ob-welcome">
                  <b>Bonjour,</b>
                  <p>Ce questionnaire nous donne tout ce qu’il faut pour créer votre site. Comptez environ 15 minutes. Rien n’est obligatoire : répondez à ce que vous savez, vos réponses sont enregistrées au fur et à mesure et vous pouvez revenir quand vous voulez avec ce même lien.</p>
                </div>
              )}
              <header className="ob-head">
                <span className="ob-bignum">{pad(step + 1)}</span>
                <div>
                  <p className="ob-eyebrow">Étape {step + 1} sur {sections.length + 1}</p>
                  <h2>{sec.title}</h2>
                  {sec.intro && <p className="ob-intro">{sec.intro}</p>}
                </div>
              </header>
              <div className="ob-fields">
                {sec.fields.map((f) => (
                  <div key={f.id} className={`ob-cell${f.half ? ' is-half' : ''}`}>
                    <Field f={f} answers={answers} setValue={setValue} files={files} onUpload={onUpload} onRemove={onRemove} />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="ob-section">
              <header className="ob-head">
                <span className="ob-bignum">{pad(sections.length + 1)}</span>
                <div>
                  <p className="ob-eyebrow">Dernière étape</p>
                  {state.status === 'submitted' ? (
                    <>
                      <h2>Merci, c’est envoyé.</h2>
                      <p className="ob-intro">Nous revenons vers vous rapidement. Vous pouvez encore modifier vos réponses avec ce même lien : chaque changement est enregistré.</p>
                    </>
                  ) : (
                    <>
                      <h2>Tout est prêt ?</h2>
                      <p className="ob-intro">Vos réponses sont déjà enregistrées. Ce bouton nous prévient simplement que vous avez terminé. Vous pourrez encore les modifier ensuite.</p>
                    </>
                  )}
                </div>
              </header>
              <ul className="ob-recap">
                {sections.map((s, i) => {
                  const f = filledFor(s).length;
                  return (
                    <li key={s.id}>
                      <button type="button" onClick={() => go(i)}>
                        <span>{s.title}</span>
                        <small className={f === s.fields.length ? 'is-full' : f ? 'is-part' : ''}>{f === 0 ? 'Pas encore rempli' : `${f} sur ${s.fields.length}`}</small>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {showMissing && missing.length > 0 && (
                <div className="ob-missing" role="alert">
                  <b>Il manque {missing.length} réponse{missing.length > 1 ? 's' : ''} obligatoire{missing.length > 1 ? 's' : ''} :</b>
                  <ul>
                    {missing.map((m) => (
                      <li key={m.section + m.label}><button type="button" onClick={() => go(m.step)}>{m.section} : {m.label}</button></li>
                    ))}
                  </ul>
                </div>
              )}
              {saveState.kind === 'error' && <p className="ob-err">{saveState.message}</p>}
            </section>
          )}
        </div>

        <div className="ob-dock">
          <div className="ob-dock-in">
            {step > 0 ? <button type="button" className="ob-btn is-ghost" onClick={() => go(step - 1)}>← Précédent</button> : <span />}
            {!isLast ? (
              <button type="button" className="ob-btn" onClick={() => go(step + 1)}>
                {next ? <>Continuer<span className="ob-btn-next"> · {next.title}</span></> : 'Continuer'} →
              </button>
            ) : state.status === 'submitted' ? (
              <span className="ob-sent">✓ Envoyé</span>
            ) : (
              <button type="button" className="ob-btn is-accent" onClick={submit} disabled={saveState.kind === 'saving'}>Envoyer à Kairn</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SaveBadge({ s, onRetry }) {
  if (s.kind === 'saving' || s.kind === 'pending') return <span className="ob-save">Enregistrement…</span>;
  if (s.kind === 'saved') return <span className="ob-save is-ok">Enregistré à {time(s.at)}</span>;
  if (s.kind === 'error') return <button type="button" className="ob-save is-err" onClick={onRetry}>Non enregistré · Réessayer</button>;
  return <span className="ob-save">Enregistrement automatique</span>;
}
