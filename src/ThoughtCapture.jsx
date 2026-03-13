import { useState, useRef, useEffect } from "react";

const TAG_META = {
  Info:       { color: "#3b82f6", bg: "#1e3a5f", label: "Info" },
  Trend:      { color: "#8b5cf6", bg: "#3b1f5e", label: "Trend" },
  Assumption: { color: "#f59e0b", bg: "#5c3a10", label: "Assumption" },
  Question:   { color: "#ec4899", bg: "#5c1a3a", label: "Question" },
  Todo:       { color: "#10b981", bg: "#0e3d2e", label: "To-Do" },
};

const STUB_IDEAS = [
  "Japan Consumer Recovery",
  "EV Battery Supply Chain",
  "Indian Fintech Wave",
  "US Regional Bank Stress",
  "Semiconductor Supercycle",
];

const STUB_SOURCES = [
  "Call with Karan",
  "Earnings call",
  "Research note",
  "Industry conference",
  "News article",
  "Own analysis",
];

function TagPill({ tag, small }) {
  const m = TAG_META[tag] || TAG_META.Info;
  return (
    <span style={{
      background: m.bg, color: m.color, border: `1px solid ${m.color}44`,
      borderRadius: 20, padding: small ? "2px 8px" : "3px 10px",
      fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: 0.5,
      textTransform: "uppercase", whiteSpace: "nowrap"
    }}>{m.label}</span>
  );
}

function InsightCard({ insight, checked, onToggle, onTagChange }) {
  const [editing, setEditing] = useState(false);
  return (
    <div onClick={() => onToggle(insight.id)} style={{
      background: checked ? "#1a2744" : "#111827",
      border: `1px solid ${checked ? "#3b82f633" : "#1f2937"}`,
      borderRadius: 10, padding: "12px 14px", cursor: "pointer",
      display: "flex", gap: 12, alignItems: "flex-start",
      transition: "all 0.15s", opacity: checked ? 1 : 0.55,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
        background: checked ? "#3b82f6" : "transparent",
        border: `2px solid ${checked ? "#3b82f6" : "#4b5563"}`,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 8px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>
          {insight.text}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div onClick={e => { e.stopPropagation(); setEditing(!editing); }} style={{ cursor: "pointer" }}>
            <TagPill tag={insight.tag} small />
          </div>
          {editing && (
            <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {Object.keys(TAG_META).filter(t => t !== insight.tag).map(t => (
                <span key={t} onClick={() => { onTagChange(insight.id, t); setEditing(false); }}
                  style={{
                    background: TAG_META[t].bg, color: TAG_META[t].color,
                    border: `1px solid ${TAG_META[t].color}44`,
                    borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700,
                    letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer"
                  }}>{t}</span>
              ))}
            </div>
          )}
          {insight.confidence && (
            <span style={{ fontSize: 10, color: "#6b7280" }}>
              {Math.round(insight.confidence * 100)}% confident
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentThoughtCard({ entry }) {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1f2937",
      borderRadius: 10, padding: "12px 14px", marginBottom: 8
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#6b7280" }}>{entry.source || "No source"}</span>
        <span style={{ fontSize: 11, color: "#4b5563" }}>{entry.time}</span>
      </div>
      <p style={{
        margin: "0 0 8px", color: "#94a3b8", fontSize: 12, lineHeight: 1.4,
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical"
      }}>{entry.raw}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {entry.insights.map((ins, i) => <TagPill key={i} tag={ins.tag} small />)}
      </div>
      {entry.linkedIdea && entry.linkedIdea !== "__new__" && (
        <div style={{ marginTop: 6 }}>
          <span style={{
            fontSize: 10, color: "#8b5cf6", background: "#3b1f5e",
            border: "1px solid #8b5cf644", borderRadius: 4, padding: "2px 7px"
          }}>→ {entry.linkedIdea}</span>
        </div>
      )}
    </div>
  );
}

function ApiKeyBanner({ apiKey, onSave }) {
  const [input, setInput] = useState(apiKey || "");
  return (
    <div style={{
      background: "#1c1400", borderBottom: "1px solid #f59e0b44",
      padding: "12px 24px", display: "flex", alignItems: "center", gap: 12
    }}>
      <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, whiteSpace: "nowrap" }}>
        ⚠ API Key Required
      </span>
      <input
        type="password"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your Anthropic API key (sk-ant-…)"
        style={{
          flex: 1, background: "#0d1526", border: "1px solid #f59e0b44",
          borderRadius: 6, color: "#e2e8f0", padding: "7px 12px",
          fontSize: 12, outline: "none", fontFamily: "monospace"
        }}
        onKeyDown={e => e.key === "Enter" && onSave(input.trim())}
      />
      <button onClick={() => onSave(input.trim())} style={{
        background: "#f59e0b", border: "none", color: "#0d1526",
        borderRadius: 6, padding: "7px 16px", fontSize: 12,
        fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap"
      }}>Save Key</button>
      <span style={{ fontSize: 11, color: "#6b7280" }}>
        Stored in sessionStorage only
      </span>
    </div>
  );
}

export default function ThoughtCapture() {
  const [rawText, setRawText] = useState("");
  const [source, setSource] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [linkedIdea, setLinkedIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [checked, setChecked] = useState({});
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState("");
  const [savedBanner, setSavedBanner] = useState(false);
  const [listening, setListening] = useState(false);
  const [waveform, setWaveform] = useState(Array(20).fill(2));
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("anthropic_key") || "");
  const recogRef = useRef(null);
  const waveInterval = useRef(null);
  const textareaRef = useRef(null);
  const charCount = rawText.length;

  const handleSaveKey = (key) => {
    setApiKey(key);
    sessionStorage.setItem("anthropic_key", key);
  };

  // Animate waveform while listening
  useEffect(() => {
    if (listening) {
      waveInterval.current = setInterval(() => {
        setWaveform(Array(20).fill(0).map(() => 2 + Math.random() * 28));
      }, 120);
    } else {
      clearInterval(waveInterval.current);
      setWaveform(Array(20).fill(2));
    }
    return () => clearInterval(waveInterval.current);
  }, [listening]);

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Voice input not supported in this browser. Try Chrome.");
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = e => {
      const transcript = Array.from(e.results).map(res => res[0].transcript).join(" ");
      setRawText(transcript);
    };
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); setError("Voice error. Try again."); };
    r.start();
    recogRef.current = r;
    setListening(true);
  };

  const processThought = async () => {
    if (!rawText.trim()) { setError("Please enter a thought first."); return; }
    if (!apiKey) { setError("Please enter your Anthropic API key above."); return; }
    setError("");
    setLoading(true);
    setExtracted(null);

    const finalSource = source === "__custom__" ? customSource : source;
    const prompt = `You are an investment analyst assistant for a family office portfolio manager.
The user has just captured a raw thought after "${finalSource || "an interaction"}". Your job is to extract discrete, actionable insights from this thought dump.

Raw thought:
"${rawText}"

Extract each distinct insight as a separate item. For each insight, assign ONE tag from: Info, Trend, Assumption, Question, Todo.

Tag definitions:
- Info: A fact, data point, or piece of intelligence
- Trend: A macro or sector-level directional observation
- Assumption: A belief or hypothesis the user is making that could be tested
- Question: Something that needs investigation or follow-up
- Todo: A concrete action item

Respond ONLY with a JSON array. No preamble, no markdown fences. Format:
[
  {"id": "1", "text": "concise restatement of the insight", "tag": "Info", "confidence": 0.9},
  ...
]

Be concise in restating insights. Extract 2-6 insights maximum. Do not invent things not implied by the text.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const insights = JSON.parse(clean);
      setExtracted(insights);
      const initChecked = {};
      insights.forEach(i => { initChecked[i.id] = true; });
      setChecked(initChecked);
    } catch (e) {
      setError(`AI processing failed: ${e.message}`);
    }
    setLoading(false);
  };

  const toggleCheck = id => setChecked(p => ({ ...p, [id]: !p[id] }));
  const changeTag = (id, tag) => setExtracted(p => p.map(i => i.id === id ? { ...i, tag } : i));

  const saveSelected = () => {
    const selectedInsights = extracted.filter(i => checked[i.id]);
    if (!selectedInsights.length) { setError("Select at least one insight to save."); return; }
    const finalSource = source === "__custom__" ? customSource : source;
    setSaved(p => [{
      raw: rawText, source: finalSource, linkedIdea,
      insights: selectedInsights,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }, ...p]);
    setRawText(""); setSource(""); setCustomSource(""); setLinkedIdea("");
    setExtracted(null); setChecked({});
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const selectAll = () => {
    const next = {};
    extracted.forEach(i => { next[i.id] = true; });
    setChecked(next);
  };

  const selectNone = () => {
    const next = {};
    extracted.forEach(i => { next[i.id] = false; });
    setChecked(next);
  };

  const tagCounts = saved.reduce((acc, entry) => {
    entry.insights.forEach(i => { acc[i.tag] = (acc[i.tag] || 0) + 1; });
    return acc;
  }, {});

  return (
    <div style={{
      minHeight: "100vh", background: "#080f1a", color: "#e2e8f0",
      fontFamily: "'Inter', -apple-system, sans-serif", padding: 0
    }}>
      {/* Header */}
      <div style={{
        background: "#0d1526", borderBottom: "1px solid #1e293b",
        padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
          }}>💡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>Thought Capture</div>
            <div style={{ fontSize: 11, color: "#475569" }}>Global Portfolio Manager · POC</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(tagCounts).map(([tag, count]) => (
            <div key={tag} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <TagPill tag={tag} small />
              <span style={{ fontSize: 11, color: "#6b7280" }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Banner — shown when key is missing */}
      {!apiKey && <ApiKeyBanner apiKey={apiKey} onSave={handleSaveKey} />}

      {savedBanner && (
        <div style={{
          background: "#0e3d2e", borderBottom: "1px solid #10b98144",
          padding: "10px 24px", color: "#10b981", fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8
        }}>
          ✓ Insights saved to your thought log
        </div>
      )}

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 320px",
        gap: 0, minHeight: "calc(100vh - 61px)"
      }}>
        {/* Main Panel */}
        <div style={{ padding: "24px", borderRight: "1px solid #1e293b" }}>

          {/* Source Row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>SOURCE</label>
              <select value={source} onChange={e => setSource(e.target.value)} style={{
                width: "100%", background: "#0d1526", border: "1px solid #1e293b",
                borderRadius: 8, color: source ? "#e2e8f0" : "#6b7280",
                padding: "9px 12px", fontSize: 13, outline: "none"
              }}>
                <option value="">Select source…</option>
                {STUB_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="__custom__">Other (type below)</option>
              </select>
            </div>
            {source === "__custom__" && (
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>CUSTOM SOURCE</label>
                <input
                  value={customSource}
                  onChange={e => setCustomSource(e.target.value)}
                  placeholder="e.g. Call with Tanuj"
                  style={{
                    width: "100%", background: "#0d1526", border: "1px solid #1e293b",
                    borderRadius: 8, color: "#e2e8f0", padding: "9px 12px",
                    fontSize: 13, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>LINK TO IDEA (OPTIONAL)</label>
              <select value={linkedIdea} onChange={e => setLinkedIdea(e.target.value)} style={{
                width: "100%", background: "#0d1526", border: "1px solid #1e293b",
                borderRadius: 8, color: linkedIdea ? "#e2e8f0" : "#6b7280",
                padding: "9px 12px", fontSize: 13, outline: "none"
              }}>
                <option value="">No idea linked</option>
                {STUB_IDEAS.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="__new__">+ Create new idea</option>
              </select>
            </div>
          </div>

          {/* Textarea */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>
              RAW THOUGHT DUMP
            </label>
            {listening && (
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 2, height: 36,
                marginBottom: 8, padding: "0 4px"
              }}>
                {waveform.map((h, i) => (
                  <div key={i} style={{
                    width: 4, height: h, borderRadius: 2,
                    background: `hsl(${220 + i * 4}, 80%, 60%)`,
                    transition: "height 0.1s ease"
                  }} />
                ))}
                <span style={{ color: "#ef4444", fontSize: 12, marginLeft: 8, fontWeight: 600 }}>● LIVE</span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={"Speak or type your thoughts freely…\n\ne.g. 'Had a call with Karan today. He mentioned Japanese consumer sentiment is improving faster than expected — apparently foot traffic in Shibuya is up 18% YoY. Inflation is sticky but wage growth is finally outpacing it. I've been avoiding Japan for 2 years but this might be the turning point. Need to check if the yen has stopped its slide. Also curious what the BoJ meeting outcome means for rate-sensitive sectors.'"}
              style={{
                width: "100%", minHeight: 180, background: "#0d1526",
                border: "1px solid #1e293b", borderRadius: 10, color: "#e2e8f0",
                padding: "14px", fontSize: 13, lineHeight: 1.6, resize: "vertical",
                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                caretColor: "#3b82f6"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "#4b5563" }}>{charCount} chars</span>
              {charCount > 0 && (
                <span
                  style={{ fontSize: 11, color: "#6b7280", cursor: "pointer" }}
                  onClick={() => { setRawText(""); setExtracted(null); }}
                >Clear</span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button onClick={toggleVoice} style={{
              background: listening ? "#ef444420" : "#0d1526",
              border: `1px solid ${listening ? "#ef4444" : "#1e293b"}`,
              color: listening ? "#ef4444" : "#94a3b8", borderRadius: 8,
              padding: "10px 16px", fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, fontWeight: 600
            }}>
              {listening ? "⏹ Stop" : "🎙 Voice"}
            </button>
            <button
              onClick={processThought}
              disabled={loading || !rawText.trim()}
              style={{
                flex: 1,
                background: loading ? "#1e3a5f" : "linear-gradient(135deg, #2563eb, #7c3aed)",
                border: "none", color: "#fff", borderRadius: 8,
                padding: "10px 20px", fontSize: 13, fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                opacity: (!rawText.trim() && !loading) ? 0.4 : 1, letterSpacing: 0.3
              }}
            >
              {loading ? "Processing…" : "⚡ Process Thought"}
            </button>
          </div>

          {error && (
            <div style={{
              background: "#3f0f1a", border: "1px solid #ef444433",
              borderRadius: 8, padding: "10px 14px", color: "#f87171",
              fontSize: 13, marginBottom: 16
            }}>{error}</div>
          )}

          {/* Extracted Insights */}
          {extracted && (
            <div>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 12
              }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Extracted Insights</span>
                  <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>
                    {Object.values(checked).filter(Boolean).length} of {extracted.length} selected
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={selectAll} style={{
                    background: "transparent", border: "1px solid #1e293b",
                    color: "#94a3b8", borderRadius: 6, padding: "4px 10px",
                    fontSize: 11, cursor: "pointer"
                  }}>All</button>
                  <button onClick={selectNone} style={{
                    background: "transparent", border: "1px solid #1e293b",
                    color: "#94a3b8", borderRadius: 6, padding: "4px 10px",
                    fontSize: 11, cursor: "pointer"
                  }}>None</button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {extracted.map(ins => (
                  <InsightCard
                    key={ins.id} insight={ins}
                    checked={!!checked[ins.id]}
                    onToggle={toggleCheck}
                    onTagChange={changeTag}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {linkedIdea && linkedIdea !== "__new__" && (
                  <span style={{
                    fontSize: 12, color: "#8b5cf6", background: "#3b1f5e",
                    border: "1px solid #8b5cf644", borderRadius: 6, padding: "4px 10px"
                  }}>→ {linkedIdea}</span>
                )}
                {linkedIdea === "__new__" && (
                  <span style={{
                    fontSize: 12, color: "#10b981", background: "#0e3d2e",
                    border: "1px solid #10b98144", borderRadius: 6, padding: "4px 10px"
                  }}>+ New idea will be created</span>
                )}
                <button onClick={saveSelected} style={{
                  flex: 1, background: "#10b981", border: "none", color: "#fff",
                  borderRadius: 8, padding: "11px 20px", fontSize: 13,
                  fontWeight: 700, cursor: "pointer", letterSpacing: 0.3
                }}>
                  Save {Object.values(checked).filter(Boolean).length} Selected Insights →
                </button>
              </div>
            </div>
          )}

          {!extracted && !loading && (
            <div style={{
              border: "1px dashed #1e293b", borderRadius: 12,
              padding: "40px 20px", textAlign: "center"
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>✍️</div>
              <p style={{ color: "#4b5563", fontSize: 13, margin: 0 }}>
                Enter your raw thought dump above and hit{" "}
                <strong style={{ color: "#6b7280" }}>Process Thought</strong>.<br />
                AI will extract discrete insights and tag each one.
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              border: "1px solid #1e3a5f", borderRadius: 12,
              padding: "40px 20px", textAlign: "center"
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", margin: "0 auto 16px",
                border: "3px solid #1e3a5f", borderTopColor: "#3b82f6",
                animation: "spin 0.8s linear infinite"
              }} />
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Extracting insights…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>

        {/* Right Panel — Recent Captures */}
        <div style={{ padding: "24px 16px", overflowY: "auto" }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>Recent Captures</span>
            <span style={{ fontSize: 11, color: "#4b5563", marginLeft: 8 }}>{saved.length} total</span>
          </div>

          {saved.length === 0 && (
            <div style={{
              border: "1px dashed #1e293b", borderRadius: 10,
              padding: "24px 16px", textAlign: "center"
            }}>
              <p style={{ color: "#4b5563", fontSize: 12, margin: 0 }}>
                Saved insights will appear here for context.
              </p>
            </div>
          )}

          {saved.map((entry, i) => <RecentThoughtCard key={i} entry={entry} />)}

          {/* Tag Legend */}
          <div style={{
            marginTop: 20, background: "#0d1526", border: "1px solid #1e293b",
            borderRadius: 10, padding: "14px"
          }}>
            <div style={{
              fontSize: 11, color: "#4b5563", marginBottom: 10,
              fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5
            }}>Tag Legend</div>
            {Object.entries(TAG_META).map(([tag, m]) => (
              <div key={tag} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                <TagPill tag={tag} small />
                <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>
                  {tag === "Info" && "A fact or data point"}
                  {tag === "Trend" && "A directional macro observation"}
                  {tag === "Assumption" && "A belief that can be tested"}
                  {tag === "Question" && "Needs further investigation"}
                  {tag === "Todo" && "A concrete action item"}
                </span>
              </div>
            ))}
          </div>

          {/* Reset API key */}
          {apiKey && (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <span
                onClick={() => handleSaveKey("")}
                style={{ fontSize: 11, color: "#4b5563", cursor: "pointer", textDecoration: "underline" }}
              >
                Reset API key
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
