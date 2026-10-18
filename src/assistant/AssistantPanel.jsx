import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "../constants";
import { LIMITS } from "../../shared/assistant.js";
import { requestAssistant } from "./client";
import "./assistant.css";

const suggestions = ["Give me a 30-second overview.", "What production backend experience does Rohit have?", "Which projects demonstrate AI engineering?", "Which project should I explore for a backend role?"];
const catalog = {
  profile: ["About Rohit", "#about"], experience: ["Professional experience", "#experience"],
  "role-aws": ["SDE Intern · AWS", "#experience"], "role-engineer": ["Software Engineer · Torry Harris", "#experience"], "role-intern": ["Intern · Torry Harris", "#experience"],
  "role-club": ["REVA Developer's Club", "#experience"], skills: ["Published skills", "#skills"],
  resume: ["Resume", "/resume/Rohit_Resume.pdf"], contact: ["Contact", "#contact"],
  ...Object.fromEntries(projects.map(p => ["project-" + p.id, [p.title, "#project-" + p.id]])),
};
const sample = "SAMPLE BACKEND ROLE — Java Backend Engineer\nBuild Spring Boot services and REST APIs with PostgreSQL. Use Kafka for asynchronous workflows and Redis for caching. Collaborate on authentication, automated testing, and observability. Discuss production reliability and deployment experience with Kubernetes. This is a fictional example, not a real vacancy.";

// Cited projects also get direct links to the live demo (when there is one) and the code.
const projectLinks = Object.fromEntries(projects.map(p => ["project-" + p.id, [
  ...(p.link !== p.repo ? [[p.title + " live demo", p.link]] : []),
  ...(p.repo ? [[p.title + " code", p.repo]] : []),
]]));
const external = { target: "_blank", rel: "noopener noreferrer" };
function Sources({ ids, navigate }) {
  return <div className="ar-sources" aria-label="Supporting sources">{[...new Set(ids)].map(id => catalog[id] && <Fragment key={id}>
    <a href={catalog[id][1]} onClick={e => navigate(e, catalog[id][1])} {...(id === "resume" ? external : {})}><span aria-hidden="true">↗</span> {catalog[id][0]}</a>
    {projectLinks[id]?.map(([label, href]) => <a key={href} href={href} {...external}><span aria-hidden="true">↗</span> {label}</a>)}
  </Fragment>)}</div>;
}
// The empty composer suggests things to ask, one at a time.
const prompts = ["Ask how CallPilot works…", "Which projects use Java and Spring Boot?", "What did Rohit build at AWS?", "Where has he used Kafka and Redis?", "Show me code I can review…"];
function CyclingPlaceholder() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % prompts.length), 3200);
    return () => clearInterval(timer);
  }, []);
  return <span className="ar-placeholder" aria-hidden="true"><span key={index}>{prompts[index]}</span></span>;
}
function Report({ report, navigate }) {
  return <article className="ar-report">
    <div className="ar-eyebrow">EVIDENCE REVIEW</div><h3>A conversation starter.</h3><p>{report.roleSummary}</p>
    <h4>Requirements & published evidence</h4>
    {report.requirements.map((r, i) => <div className="ar-requirement" key={i}><span className={"ar-evidence " + (r.evidence === "Direct evidence" ? "ar-direct" : "")}>{r.evidence}</span><h5>{r.requirement}</h5><p>{r.explanation}</p><Sources ids={r.sourceIds} navigate={navigate} /></div>)}
    {report.projects.length > 0 && <><h4>Projects to explore</h4>{report.projects.map(p => <div key={p.sourceId} className="ar-requirement"><p>{p.reason}</p><Sources ids={[p.sourceId]} navigate={navigate} /></div>)}</>}
    <h4>Clarify in a conversation</h4><ul>{report.clarification.map((s, i) => <li key={i}>{s}</li>)}</ul>
    <h4>Technical discussion topics</h4><ul>{report.discussionTopics.map((s, i) => <li key={i}>{s}</li>)}</ul>
    <p className="ar-note">Missing evidence does not mean a missing skill. This is a guide to published work, not a hiring recommendation.</p>
  </article>;
}
export default function AssistantPanel({ selection, open, onClose, onBusyChange }) {
  const [mode, setMode] = useState(selection.mode);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [job, setJob] = useState("");
  const [report, setReport] = useState(null);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const controller = useRef(null), busy = useRef(false), scroll = useRef(null), nearBottom = useRef(false), input = useRef(null), streamRef = useRef(null), typing = useRef(null), autoTimer = useRef(null);
  // Discard an answer that is still appearing (new conversation).
  const stopStreaming = () => { streamRef.current?.(); streamRef.current = null; typing.current = null; };
  // Show the rest of an answer that is still appearing straight away, keeping it in the conversation.
  const finishTyping = () => {
    const done = typing.current;
    if (!done) return;
    stopStreaming();
    setMessages(prev => [...prev, { role: "assistant", content: done.text, sourceIds: done.sourceIds }]);
    setStreamingMessage(null);
  };
  const finishRef = useRef(finishTyping);
  finishRef.current = finishTyping; // effects below call the latest version
  useLayoutEffect(() => {
    const el = input.current; // grow with the question, up to about six lines
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 168) + "px";
  }, [question, mode]);
  useEffect(() => {
    controller.current?.abort();
    finishRef.current();
    clearTimeout(autoTimer.current);
    busy.current = false;
    setPending(false);
    setStreamingMessage(null);
    setMode(selection.mode);
    setError(null); setRetry(null);
    if (selection.projectId) {
      const project = projects.find(p => "project-" + p.id === selection.projectId);
      if (project) {
        const q = `Tell me about the ${project.title} project: what it does, how it's built, and what Rohit worked on.`;
        setMessages([{ role: "user", content: q }]);
        nearBottom.current = true;
        // Only this project's facts are sent for the opening answer; follow-ups use the whole portfolio.
        autoTimer.current = setTimeout(() => run({ mode: "chat", body: { message: q, history: [], projectId: selection.projectId } }), 0);
      }
    }
  }, [selection]);
  useEffect(() => () => { controller.current?.abort(); stopStreaming(); clearTimeout(autoTimer.current); }, []);
  useEffect(() => { onBusyChange?.(pending); }, [pending, onBusyChange]); // Ro "thinks" while a reply is pending
  useEffect(() => {
    if (nearBottom.current && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, streamingMessage, pending, status, report, error]);
  useEffect(() => { if (report) scroll.current?.querySelector(".ar-report")?.scrollIntoView({ block: "start", behavior: "auto" }); }, [report]);
  useEffect(() => { if (!open) { controller.current?.abort(); finishRef.current(); clearTimeout(autoTimer.current); } }, [open]);
  const navigate = (e, href) => {
    if (!href.startsWith("#")) return;
    e.preventDefault(); onClose();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.querySelector(href);
      if (!target) return;
      history.replaceState(null, "", href);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      target.scrollIntoView({ block: "center", inline: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }));
  };
  // Words appear one at a time, each fading in from a soft blur. The pace adapts to the length,
  // so short replies feel lively and long ones finish in about two and a half seconds.
  const startTyping = (text, sourceIds) => {
    finishTyping();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMessages(prev => [...prev, { role: "assistant", content: text, sourceIds }]);
      return;
    }
    const tokens = text.split(/(\s+)/);
    const duration = Math.min(2600, Math.max(700, tokens.filter(t => t.trim()).length * 32));
    const startedAt = performance.now();
    let shown = 0, frame, settle;
    typing.current = { text, sourceIds };
    streamRef.current = () => { cancelAnimationFrame(frame); clearTimeout(settle); };
    nearBottom.current = true;
    setStreamingMessage({ tokens, shown, sourceIds });
    const tick = now => {
      const next = Math.ceil(Math.min(1, (now - startedAt) / duration) * tokens.length);
      if (next !== shown) { shown = next; setStreamingMessage({ tokens, shown, sourceIds }); }
      if (shown < tokens.length) frame = requestAnimationFrame(tick);
      else settle = setTimeout(finishTyping, 450); // let the last words finish fading in
    };
    frame = requestAnimationFrame(tick);
  };
  const run = async (request) => {
    if (busy.current) return;
    busy.current = true; setPending(true); setError(null); setRetry(request); setStatus("Reading the published portfolio…");
    nearBottom.current = true;
    const abort = new AbortController(); controller.current = abort;
    const deadline = setTimeout(() => abort.abort("timeout"), 55000);
    try {
      const result = await requestAssistant(request.mode, request.body, abort.signal, setStatus);
      if (request.mode === "chat") startTyping(result.answer, result.sourceIds);
      else { nearBottom.current = false; setReport(result); }
      setRetry(null);
    } catch (err) {
      setError({ message: abort.signal.aborted ? abort.signal.reason === "timeout" ? "The request took too long. You can retry." : "Request cancelled. You can retry when ready." : err.message, unavailable: err.unavailable });
    } finally { clearTimeout(deadline); busy.current = false; setPending(false); controller.current = null; }
  };
  const send = (value = question) => {
    const text = value.trim();
    if (!text || text.length > LIMITS.message || busy.current) return;
    const history = messages.slice(-LIMITS.history).map(({ role, content }) => ({ role, content }));
    while (history.length && new TextEncoder().encode(JSON.stringify({ message: text, history })).length > LIMITS.bodyBytes) history.shift();
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setQuestion("");
    run({ mode: "chat", body: { message: text, history } });
  };
  const compare = () => {
    if (job.trim().length < 40) { setError({ message: "Add a little more detail: at least 40 characters." }); return; }
    setReport(null);
    run({ mode: "compare", body: { jobDescription: job.trim() } });
  };
  const reset = () => { if (busy.current) return; stopStreaming(); setStreamingMessage(null); nearBottom.current = false; if (scroll.current) scroll.current.scrollTop = 0; setMessages([]); setReport(null); setJob(""); setQuestion(""); setError(null); setRetry(null); input.current?.focus(); };
  const switchMode = value => { if (busy.current) return; setMode(value); setError(null); setRetry(null); };
  return <>
    <div className="ar-toolbar"><div className="ar-tabs" aria-label="Assistant mode"><button aria-pressed={mode === "chat"} onClick={() => switchMode("chat")} disabled={pending}>Ask a question</button><button aria-pressed={mode === "compare"} onClick={() => switchMode("compare")} disabled={pending}>Compare a role</button></div><button className="ar-reset" onClick={reset} disabled={pending} aria-label="New conversation" title="New conversation">↺ <span>New</span></button></div>
    <div className="ar-scroll" ref={scroll} onScroll={() => { const el = scroll.current; nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}>
      {mode === "chat" ? <>
        {messages.length === 0 && <div className="ar-welcome"><span className="ar-eyebrow">THE WORK, WITH EVIDENCE</span><h3>Go beyond<br /><span>the résumé.</span></h3><p>Explore Rohit's experience, follow the evidence, and find the projects that matter to you.</p><div className="ar-suggestions">{suggestions.map((s, i) => <button key={s} onClick={() => send(s)} disabled={pending}><span className="ar-question-number">0{i + 1}</span><span>{s}</span><span aria-hidden="true">↗</span></button>)}</div><div className="ar-grounded"><span aria-hidden="true">◎</span> Grounded in published work. Sources included.</div></div>}
        <div className="ar-messages" role="log" aria-label="Conversation">{messages.map((m, i) => <article key={i} className={"ar-message ar-" + m.role}><div className="ar-message-label">{m.role === "user" ? "YOU" : "ASK RO · AI"}</div><p>{m.content}</p>{m.sourceIds && <Sources ids={m.sourceIds} navigate={navigate} />}</article>)}{streamingMessage && <article className="ar-message ar-assistant ar-streaming" aria-hidden="true"><div className="ar-message-label">ASK RO · AI</div><p>{streamingMessage.tokens.slice(0, streamingMessage.shown).map((t, i) => t.trim() ? <span key={i} className="ar-word">{t}</span> : t)}<span className="ar-caret" /></p></article>}</div>
      </> : <div className="ar-compare"><div className="ar-eyebrow">FROM REQUIREMENTS TO EVIDENCE</div><h3>Bring a role.<br /><span>Explore the fit.</span></h3><p>See where the published work connects—and what deserves a conversation.</p><label htmlFor="ar-job">Job description</label><textarea id="ar-job" value={job} onChange={e => setJob(e.target.value)} maxLength={LIMITS.job} rows={8} disabled={pending} placeholder="Paste the responsibilities and requirements…" /><div className="ar-field-meta"><button onClick={() => { setJob(sample); setReport(null); setError(null); }} disabled={pending}>Try an example · sample backend role</button><span>{job.length.toLocaleString()} / 12,000</span></div><button className="ar-primary" onClick={compare} disabled={pending || !job.trim()}>Compare experience <span aria-hidden="true">↗</span></button>{report && <Report report={report} navigate={navigate} />}</div>}
      {pending && <div className="ar-thinking" role="status"><span className="ar-orb" aria-hidden="true"><i /><i /><i /></span><span className="ar-shimmer">{status}</span>{mode === "compare" && <button onClick={() => controller.current?.abort()}>Cancel</button>}</div>}
      {error && <div className="ar-error" role="alert"><strong>{error.unavailable ? "The guide is taking a break." : "Let's try that again."}</strong><p>{error.message}</p>{retry && <button onClick={() => run(retry)} disabled={pending}>Retry request ↗</button>}<Sources ids={["experience", "project-4", "resume"]} navigate={navigate} /></div>}
    </div>
    <footer className="ar-composer">
      {mode === "chat" && <form onSubmit={e => { e.preventDefault(); send(); }}>
        <label className="ar-sr-only" htmlFor="ar-question">Ask about Rohit's published work</label>
        <div className={"ar-input-wrap" + (pending ? " is-busy" : "")}>
          <div className="ar-input-field">
            <textarea ref={input} id="ar-question" value={question} onChange={e => setQuestion(e.target.value)} maxLength={LIMITS.message} rows={1} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
            {!question && <CyclingPlaceholder />}
          </div>
          {pending
            ? <button type="button" className="ar-send ar-stop" onClick={() => controller.current?.abort()} aria-label="Cancel"><svg viewBox="0 0 12 12" aria-hidden="true"><rect x="1" y="1" width="10" height="10" rx="2.5" fill="currentColor" /></svg></button>
            : <button className="ar-send" disabled={!question.trim()} aria-label="Send question"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" /></svg></button>}
        </div>
        <div className="ar-field-meta"><span className="ar-keys"><kbd>Enter</kbd> to send <kbd>Shift</kbd>+<kbd>Enter</kbd> new line</span>{question.length > 1500 && <span className={"ar-count" + (question.length > 1900 ? " is-near" : "")}>{question.length.toLocaleString()} / 2,000</span>}</div>
      </form>}
      <p className="ar-privacy">Avoid sensitive information. Conversations stay in memory for this page session; nothing is saved by this app. AI can make mistakes—check the sources.</p>
    </footer>
  </>;
}
