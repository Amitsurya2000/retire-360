"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User as UserIcon, RefreshCw, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Explain my plan in simple words.",
  "मेरा प्लान हिंदी में समझाओ।",
  "Can I afford a foreign trip in 5 years?",
  "Should I move money from FDs to debt mutual funds?",
  "How do I claim the ₹50,000 Section 80TTB deduction?",
  "What if I want to retire 2 years earlier?",
];

const STORAGE_KEY_PREFIX = "retirewell.chat.";

interface Props {
  profileId: string;
  userName?: string | null;
}

export function AdvisorChat({ profileId, userName }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}${profileId}`;

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Corrupted storage — ignore and start fresh
    }
    setLoaded(true);
  }, [storageKey]);

  // Persist chat history to localStorage whenever it changes
  useEffect(() => {
    if (!loaded) return;
    try {
      if (messages.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // Quota or unavailable — fail silently
    }
  }, [messages, storageKey, loaded]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    setError(null);
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        const errText = await res.text();
        let friendlyMessage = errText;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error) friendlyMessage = parsed.error;
        } catch {
          // not JSON, use raw text
        }
        throw new Error(friendlyMessage || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1)); // drop the empty assistant placeholder
    } finally {
      setStreaming(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  // Show a one-time WhatsApp nudge after every 4 assistant messages.
  const assistantCount = messages.filter((m) => m.role === "assistant").length;
  const showWhatsappNudge = !streaming && assistantCount > 0 && assistantCount % 4 === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px]">
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {messages.length === 0 && loaded && (
          <div className="text-center py-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light text-primary mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {userName ? `Hello ${userName.split(" ")[0]} 👋` : "Hello 👋"}
            </h2>
            <p className="text-slate-600 mb-2 max-w-md mx-auto">
              I&apos;ve studied your plan. Ask me anything about your retirement income, taxes, or life choices.
            </p>
            <p className="text-xs text-slate-500 mb-8">
              Write in English, Hindi, Tamil, Telugu — I&apos;ll reply in the same language.
            </p>
            <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-3">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left card hover:border-primary hover:shadow-md transition-all text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role}
            content={m.content}
            streaming={streaming && i === messages.length - 1 && m.role === "assistant" && !m.content}
          />
        ))}

        {showWhatsappNudge && (
          <div className="flex gap-3 animate-fade-in">
            <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <a
              href={whatsappLink("I've been chatting with the Retire 360 advisor and would like to talk to a wealth manager.")}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[80%] bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100 rounded-2xl px-5 py-3 transition-colors group"
            >
              <p className="font-semibold text-emerald-900 text-sm">Want a human to walk you through this?</p>
              <p className="text-emerald-700 text-xs mt-1">
                Free 15-min WhatsApp call with our Retiree Wealth Manager →
              </p>
            </a>
          </div>
        )}

        {error && (
          (() => {
            const isApiKeyIssue = error.toUpperCase().includes("GEMINI_API_KEY");
            return (
              <div className={`rounded-xl p-5 text-sm border ${
                isApiKeyIssue
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                {isApiKeyIssue ? (
                  <>
                    <p className="font-bold mb-2">📋 One quick setup step needed (takes 30 seconds)</p>
                    <p className="mb-3">The AI advisor needs a free Google Gemini API key. No credit card required.</p>
                    <ol className="list-decimal list-inside space-y-1 mb-3">
                      <li>Go to <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="underline font-medium">aistudio.google.com/apikey</a> and sign in with Google</li>
                      <li>Click &quot;Create API key&quot; → copy the key (starts with <code className="bg-amber-100 px-1.5 py-0.5 rounded">AIza...</code>)</li>
                      <li>Open the <code className="bg-amber-100 px-1.5 py-0.5 rounded">.env</code> file in your retirewell folder</li>
                      <li>Add: <code className="bg-amber-100 px-1.5 py-0.5 rounded">GEMINI_API_KEY=&quot;AIza...&quot;</code></li>
                      <li>Restart the dev server (Ctrl+C, then <code className="bg-amber-100 px-1.5 py-0.5 rounded">npm run dev</code>)</li>
                    </ol>
                    <p className="text-xs text-amber-700">Free tier: ~1,500 messages/day on Gemini 2.5 Flash. More than enough for personal use.</p>
                  </>
                ) : (
                  <>{error}</>
                )}
              </div>
            );
          })()
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-slate-200 pt-4 bg-slate-50 sticky bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask in any language — English, हिंदी, தமிழ்…"
            className="input-field flex-1"
            disabled={streaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="btn-secondary inline-flex items-center gap-2"
              title="Start a new conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </form>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Educational guidance, not investment advice. For specific decisions, talk to our Wealth Manager.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ role, content, streaming }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-fade-in`}>
      <div
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser ? "bg-slate-200 text-slate-700" : "bg-primary text-white"
        }`}
      >
        {isUser ? <UserIcon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </div>
      <div className={`${isUser ? "max-w-[80%] items-end" : "max-w-[90%] items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-5 py-3 overflow-x-auto ${
            isUser ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          {streaming && !content ? (
            <span className="inline-flex gap-1 items-center">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          ) : isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{content}</div>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none
              prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-4 prose-headings:mb-2
              prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
              prose-p:my-2 prose-p:leading-relaxed
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-ul:my-2 prose-ol:my-2
              prose-li:my-0.5
              prose-table:my-3 prose-table:border-collapse prose-table:w-full prose-table:text-sm
              prose-th:bg-slate-100 prose-th:text-slate-700 prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:border prose-th:border-slate-300
              prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-slate-200
              prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-hr:my-4 prose-hr:border-slate-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
