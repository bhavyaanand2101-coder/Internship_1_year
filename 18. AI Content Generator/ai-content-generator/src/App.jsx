import React, { useState, useRef } from "react";
import { Copy, Check, Send, Radio, AlertCircle } from "lucide-react";

const CONTENT_TYPES = [
  { label: "Tagline", hint: "one punchy line" },
  { label: "Tweet", hint: "under 280 characters" },
  { label: "Blog Intro", hint: "2–3 sentence opener" },
  { label: "Product Description", hint: "60–90 words" },
  { label: "Email Subject Line", hint: "5–8 words" },
  { label: "Instagram Caption", hint: "with light hashtag use" },
];

const TONES = ["Bold", "Playful", "Professional", "Minimal", "Urgent"];

function buildSystemPrompt(type, tone) {
  return `You are a copy desk generating a single piece of marketing content.
Content type: ${type.label} (${type.hint}).
Tone: ${tone}.
Output ONLY the finished copy — no preamble, no quotation marks, no labels, no explanation. Do not include markdown formatting.`;
}

export default function AIContentGenerator() {
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dispatches, setDispatches] = useState([]);
  const counterRef = useRef(0);

  const canSend = topic.trim().length > 0 && !loading;

  async function handleGenerate() {
    if (!canSend) return;
    setLoading(true);
    setError(null);

    const systemPrompt = buildSystemPrompt(contentType, tone);

    try {
      const res = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          prompt: topic.trim(),
        }),
      });

      if (!res.ok) {
        let errMsg = "Transmission failed. Try sending again.";
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      if (!text) throw new Error("Empty transmission");

      counterRef.current += 1;
      const newDispatch = {
        id: counterRef.current,
        type: contentType.label,
        tone,
        prompt: topic.trim(),
        content: text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        copied: false,
      };
      setDispatches((prev) => [newDispatch, ...prev]);
      setTopic("");
    } catch (e) {
      setError(e.message || "Transmission failed. Try sending again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(id) {
    const d = dispatches.find((x) => x.id === id);
    if (!d) return;
    navigator.clipboard.writeText(d.content).then(() => {
      setDispatches((prev) =>
        prev.map((x) => (x.id === id ? { ...x, copied: true } : x))
      );
      setTimeout(() => {
        setDispatches((prev) =>
          prev.map((x) => (x.id === id ? { ...x, copied: false } : x))
        );
      }, 1500);
    });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  }

  return (
    <div className="acg-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bitter:wght@700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

        .acg-root {
          --bg: #12161A;
          --surface: #1B2126;
          --surface-2: #222A30;
          --border: rgba(236,231,221,0.10);
          --border-strong: rgba(236,231,221,0.18);
          --text: #ECE7DD;
          --text-muted: #8B959B;
          --accent: #E8A33D;
          --accent-soft: rgba(232,163,61,0.14);
          --sage: #6E9280;
          --font-display: 'Bitter', Georgia, serif;
          --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
          --font-sans: 'Inter', -apple-system, sans-serif;

          background: var(--bg);
          color: var(--text);
          font-family: var(--font-sans);
          min-height: 100%;
          width: 100%;
          box-sizing: border-box;
          padding: 28px;
        }
        .acg-root *, .acg-root *::before, .acg-root *::after { box-sizing: border-box; }

        .acg-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid var(--border-strong);
          padding-bottom: 18px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .acg-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .acg-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 30px;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .acg-sub {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
        }

        .acg-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 22px;
          align-items: start;
        }
        @media (max-width: 780px) {
          .acg-layout { grid-template-columns: 1fr; }
        }

        .acg-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 18px;
          position: sticky;
          top: 12px;
        }
        @media (max-width: 780px) {
          .acg-panel { position: static; }
        }
        .acg-panel-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 14px;
        }

        .acg-field { margin-bottom: 16px; }
        .acg-field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 7px;
        }

        .acg-select-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .acg-chip {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border-strong);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .acg-chip:hover { border-color: var(--accent); color: var(--text); }
        .acg-chip.active {
          background: var(--accent-soft);
          border-color: var(--accent);
          color: var(--accent);
        }

        .acg-hint {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 6px;
          font-style: italic;
        }

        .acg-textarea {
          width: 100%;
          resize: vertical;
          min-height: 84px;
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-sans);
          font-size: 13px;
          padding: 10px 12px;
          line-height: 1.5;
        }
        .acg-textarea:focus {
          outline: none;
          border-color: var(--accent);
        }
        .acg-textarea::placeholder { color: #565F65; }

        .acg-send {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--accent);
          color: #1A1400;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 13px;
          border: none;
          border-radius: 8px;
          padding: 11px 14px;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
        }
        .acg-send:hover:not(:disabled) { opacity: 0.9; }
        .acg-send:active:not(:disabled) { transform: scale(0.98); }
        .acg-send:disabled {
          background: var(--surface-2);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .acg-spin {
          width: 14px; height: 14px;
          border: 2px solid rgba(26,20,0,0.3);
          border-top-color: #1A1400;
          border-radius: 50%;
          animation: acg-rotate 0.7s linear infinite;
        }
        .acg-send:disabled .acg-spin {
          border: 2px solid rgba(139,149,155,0.3);
          border-top-color: var(--text-muted);
        }
        @keyframes acg-rotate { to { transform: rotate(360deg); } }

        .acg-error {
          margin-top: 10px;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 12px;
          color: #E08A6B;
          font-family: var(--font-mono);
        }

        .acg-feed { min-height: 300px; }

        .acg-empty {
          border: 1px dashed var(--border-strong);
          border-radius: 10px;
          padding: 40px 20px;
          text-align: center;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 13px;
        }

        .acg-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px 18px;
          margin-bottom: 14px;
          animation: acg-drop 0.35s ease;
        }
        @keyframes acg-drop {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .acg-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }
        .acg-dispatch-no {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent);
          letter-spacing: 0.08em;
        }
        .acg-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }
        .acg-meta b { color: var(--text); font-weight: 500; }

        .acg-card-body {
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }

        .acg-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }
        .acg-prompt-echo {
          font-size: 11px;
          color: var(--text-muted);
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .acg-copy-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--text-muted);
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .acg-copy-btn:hover { border-color: var(--accent); color: var(--accent); }
        .acg-copy-btn.copied {
          border-color: var(--sage);
          color: var(--sage);
        }
      `}</style>

      <div className="acg-header">
        <div>
          <div className="acg-eyebrow">
            <Radio size={12} />
            AI CONTENT DESK
          </div>
          <h1 className="acg-title">Copy Wire</h1>
        </div>
        <div className="acg-sub">
          {dispatches.length} dispatch{dispatches.length === 1 ? "" : "es"} sent this session
        </div>
      </div>

      <div className="acg-layout">
        <div className="acg-panel">
          <div className="acg-panel-label">BRIEF</div>

          <div className="acg-field">
            <label className="acg-field-label">Content type</label>
            <div className="acg-select-grid">
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t.label}
                  className={"acg-chip" + (t.label === contentType.label ? " active" : "")}
                  onClick={() => setContentType(t)}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="acg-hint">{contentType.hint}</div>
          </div>

          <div className="acg-field">
            <label className="acg-field-label">Tone</label>
            <div className="acg-select-grid">
              {TONES.map((t) => (
                <button
                  key={t}
                  className={"acg-chip" + (t === tone ? " active" : "")}
                  onClick={() => setTone(t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="acg-field">
            <label className="acg-field-label">Topic / brief</label>
            <textarea
              className="acg-textarea"
              placeholder="e.g. a solar-powered phone charger for hikers"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="acg-send" onClick={handleGenerate} disabled={!canSend} type="button">
            {loading ? (
              <>
                <span className="acg-spin" />
                Transmitting…
              </>
            ) : (
              <>
                <Send size={14} />
                Send Dispatch
              </>
            )}
          </button>

          {error && (
            <div className="acg-error">
              <AlertCircle size={13} style={{ marginTop: 1 }} />
              {error}
            </div>
          )}
        </div>

        <div className="acg-feed">
          {dispatches.length === 0 ? (
            <div className="acg-empty">
              No dispatches yet. Fill in the brief and send one out.
            </div>
          ) : (
            dispatches.map((d) => (
              <div className="acg-card" key={d.id}>
                <div className="acg-card-head">
                  <span className="acg-dispatch-no">
                    DISPATCH №{String(d.id).padStart(3, "0")}
                  </span>
                  <span className="acg-meta">
                    <b>{d.type}</b> · {d.tone} · {d.time}
                  </span>
                </div>
                <div className="acg-card-body">{d.content}</div>
                <div className="acg-card-foot">
                  <span className="acg-prompt-echo">re: {d.prompt}</span>
                  <button
                    className={"acg-copy-btn" + (d.copied ? " copied" : "")}
                    onClick={() => handleCopy(d.id)}
                    type="button"
                  >
                    {d.copied ? <Check size={12} /> : <Copy size={12} />}
                    {d.copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
