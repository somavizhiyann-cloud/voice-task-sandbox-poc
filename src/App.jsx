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
      letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{m.label}</span>
  );
}

function StageBadge({ stage }) {
  const m = STAGE_META[stage];
  return (
    <span style={{
      background: m.bg, color: m.c, border: `1px solid ${m.c}44`,
      borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700,
      letterSpacing: 0.5, textTransform: "uppercase",
    }}>{stage}</span>
  );
}

// ── Idea Card ─────────────────────────────────────────────────────────────────
function IdeaCard({ idea, stageMeta, onPromote, onCompleteTodo, onSnoozeIdea, onResolveQuestion }) {
  const snoozed = idea.status === "snoozed";

  return (
    <div style={{
      background: snoozed ? "#0a0f1a" : "#0d1526",
      border: `1px solid ${snoozed ? "#2a2a3a" : "#1e293b"}`,
      borderRadius: 10, padding: 14,
      borderTop: `3px solid ${snoozed ? "#334155" : stageMeta.c}`,
      opacity: snoozed ? 0.75 : 1,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: snoozed ? "#6b7280" : "#f1f5f9", marginBottom: 4 }}>
            {idea.name}
          </div>
          {snoozed && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              color: "#64748b", background: "#1e293b",
              border: "1px solid #334155", borderRadius: 20,
              padding: "1px 8px", textTransform: "uppercase",
            }}>⏸ Snoozed</span>
          )}
        </div>
        <StageBadge stage={idea.stage} />
      </div>

      {/* Body of Evidence — Info + Trend */}
      {idea.evidence.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            Body of Evidence ({idea.evidence.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {idea.evidence.map(ev => (
              <div key={ev.uid} style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                background: "#0a1220", borderRadius: 7, padding: "7px 9px",
              }}>
                <TagPill tag={ev.tag} />
                <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4, flex: 1 }}>{ev.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Questions */}
      {idea.questions.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            Open Questions ({idea.questions.filter(q => !q.resolved).length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {idea.questions.map(q => (
              <div key={q.uid} style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                background: q.resolved ? "#0a100f" : "#150e1a",
                borderRadius: 7, padding: "7px 9px",
                opacity: q.resolved ? 0.45 : 1,
              }}>
                <TagPill tag="Question" />
                <span style={{ fontSize: 11, color: "#e2d3ec", lineHeight: 1.4, flex: 1, textDecoration: q.resolved ? "line-through" : "none" }}>
                  {q.text}
                </span>
                {!q.resolved && (
                  <button
                    onClick={() => onResolveQuestion(idea.id, q.uid)}
                    title="Mark as answered — capture the answer as a new Info thought"
                    style={{
                      background: "#ec489920", border: "1px solid #ec489944",
                      color: "#ec4899", borderRadius: 5, padding: "2px 7px",
                      fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                    }}>Answered ✓</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* To-Dos */}
      {idea.todos.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            To-Do ({idea.todos.filter(t => !t.done).length} open)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {idea.todos.map(todo => {
              const isSnoozeTrigger = idea.snoozedByTodoId === todo.uid;
              return (
                <div key={todo.uid} style={{
                  display: "flex", gap: 8, alignItems: "flex-start",
                  background: todo.done ? "#0a100f" : isSnoozeTrigger ? "#1a2010" : "#0b1a12",
                  borderRadius: 7, padding: "7px 9px",
                  border: isSnoozeTrigger ? "1px solid #f59e0b44" : "1px solid transparent",
                  opacity: todo.done ? 0.45 : 1,
                }}>
                  {/* Checkbox */}
                  <div
                    onClick={() => !todo.done && onCompleteTodo(idea.id, todo.uid)}
                    style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: `2px solid ${todo.done ? "#10b981" : "#4b5563"}`,
                      background: todo.done ? "#10b98133" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: todo.done ? "default" : "pointer", fontSize: 10, color: "#10b981",
                    }}>{todo.done ? "✓" : ""}</div>

                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 11, color: "#a7f3d0", lineHeight: 1.4,
                      textDecoration: todo.done ? "line-through" : "none",
                    }}>{todo.text}</span>
                    {isSnoozeTrigger && !todo.done && (
                      <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 2 }}>
                        ⏸ Idea snoozed until this is done
                      </div>
                    )}
                  </div>

                  {/* Snooze button */}
                  {!todo.done && !snoozed && (
                    <button
                      onClick={() => onSnoozeIdea(idea.id, todo.uid)}
                      title="Park this idea until the to-do is done"
                      style={{
                        background: "#f59e0b18", border: "1px solid #f59e0b44",
                        color: "#f59e0b", borderRadius: 5, padding: "2px 7px",
                        fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                      }}>⏸ Snooze idea</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {idea.evidence.length === 0 && idea.questions.length === 0 && idea.todos.length === 0 && (
        <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 10, fontStyle: "italic" }}>
          No thoughts linked yet.
        </div>
      )}

      {/* Footer */}
      {idea.stage !== "Thesis" && (
        <button
          onClick={() => !snoozed && onPromote(idea.id)}
          disabled={snoozed}
          title={snoozed ? "Complete the snoozed To-Do to un-park this idea" : undefined}
          style={{
            width: "100%", background: "transparent",
            border: `1px solid ${snoozed ? "#2a3040" : stageMeta.c + "66"}`,
            color: snoozed ? "#334155" : stageMeta.c,
            borderRadius: 7, padding: "6px", fontSize: 11, fontWeight: 700,
            cursor: snoozed ? "not-allowed" : "pointer",
          }}>
          {snoozed ? "⏸ Parked — complete the To-Do first" : `→ Promote to ${idea.stage === "Idea" ? "Toe Dip" : "Thesis"}`}
        </button>
      )}
      {idea.stage === "Thesis" && (
        <div style={{ fontSize: 11, color: "#3b82f6", textAlign: "center", padding: "5px 0" }}>
          ✓ Full conviction position
        </div>
      )}
    </div>
  );
}

// ── Ideas & Lifecycle View ────────────────────────────────────────────────────
function IdeasView({ ideas, onPromote, onAddIdea, onCompleteTodo, onSnoozeIdea, onResolveQuestion }) {
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
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
          Info + Trend build the case → Question triggers research → To-Do can snooze the idea
        </p>
      </div>

      {/* Flow legend */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 28, background: "#0d1526",
        border: "1px solid #1e293b", borderRadius: 10, padding: "12px 16px",
        alignItems: "center", flexWrap: "wrap", gap: 8,
      }}>
        {[
          { tag: "Info",     desc: "feeds Body of Evidence" },
          { tag: "Trend",    desc: "feeds Body of Evidence" },
          { tag: "Question", desc: "opens a research loop" },
          { tag: "Todo",     desc: "can snooze the idea" },
        ].map(({ tag, desc }) => (
          <div key={tag} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TagPill tag={tag} />
            <span style={{ fontSize: 11, color: "#6b7280" }}>→ {desc}</span>
            <span style={{ color: "#1e293b", marginLeft: 4 }}>·</span>
          </div>
        ))}
      </div>

      {/* Funnel summary */}
      <div style={{ display: "flex", alignItems: "stretch", marginBottom: 28 }}>
        {STAGES.map((stage, i) => {
          const m = STAGE_META[stage];
          const all = ideas.filter(id => id.stage === stage);
          const snoozed = all.filter(i => i.status === "snoozed").length;
          return (
            <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              {i > 0 && <div style={{ fontSize: 22, color: "#4b5563", margin: "0 6px", flexShrink: 0 }}>›</div>}
              <div style={{ flex: 1, background: `${m.c}12`, border: `1px solid ${m.c}33`, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: m.c }}>{all.length}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{stage}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{m.desc}</div>
                {snoozed > 0 && (
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>⏸ {snoozed} snoozed</div>
                )}
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
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    stageMeta={m}
                    onPromote={onPromote}
                    onCompleteTodo={onCompleteTodo}
                    onSnoozeIdea={onSnoozeIdea}
                    onResolveQuestion={onResolveQuestion}
                  />
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
              borderRadius: 8, color: "#e2e8f0", padding: "9px 14px", fontSize: 13, outline: "none",
            }}
          />
          <button onClick={addIdea} style={{
            background: "#f59e0b", border: "none", color: "#080f1a",
            borderRadius: 8, padding: "9px 18px", fontSize: 13,
            fontWeight: 700, cursor: "pointer", opacity: newName.trim() ? 1 : 0.4,
          }}>Add Idea</button>
        </div>
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
const BLANK_IDEA = (id, name) => ({
  id, name, stage: "Idea", status: "active", snoozedByTodoId: null,
  evidence: [], questions: [], todos: [],
});

export default function App() {
  const [view, setView] = useState("capture");
  const [ideas, setIdeas] = useState([
    BLANK_IDEA("i1", "Japan Consumer Recovery"),
    BLANK_IDEA("i2", "Indian Fintech Wave"),
    { ...BLANK_IDEA("i3", "EV Battery Supply Chain"), stage: "Toe Dip" },
    BLANK_IDEA("i4", "US Regional Bank Stress"),
    { ...BLANK_IDEA("i5", "Semiconductor Supercycle"), stage: "Thesis" },
  ]);

  const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const addIdea = (name) => {
    const id = "i" + Date.now();
    setIdeas(p => [...p, BLANK_IDEA(id, name)]);
    return id;
  };

  const promoteIdea = (id) => {
    setIdeas(p => p.map(i => {
      if (i.id !== id || i.status === "snoozed") return i;
      const next = i.stage === "Idea" ? "Toe Dip" : i.stage === "Toe Dip" ? "Thesis" : i.stage;
      return { ...i, stage: next };
    }));
  };

  // Route insights to the right bucket based on tag
  const onSaveThought = (entry) => {
    if (!entry.ideaId) return;
    setIdeas(p => p.map(idea => {
      if (idea.id !== entry.ideaId) return idea;
      const evidence  = [...idea.evidence];
      const questions = [...idea.questions];
      const todos     = [...idea.todos];
      entry.insights.forEach(ins => {
        if (ins.tag === "Info" || ins.tag === "Trend") {
          evidence.push({ ...ins, uid: uid(), source: entry.source, capturedAt: entry.time });
        } else if (ins.tag === "Question") {
          questions.push({ ...ins, uid: uid(), resolved: false });
        } else if (ins.tag === "Todo") {
          todos.push({ ...ins, uid: uid(), done: false });
        }
        // Assumption — no special routing yet, falls through silently
      });
      return { ...idea, evidence, questions, todos };
    }));
  };

  // Mark a todo as done; if it was the snooze trigger, un-snooze the idea
  const completeTodo = (ideaId, todoUid) => {
    setIdeas(p => p.map(idea => {
      if (idea.id !== ideaId) return idea;
      const todos = idea.todos.map(t => t.uid === todoUid ? { ...t, done: true } : t);
      const wasSnoozeTrigger = idea.snoozedByTodoId === todoUid;
      return {
        ...idea, todos,
        status: wasSnoozeTrigger ? "active" : idea.status,
        snoozedByTodoId: wasSnoozeTrigger ? null : idea.snoozedByTodoId,
      };
    }));
  };

  // Snooze an idea until a specific todo is done
  const snoozeIdea = (ideaId, todoUid) => {
    setIdeas(p => p.map(idea =>
      idea.id !== ideaId ? idea : { ...idea, status: "snoozed", snoozedByTodoId: todoUid }
    ));
  };

  // Mark a question as answered (user will capture the answer as a new Info thought)
  const resolveQuestion = (ideaId, questionUid) => {
    setIdeas(p => p.map(idea => {
      if (idea.id !== ideaId) return idea;
      return { ...idea, questions: idea.questions.map(q => q.uid === questionUid ? { ...q, resolved: true } : q) };
    }));
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080f1a", color: "#e2e8f0",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Top nav */}
      <div style={{
        background: "#0d1526", borderBottom: "1px solid #1e293b",
        padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
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
              fontWeight: view === v ? 700 : 400, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {view === "capture"
        ? <ThoughtCapture ideas={ideas} onSaveThought={onSaveThought} onAddIdea={addIdea} />
        : <IdeasView
            ideas={ideas}
            onPromote={promoteIdea}
            onAddIdea={addIdea}
            onCompleteTodo={completeTodo}
            onSnoozeIdea={snoozeIdea}
            onResolveQuestion={resolveQuestion}
          />
      }
    </div>
  );
}
