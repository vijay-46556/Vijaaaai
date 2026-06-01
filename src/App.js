import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const ADMIN_PASSWORD = "vijai@admin123";

const systemPrompt = `You are Vijai AI, a smart, friendly, and helpful AI assistant. You are polite, concise, and always try to help users. Your name is Vijai AI. Always introduce yourself as Vijai AI when asked.`;

// ── Gemini API ────────────────────────────────────────────────────────────────
async function callGemini(apiKey, messages) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    "https://vijaaai.vijstorez46.workers.dev",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "API Error");
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
}
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "API Error");
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
}

// ── Storage ───────────────────────────────────────────────────────────────────
const store = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Ic = ({ d, s = 20, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  send: () => <Ic d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />,
  bot: () => <Ic d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" s={22} />,
  user: () => <Ic d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" s={22} />,
  menu: () => <Ic d="M3 12h18M3 6h18M3 18h18" s={22} />,
  close: () => <Ic d="M18 6L6 18M6 6l12 12" s={20} />,
  plus: () => <Ic d="M12 5v14M5 12h14" s={20} />,
  trash: () => <Ic d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" s={17} />,
  settings: () => <Ic d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" s={22} />,
  shield: () => <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" s={18} />,
  key: () => <Ic d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" s={18} />,
  chat: () => <Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" s={17} />,
  copy: () => <Ic d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4a2 2 0 012-2h4a2 2 0 012 2M8 4h8" s={15} />,
  check: () => <Ic d="M20 6L9 17l-5-5" s={15} />,
};

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} className={`dot dot-${i}`} />
      ))}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [apiKey, setApiKey] = useState(() => store.get("vijai_key", ""));
  const [tempKey, setTempKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [conversations, setConversations] = useState(() => store.get("vijai_convs", []));
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState(apiKey ? "chat" : "setup");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [adminPw, setAdminPw] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminTab, setAdminTab] = useState("overview");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeId) || null;
  const messages = activeConv?.messages || [];

  useEffect(() => { store.set("vijai_convs", conversations); }, [conversations]);
  useEffect(() => { store.set("vijai_key", apiKey); }, [apiKey]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  function newChat() {
    const id = Date.now().toString();
    setConversations(prev => [{ id, title: "New Chat", messages: [], createdAt: new Date().toISOString() }, ...prev]);
    setActiveId(id);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 200);
  }

  function deleteConv(id, e) {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  async function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");

    let cid = activeId;
    if (!cid) {
      const id = Date.now().toString();
      setConversations(prev => [{ id, title: text.slice(0, 35), messages: [], createdAt: new Date().toISOString() }, ...prev]);
      setActiveId(id);
      cid = id;
    }

    const userMsg = { role: "user", content: text, id: Date.now() };
    setConversations(prev => prev.map(c =>
      c.id === cid ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length === 0 ? text.slice(0, 35) : c.title } : c
    ));

    setLoading(true);
    try {
      const hist = [...(conversations.find(c => c.id === cid)?.messages || []), userMsg];
      const reply = await callGemini(apiKey, hist);
      setConversations(prev => prev.map(c =>
        c.id === cid ? { ...c, messages: [...c.messages, { role: "assistant", content: reply, id: Date.now() + 1 }] } : c
      ));
    } catch (err) {
      setConversations(prev => prev.map(c =>
        c.id === cid ? { ...c, messages: [...c.messages, { role: "assistant", content: `⚠️ ${err.message}`, id: Date.now() + 1, isError: true }] } : c
      ));
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function onKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  function copyMsg(text, id) {
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });
  }

  const totalMsgs = conversations.reduce((a, c) => a + c.messages.length, 0);
  const userMsgs = conversations.reduce((a, c) => a + c.messages.filter(m => m.role === "user").length, 0);

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (view === "setup") return (
    <div className="page">
      <div className="card">
        <div className="logo-area">
          <div className="logo-ring"><Icons.bot /></div>
          <h1 className="app-title">Vijai <span className="accent">AI</span></h1>
          <p className="sub">Your intelligent chat companion</p>
        </div>
        <div className="form-area">
          <label className="lbl"><Icons.key />&nbsp; Gemini API Key</label>
          <input className="inp" type="password" value={tempKey}
            onChange={e => { setTempKey(e.target.value); setKeyError(""); }}
            onKeyDown={e => e.key === "Enter" && saveKey()}
            placeholder="AIzaSy..." />
          {keyError && <p className="err">{keyError}</p>}
          <button className="btn-primary" onClick={saveKey}>Start Chatting →</button>
          <p className="hint">Free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="link">aistudio.google.com</a></p>
        </div>
      </div>
    </div>
  );

  function saveKey() {
    if (!tempKey.trim()) { setKeyError("Please enter your API key."); return; }
    if (!tempKey.startsWith("AIza")) { setKeyError("Invalid key. Should start with AIza..."); return; }
    setApiKey(tempKey.trim());
    setView("chat");
    newChat();
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  if (view === "admin") {
    if (!adminAuthed) return (
      <div className="page">
        <div className="card">
          <div className="logo-area">
            <div className="logo-ring shield-ring"><Icons.shield /></div>
            <h1 className="app-title">Admin <span className="accent">Panel</span></h1>
            <p className="sub">Restricted Access</p>
          </div>
          <div className="form-area">
            <label className="lbl">Admin Password</label>
            <input className="inp" type="password" value={adminPw}
              onChange={e => { setAdminPw(e.target.value); setAdminError(""); }}
              onKeyDown={e => e.key === "Enter" && checkAdmin()}
              placeholder="Enter password" />
            {adminError && <p className="err">{adminError}</p>}
            <button className="btn-primary" onClick={checkAdmin}>Login</button>
            <button className="btn-ghost" onClick={() => setView("chat")}>← Back to Chat</button>
          </div>
        </div>
      </div>
    );

    function checkAdmin() {
      if (adminPw === ADMIN_PASSWORD) { setAdminAuthed(true); setAdminError(""); }
      else setAdminError("Incorrect password.");
    }

    return (
      <div className="admin-layout">
        <div className="admin-header">
          <div className="row-center" style={{ gap: 10 }}>
            <div className="logo-ring" style={{ width: 34, height: 34 }}><Icons.shield /></div>
            <span style={{ fontWeight: 700, fontSize: 17 }}>Vijai AI — Admin</span>
          </div>
          <button className="btn-ghost sm" onClick={() => setView("chat")}>← Chat</button>
        </div>

        <div className="admin-tabs">
          {["overview", "conversations", "settings"].map(t => (
            <button key={t} className={`atab ${adminTab === t ? "atab-active" : ""}`} onClick={() => setAdminTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="admin-body">
          {adminTab === "overview" && (
            <>
              <div className="stats-grid">
                {[
                  { l: "Total Chats", v: conversations.length, cl: "indigo" },
                  { l: "Total Messages", v: totalMsgs, cl: "green" },
                  { l: "Your Messages", v: userMsgs, cl: "amber" },
                  { l: "AI Replies", v: totalMsgs - userMsgs, cl: "blue" },
                ].map(s => (
                  <div key={s.l} className="stat-card">
                    <div className={`stat-num ${s.cl}`}>{s.v}</div>
                    <div className="stat-lbl">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="section-card">
                <h3 className="sec-title">Recent Chats</h3>
                {conversations.slice(0, 6).map(c => (
                  <div key={c.id} className="a-row">
                    <Icons.chat />
                    <span style={{ flex: 1, marginLeft: 8, fontSize: 14 }}>{c.title || "Untitled"}</span>
                    <span className="badge">{c.messages.length} msgs</span>
                  </div>
                ))}
                {conversations.length === 0 && <p className="empty-txt">No conversations yet.</p>}
              </div>
            </>
          )}

          {adminTab === "conversations" && (
            <div className="section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 className="sec-title" style={{ margin: 0 }}>All Conversations ({conversations.length})</h3>
                <button className="btn-danger sm" onClick={() => { setConversations([]); setActiveId(null); }}>Clear All</button>
              </div>
              {conversations.map(c => (
                <div key={c.id} className="conv-card">
                  <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>{c.title || "Untitled"}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{c.messages.length} messages · {new Date(c.createdAt).toLocaleString()}</div>
                  {c.messages.slice(0, 2).map(m => (
                    <div key={m.id} style={{ fontSize: 12, padding: "3px 0 3px 8px", borderLeft: `2px solid ${m.role === "user" ? "#6366f1" : "#e5e7eb"}`, color: m.role === "user" ? "#6366f1" : "#6b7280", margin: "3px 0" }}>
                      <b>{m.role === "user" ? "You" : "AI"}:</b> {m.content.slice(0, 70)}{m.content.length > 70 ? "…" : ""}
                    </div>
                  ))}
                  <button className="btn-danger sm" style={{ marginTop: 8 }}
                    onClick={() => { setConversations(prev => prev.filter(x => x.id !== c.id)); if (activeId === c.id) setActiveId(null); }}>
                    Delete
                  </button>
                </div>
              ))}
              {conversations.length === 0 && <p className="empty-txt">No conversations.</p>}
            </div>
          )}

          {adminTab === "settings" && (
            <div className="section-card">
              <h3 className="sec-title">API Settings</h3>
              <label className="lbl">Current API Key</label>
              <input className="inp" type="password" value={apiKey} readOnly style={{ background: "#f9fafb" }} />
              <button className="btn-danger" style={{ marginTop: 8 }} onClick={() => { setApiKey(""); store.set("vijai_key", ""); setView("setup"); setAdminAuthed(false); }}>
                Reset API Key
              </button>
              <h3 className="sec-title" style={{ marginTop: 24 }}>App Info</h3>
              {[["App Name", "Vijai AI"], ["Version", "1.0.0"], ["AI Model", "Gemini 2.0 Flash"], ["Admin Pass", "vijai@admin123"]].map(([k, v]) => (
                <div key={k} className="a-row"><span>{k}</span><span className="badge">{v}</span></div>
              ))}
              <h3 className="sec-title" style={{ marginTop: 24 }}>Danger Zone</h3>
              <button className="btn-danger" onClick={() => { setConversations([]); setActiveId(null); alert("Cleared!"); }}>
                Clear All Data
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── CHAT ───────────────────────────────────────────────────────────────────
  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sb-header">
          <div className="row-center" style={{ gap: 8 }}>
            <div className="logo-ring" style={{ width: 32, height: 32 }}><Icons.bot /></div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Vijai AI</span>
          </div>
          <button className="icon-btn" onClick={() => setSidebarOpen(false)}><Icons.close /></button>
        </div>
        <button className="new-chat-btn" onClick={newChat}><Icons.plus />&nbsp; New Chat</button>
        <div className="conv-list">
          {conversations.map(c => (
            <div key={c.id} className={`conv-item ${c.id === activeId ? "active" : ""}`}
              onClick={() => { setActiveId(c.id); setSidebarOpen(false); }}>
              <Icons.chat />
              <span className="conv-title">{c.title || "New Chat"}</span>
              <button className="del-btn" onClick={e => deleteConv(c.id, e)}><Icons.trash /></button>
            </div>
          ))}
          {conversations.length === 0 && <p className="empty-txt">Start a new chat!</p>}
        </div>
        <div className="sb-footer">
          <button className="footer-btn" onClick={() => { setView("admin"); setSidebarOpen(false); }}><Icons.shield />&nbsp; Admin Panel</button>
          <button className="footer-btn" onClick={() => { setApiKey(""); setView("setup"); }}><Icons.key />&nbsp; Change API Key</button>
        </div>
      </div>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Chat */}
      <div className="chat-main">
        <div className="chat-header">
          <button className="icon-btn" onClick={() => setSidebarOpen(true)}><Icons.menu /></button>
          <div className="row-center" style={{ gap: 8 }}>
            <div className="logo-ring" style={{ width: 34, height: 34 }}><Icons.bot /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Vijai AI</div>
              <div className="online-dot">● Online</div>
            </div>
          </div>
          <button className="icon-btn" onClick={() => setView("admin")}><Icons.settings /></button>
        </div>

        <div className="msg-area">
          {messages.length === 0 && (
            <div className="empty-chat">
              <div className="logo-ring big"><Icons.bot /></div>
              <h2 className="welcome-title">Hello! I'm Vijai AI</h2>
              <p className="welcome-sub">Powered by Gemini 2.0 Flash. Ask me anything!</p>
              <div className="suggestions">
                {["What can you do?", "Tell me a fun fact", "Help me write something", "Explain a topic simply"].map(s => (
                  <button key={s} className="suggestion" onClick={() => { setInput(s); inputRef.current?.focus(); }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`msg-row ${m.role === "user" ? "user" : ""}`}>
              <div className={`avatar ${m.role === "user" ? "user-av" : ""}`}>
                {m.role === "user" ? <Icons.user /> : <Icons.bot />}
              </div>
              <div className="bubble-wrap">
                <div className={`bubble ${m.role === "user" ? "user-bubble" : ""} ${m.isError ? "err-bubble" : ""}`}>
                  <p className="msg-text">{m.content}</p>
                </div>
                <button className="copy-btn" onClick={() => copyMsg(m.content, m.id)}>
                  {copied === m.id ? <><Icons.check />&nbsp;Copied!</> : <><Icons.copy />&nbsp;Copy</>}
                </button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row">
              <div className="avatar"><Icons.bot /></div>
              <div className="bubble"><TypingDots /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-box">
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={onKey} placeholder="Message Vijai AI..." rows={1} className="textarea" />
            <button className={`send-btn ${(!input.trim() || loading) ? "disabled" : ""}`}
              onClick={send} disabled={!input.trim() || loading}><Icons.send /></button>
          </div>
          <p className="disclaimer">Vijai AI may make mistakes. Please verify important info.</p>
        </div>
      </div>
    </div>
  );
}
