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
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async () => {
    if (missing.length) { setShowMissing(true); return; }
    await persist(true);
  };

  return (
    <div className="ob">
      <header className="ob-top">
        <div className="ob-brand"><KairnLogo size={30} /><span>Kairn</span></div>
        <SaveBadge s={saveState} onRetry={() => persist(false)} />
      </header>
      <div className="ob-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>

      <div className="ob-layout" ref={top}>
        <aside className="ob-nav">
          <p className="ob-eyebrow">Création de votre site</p>
          <h1 className="ob-title">{state.client || 'Votre projet'}</h1>
          <p className="ob-pct">{pct} % complété</p>
          <ol>
            {sections.map((s, i) => {
              const f = filledFor(s).length;
              return (
                <li key={s.id}>
                  <button type="button" className={i === step ? 'is-on' : ''} onClick={() => go(i)}>
                    <span className={`ob-dot${f === s.fields.length ? ' is-full' : f ? ' is-part' : ''}`} />
                    {s.title}
                  </button>
                </li>
              );
            })}
            <li>
              <button type="button" className={isLast ? 'is-on' : ''} onClick={() => go(sections.length)}>
                <span className={`ob-dot${state.status === 'submitted' ? ' is-full' : ''}`} />Envoi
              </button>
            </li>
          </ol>
        </aside>

        <main className="ob-main">
          {!isLast ? (
            <section className="ob-card" key={sec.id}>
              <p className="ob-eyebrow">Étape {step + 1} sur {sections.length + 1}</p>
              <h2>{sec.title}</h2>
              {sec.intro && <p className="ob-intro">{sec.intro}</p>}
              <div className="ob-fields">
                {sec.fields.map((f) => (
                  <Field key={f.id} f={f} answers={answers} setValue={setValue} files={files} onUpload={onUpload} onRemove={onRemove} />
                ))}
              </div>
              <div className="ob-actions">
                {step > 0 && <button type="button" className="ob-btn is-ghost" onClick={() => go(step - 1)}>Précédent</button>}
                <button type="button" className="ob-btn" onClick={() => go(step + 1)}>Continuer</button>
              </div>
            </section>
          ) : (
            <section className="ob-card">
              <p className="ob-eyebrow">Dernière étape</p>
              {state.status === 'submitted' ? (
                <>
                  <h2>Merci, c’est envoyé.</h2>
                  <p className="ob-intro">Nous revenons vers vous rapidement. Vous pouvez encore modifier vos réponses avec ce même lien : chaque changement est enregistré.</p>
                </>
              ) : (
                <>
                  <h2>Tout est prêt ?</h2>
                  <p className="ob-intro">Vos réponses sont déjà enregistrées au fur et à mesure. Ce bouton nous prévient que le questionnaire est terminé. Vous pourrez encore le modifier ensuite.</p>
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
                  <div className="ob-actions">
                    <button type="button" className="ob-btn is-ghost" onClick={() => go(step - 1)}>Précédent</button>
                    <button type="button" className="ob-btn" onClick={submit} disabled={saveState.kind === 'saving'}>Envoyer à Kairn</button>
                  </div>
                </>
              )}
              {saveState.kind === 'error' && <p className="ob-err">{saveState.message}</p>}
            </section>
          )}
          <p className="ob-help">Une question ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        </main>
      </div>
    </div>
  );
}

function SaveBadge({ s, onRetry }) {
  if (s.kind === 'saving' || s.kind === 'pending') return <span className="ob-save">Enregistrement…</span>;
  if (s.kind === 'saved') return <span className="ob-save is-ok">Enregistré à {time(s.at)}</span>;
  if (s.kind === 'error') return <button type="button" className="ob-save is-err" onClick={onRetry}>Non enregistré · Réessayer</button>;
  return <span className="ob-save">Enregistrement automatique</span>;
}
