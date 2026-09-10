import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { MODES } from "../data/modes.js";
import { sendMessage } from "../api/chat.js";
import SourcesPanel from "../components/SourcesPanel.jsx";

export default function Chatbot() {
  const [mode, setMode] = useState("normal");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { id: `u${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(text, mode);
      setMessages((prev) => [...prev, response]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex h-screen max-w-[720px] flex-col px-7">
        <div className="flex items-center justify-between gap-3 py-4">
          <Link to="/" className="flex items-center gap-1.5 text-[13px] text-ink-soft no-underline hover:text-ink">
            <ArrowLeft size={13} /> Home
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[12.5px] text-ink-faint">Defense</span>
            <select
              className="appearance-none rounded-sm border border-border-strong bg-surface bg-[length:10px_6px] bg-[right_11px_center] bg-no-repeat py-1.5 pl-3 pr-7 text-[13.5px] text-ink focus:border-accent focus:outline-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23a6a299' stroke-width='1.4' fill='none' fill-rule='evenodd'/></svg>\")",
              }}
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id} disabled={m.status !== "available"}>
                  {m.name}
                  {m.status !== "available" ? " (Coming Soon)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div ref={logRef} className="flex flex-1 flex-col gap-6 overflow-y-auto py-3">
          {messages.length === 0 && !loading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-ink-faint">
              <span className="text-xl font-semibold text-ink-soft">Hii 👋</span>
              <span>Ask a question to query the knowledge base.</span>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full flex-col gap-1.5 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[75%] rounded-lg border border-border bg-surface-raised px-4 py-2.5 text-[15px] leading-relaxed text-ink"
                    : "max-w-full text-[15px] leading-relaxed text-ink"
                }
              >
                {message.content}
              </div>
              {message.role === "assistant" && <SourcesPanel sources={message.sources} />}
            </div>
          ))}

          {loading && (
            <div className="flex w-full flex-col items-start gap-1.5">
              <div className="flex w-fit gap-1.5 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        <div className="py-2.5 pb-6">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2.5 rounded-full border border-border-strong bg-surface py-1.5 pl-5 pr-1.5 shadow-lg shadow-black/30 focus-within:border-accent"
          >
            <input
              type="text"
              className="flex-1 border-none bg-transparent py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
              placeholder="Ask your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ink text-bg transition-colors hover:bg-accent-ink disabled:cursor-not-allowed disabled:bg-disabled disabled:text-surface disabled:opacity-50"
            >
              <ArrowUp size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
