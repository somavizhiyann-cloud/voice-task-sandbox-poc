import { useState } from "react";
import ThoughtCapture from "./ThoughtCapture";

const STAGE_META = {
  Idea:      { c: "#f59e0b", bg: "#5c3a10", desc: "Hypothesis — no money yet" },
  "Toe Dip": { c: "#10b981", bg: "#0e3d2e", desc: "Small test position" },
  Thesis:    { c: "#3b82f6", bg: "#1e3a5f", desc: "Full conviction + plan" },
};
const TAG_META = {
  Info:       { color: "#3b82f6", bg: "#1e3a5f", label: "Info" },
  Trend:      { color: "#8b5cf6", bg: "#3b1f5e", label: "Trend" },
  Assumption: { color: "#f59e0b", bg: "#5c3a10", label: "Assumption" },
  Question:   { color: "#ec4899", bg: "#5c1a3a", label: "Question" },
  Todo:       { color: "#10b981", bg: "#0e3d2e", label: "To-Do" },
};
const STAGES = ["Idea", "Toe Dip", "Thesis"];

function TagPill({ tag }) {
  const m = TAG_META[tag] || TAG_META.Info;
  return (
    <span style={{
      background: m.bg, color: m.color, border: `1px solid ${m.color}44`,
      borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700,
      letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap"
    }}>{m.label}</span>
  );
}

function StageBadge({ stage }) {
  const m = STAGE_META[stage];
  return (
    <span style={{
      background: m.bg, color: m.c, border: `1px solid ${m.c}44`,
      borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700,
      letterSpacing: 0.5, textTransform: "uppercase"
    }}>{stage}</span>
  );
}

function IdeasView({ ideas, onPromote, onAddIdea }) {
  const [newName, setNewName] = useState("");

  const addIdea = () => {
    if (!newName.trim()) return;
    onAddIdea(newName.trim());
    setNewName("");
  };

  return (
    <div style={{ padding: "28px 32px", background: "#080f1a", minHeight: "calc(100vh - 61px)" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>Ideas & Lifecycle</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Thoughts graduate from raw Idea → Toe Dip → full Thesis.</p>
      </div>

      {/* Funnel summary */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginBottom: 32 }}>
        {STAGES.map((stage, i) => {
          const m = STAGE_META[stage];
          const count = ideas.filter(id => id.stage === stage).length;
          return (
            <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              {i > 0 && <div style={{ fontSize: 22, color: "#4b5563", margin: "0 6px", flexShrink: 0 }}>›</div>}
              <div style={{ flex: 1, background: `${m.c}12`, border: `1px solid ${m.c}33`, borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: m.c }}>{count}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{stage}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{m.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {STAGES.map(stage => {
          const m = STAGE_META[stage];
          const stageIdeas = ideas.filter(i => i.stage === stage);
          return (
            <div key={stage}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <StageBadge stage={stage} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>{stageIdeas.length} items</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stageIdeas.length === 0 && (
                  <div style={{ border: "1px dashed #1e293b", borderRadius: 10, padding: "20px 14px", textAlign: "center" }}>
                    <p style={{ color: "#4b5563", fontSize: 12, margin: 0 }}>None yet.</p>
                  </div>
                )}
                {stageIdeas.map(idea => (
                  <div key={idea.id} style={{
                    background: "#0d1526", border: "1px solid #1e293b",
                    borderRadius: 10, padding: 14, borderTop: `3px solid ${m.c}`
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{idea.name}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>
                      {idea.thoughts.length} thought{idea.thoughts.length !== 1 ? "s" : ""} captured
                    </div>
                    {idea.thoughts.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        {idea.thoughts.slice(0, 2).map((t, i) => (
                          <div key={i} style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
                            {t.insights.slice(0, 3).map((ins, j) => <TagPill key={j} tag={ins.tag} />)}
                          </div>
                        ))}
                      </div>
                    )}
                    {stage !== "Thesis" && (
                      <button onClick={() => onPromote(idea.id)} style={{
                        width: "100%", background: "transparent", border: `1px solid ${m.c}66`,
                        color: m.c, borderRadius: 7, padding: "6px", fontSize: 11,
                        fontWeight: 700, cursor: "pointer"
                      }}>
                        → Promote to {stage === "Idea" ? "Toe Dip" : "Thesis"}
                      </button>
                    )}
                    {stage === "Thesis" && (
                      <div style={{ fontSize: 11, color: "#3b82f6", textAlign: "center", padding: "5px 0" }}>
                        ✓ Full conviction position
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add new idea */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>+ Add New Idea</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addIdea()}
            placeholder="e.g. Southeast Asia Infrastructure buildout…"
            style={{
              flex: 1, background: "#111827", border: "1px solid #1e293b",
              borderRadius: 8, color: "#e2e8f0", padding: "9px 14px", fontSize: 13, outline: "none"
            }}
          />
          <button onClick={addIdea} style={{
            background: "#f59e0b", border: "none", color: "#080f1a",
            borderRadius: 8, padding: "9px 18px", fontSize: 13,
            fontWeight: 700, cursor: "pointer", opacity: newName.trim() ? 1 : 0.4
          }}>
            Add Idea
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("capture");
  const [ideas, setIdeas] = useState([
    { id: "i1", stage: "Idea",     name: "Japan Consumer Recovery",   thoughts: [] },
    { id: "i2", stage: "Toe Dip",  name: "Indian Fintech Wave",       thoughts: [] },
    { id: "i3", stage: "Thesis",   name: "EV Battery Supply Chain",   thoughts: [] },
    { id: "i4", stage: "Idea",     name: "US Regional Bank Stress",   thoughts: [] },
    { id: "i5", stage: "Toe Dip",  name: "Semiconductor Supercycle",  thoughts: [] },
  ]);

  const addIdea = (name) => {
    const id = "i" + Date.now();
    setIdeas(p => [...p, { id, stage: "Idea", name, thoughts: [] }]);
    return id;
  };

  const promoteIdea = (id) => {
    setIdeas(p => p.map(i => {
      if (i.id !== id) return i;
      const next = i.stage === "Idea" ? "Toe Dip" : i.stage === "Toe Dip" ? "Thesis" : i.stage;
      return { ...i, stage: next };
    }));
  };

  const onSaveThought = (entry) => {
    if (entry.ideaId) {
      setIdeas(p => p.map(i => i.id !== entry.ideaId ? i : {
        ...i, thoughts: [entry, ...i.thoughts]
      }));
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080f1a", color: "#e2e8f0",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Top nav bar */}
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
        <div style={{ display: "flex", gap: 6 }}>
          {[["capture", "✍️ Capture"], ["ideas", "💡 Ideas & Lifecycle"]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "#3b82f622" : "transparent",
              color: view === v ? "#3b82f6" : "#94a3b8",
              border: `1px solid ${view === v ? "#3b82f6" : "#1e293b"}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 12,
              fontWeight: view === v ? 700 : 400, cursor: "pointer"
            }}>{l}</button>
          ))}
        </div>
      </div>

      {view === "capture"
        ? <ThoughtCapture ideas={ideas} onSaveThought={onSaveThought} onAddIdea={addIdea} />
        : <IdeasView ideas={ideas} onPromote={promoteIdea} onAddIdea={addIdea} />
      }
    </div>
  );
}
