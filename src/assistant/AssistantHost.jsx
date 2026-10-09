import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useDialog from "../hooks/useDialog";
import "./entry.css";

export default function AssistantHost() {
  const [open, setOpen] = useState(false);
  const [Panel, setPanel] = useState(null);
  const [failed, setFailed] = useState(false);
  const [selection, setSelection] = useState({ mode: "chat", projectId: null, revision: 0 });
  const ref = useRef(null);
  useDialog(ref, open, () => setOpen(false));
  const load = () => {
    setFailed(false);
    import("./AssistantPanel.jsx").then(module => setPanel(() => module.default)).catch(() => setFailed(true));
  };
  useEffect(() => {
    const handler = e => {
      setSelection(prev => ({ mode: e.detail.mode || "chat", projectId: e.detail.projectId || null, revision: prev.revision + 1 }));
      setOpen(true);
    };
    window.addEventListener("ask-rohit:open", handler);
    return () => window.removeEventListener("ask-rohit:open", handler);
  }, []);
  useEffect(() => { if (open && !Panel && !failed) load(); }, [open, Panel, failed]);
  return <>
    <button className="ar-launcher" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="ask-rohit-dialog">
      <span className="ar-mark" aria-hidden="true">✧</span><span>Ask Rohit</span><span className="ar-ai-tag">AI</span>
    </button>
    {(open || Panel) && createPortal(
      <div className="ar-overlay" hidden={!open}>
        <div data-dialog-backdrop className="ar-backdrop" onClick={() => setOpen(false)} />
        <aside id="ask-rohit-dialog" ref={ref} className="ar-panel" role="dialog" aria-modal="true" aria-labelledby="ar-title" tabIndex={-1}>
          <header className="ar-header"><div className="ar-heading"><span className="ar-mark" aria-hidden="true">✧</span><div><h2 id="ar-title">Ask Rohit</h2><p>An AI guide to my published work</p></div></div><button className="ar-icon-button" onClick={() => setOpen(false)} aria-label="Close Ask Rohit">✕</button></header>
          {Panel ? <Panel selection={selection} open={open} onClose={() => setOpen(false)} /> : <div className="ar-load" role="status">{failed ? <><p>The guide could not load.</p><button onClick={load}>Try again</button><a href="#projects" onClick={() => setOpen(false)}>Explore projects</a></> : "Opening your guide…"}</div>}
        </aside>
      </div>, document.body)}
  </>;
}
