import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FlaskConical,
  CheckCircle2,
  FileWarning,
  UploadCloud,
  FileText,
  X,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  generatePoisonedDocuments,
  refinePoisonedDocuments,
  injectPoisonedDocuments,
} from "../api/attack.js";

function parseAttackFile(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const looksLikeHeader = /target.*query/i.test(lines[0]) && /correct/i.test(lines[0]);
  const dataLines = looksLikeHeader ? lines.slice(1) : lines;

  return dataLines
    .map((line) => {
      const delimiter = line.includes("|") ? "|" : ",";
      const parts = line.split(delimiter).map((p) => p.replace(/^"|"$/g, "").trim());
      const [targetQuery, correctAnswer, incorrectAnswer] = parts;
      return { targetQuery, correctAnswer, incorrectAnswer };
    })
    .filter((r) => r.targetQuery && r.correctAnswer && r.incorrectAnswer);
}

export default function Attack() {
  const [inputMode, setInputMode] = useState("manual"); // "manual" | "upload"

  const [targetQuery, setTargetQuery] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswer, setIncorrectAnswer] = useState("");

  const [fileName, setFileName] = useState(null);
  const [records, setRecords] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [generating, setGenerating] = useState(false);
  const [poisonedDocs, setPoisonedDocs] = useState(null); // initial-stage docs

  const [refining, setRefining] = useState(false);
  const [finalDocs, setFinalDocs] = useState(null); // refined/final-stage docs

  const [injecting, setInjecting] = useState(false);
  const [injected, setInjected] = useState(false);

  const resetDownstream = () => {
    setPoisonedDocs(null);
    setFinalDocs(null);
    setInjected(false);
  };

  const switchMode = (next) => {
    if (next === inputMode) return;
    setInputMode(next);
    resetDownstream();
  };

  const parseFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseAttackFile(String(reader.result || ""));
      setRecords(parsed);
      setFileName(file.name);
      resetDownstream();
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => parseFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    parseFile(e.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    setFileName(null);
    setRecords([]);
    resetDownstream();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const manualValid = targetQuery.trim() && correctAnswer.trim() && incorrectAnswer.trim();
  const canGenerate = inputMode === "manual" ? manualValid : records.length > 0;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!canGenerate || generating) return;

    const batch =
      inputMode === "manual" ? [{ targetQuery, correctAnswer, incorrectAnswer }] : records;

    setGenerating(true);
    resetDownstream();
    try {
      const data = await generatePoisonedDocuments(batch);
      setPoisonedDocs(data);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFinal = async () => {
    if (!poisonedDocs || refining) return;
    setRefining(true);
    setFinalDocs(null);
    setInjected(false);
    try {
      const data = await refinePoisonedDocuments(poisonedDocs);
      setFinalDocs(data);
    } finally {
      setRefining(false);
    }
  };

  const handleInject = async () => {
    const docsToInject = finalDocs || poisonedDocs;
    if (!docsToInject || injecting) return;
    setInjecting(true);
    setInjected(false);
    try {
      await injectPoisonedDocuments(docsToInject);
      setInjected(true);
    } finally {
      setInjecting(false);
    }
  };

  const isBatch = poisonedDocs && poisonedDocs.length > 1;
  const injectableDocs = finalDocs || poisonedDocs;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-[720px] px-7">
        <div className="pb-6 pt-10">
          <Link
            to="/"
            className="mb-4 flex w-fit items-center gap-1.5 text-[13px] text-ink-soft no-underline hover:text-ink"
          >
            <ArrowLeft size={13} /> Home
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Attack</h1>
          <p className="mt-1.5 text-sm text-ink-soft">RAG poisoning attack.</p>
        </div>

        {/* Input mode toggle */}
        <div className="mb-6 inline-flex rounded-md border border-border-strong bg-surface p-1">
          <button
            type="button"
            onClick={() => switchMode("manual")}
            className={`rounded-sm px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              inputMode === "manual" ? "bg-surface-raised text-ink" : "text-ink-faint hover:text-ink-soft"
            }`}
          >
            Manual Entry
          </button>
          <button
            type="button"
            onClick={() => switchMode("upload")}
            className={`rounded-sm px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              inputMode === "upload" ? "bg-surface-raised text-ink" : "text-ink-faint hover:text-ink-soft"
            }`}
          >
            Upload File
          </button>
        </div>

        <form onSubmit={handleGenerate}>
          {inputMode === "manual" ? (
            <>
              <div className="mb-5">
                <label className="mb-2 block text-[13px] font-medium text-ink" htmlFor="targetQuery">
                  Target Query
                </label>
                <input
                  id="targetQuery"
                  type="text"
                  className="w-full rounded-md border border-border-strong bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                  placeholder="Enter the target query..."
                  value={targetQuery}
                  onChange={(e) => setTargetQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
                <div className="mb-5">
                  <label
                    className="mb-2 block text-[13px] font-medium text-ink"
                    htmlFor="correctAnswer"
                  >
                    Correct Answer
                  </label>
                  <textarea
                    id="correctAnswer"
                    className="min-h-[90px] w-full resize-y rounded-md border border-border-strong bg-surface px-3.5 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                    placeholder="Enter the ground-truth answer..."
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  />
                </div>

                <div className="mb-5">
                  <label
                    className="mb-2 block text-[13px] font-medium text-ink"
                    htmlFor="incorrectAnswer"
                  >
                    Incorrect Answer
                  </label>
                  <textarea
                    id="incorrectAnswer"
                    className="min-h-[90px] w-full resize-y rounded-md border border-border-strong bg-surface px-3.5 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                    placeholder="Enter the answer the poisoned document should induce..."
                    value={incorrectAnswer}
                    onChange={(e) => setIncorrectAnswer(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mb-5">
              <label className="mb-2 block text-[13px] font-medium text-ink">
                Attack Queries{" "}
                <span className="ml-1.5 text-xs font-normal text-ink-faint">
                  .txt or .csv — each line: target query, correct answer, incorrect answer
                </span>
              </label>

              {!fileName ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-md border border-dashed px-6 py-10 text-center transition-colors ${
                    dragActive
                      ? "border-accent bg-accent/10"
                      : "border-border-strong bg-surface hover:border-accent"
                  }`}
                >
                  <UploadCloud size={22} className="text-ink-faint" />
                  <div className="text-sm text-ink-soft">
                    <span className="font-medium text-accent-ink">Click to upload</span> or drag
                    and drop
                  </div>
                  <div className="text-xs text-ink-faint">
                    Batch-generates a poisoned document pair for every row
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-md border border-border-strong bg-surface px-4 py-3.5">
                  <div className="flex items-center gap-2.5 text-sm text-ink">
                    <FileText size={16} className="text-accent-ink" />
                    <span className="font-medium">{fileName}</span>
                    <span className="text-ink-faint">· {records.length} queries loaded</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="flex h-6 w-6 items-center justify-center rounded-sm text-ink-faint hover:bg-surface-raised hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!canGenerate || generating}
            className="inline-flex items-center gap-2 rounded-md bg-danger px-5 py-3 text-sm font-medium text-[#1b120e] transition-colors hover:bg-danger/80 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-surface"
          >
            Generate Initial Poisoned Documents
            {inputMode === "upload" && records.length > 0 && ` (${records.length})`}
          </button>
        </form>

        {generating && (
          <div className="flex items-center gap-2.5 py-4 text-[13.5px] text-ink-soft">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
            Generating poisoned documents…
          </div>
        )}

        
        {poisonedDocs && (
          <div className="mt-11 border-t border-border pt-9">
            <h2 className="mb-1 text-lg font-semibold text-ink">Initial Poisoned Documents</h2>
            <p className="mb-6 text-[13.5px] text-ink-soft">
              Draft documents. Refine them before injecting into the knowledge base.
            </p>

            <DocGrid docs={poisonedDocs} isBatch={isBatch} />

            {!finalDocs && (
              <button
                type="button"
                onClick={handleGenerateFinal}
                disabled={refining}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-danger px-5 py-3 text-sm font-medium text-[#1b120e] transition-colors hover:bg-danger/80 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-surface"
              >
                <Sparkles size={14} />
                Generate Final Poisoned Documents
              </button>
            )}

            {refining && (
              <div className="mt-4 flex items-center gap-2.5 text-[13.5px] text-ink-soft">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
                Refining documents…
              </div>
            )}
          </div>
        )}

        {/* Stage 2: refined/final docs */}
        {finalDocs && (
          <div className="mt-11 border-t border-border pt-9">
            <h2 className="mb-1 text-lg font-semibold text-ink">Final Poisoned Documents</h2>
            <p className="mb-6 text-[13.5px] text-ink-soft">
              Refined versions, ready for injection into the vector database.
            </p>

            <DocGrid2 docs={finalDocs} isBatch={isBatch} />

            {!injected && (
              <button
                type="button"
                onClick={handleInject}
                disabled={injecting}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-danger px-5 py-3 text-sm font-medium text-[#1b120e] transition-colors hover:bg-danger/80 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-surface"
              >
                {isBatch ? `Inject All (${finalDocs.length})` : "Inject"}
              </button>
            )}

            {injecting && (
              <div className="mt-4 flex items-center gap-2.5 text-[13.5px] text-ink-soft">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
                Injecting into knowledge base…
              </div>
            )}
          </div>
        )}

        {/* Stage 3: injected */}
        {injected && injectableDocs && (
          <div className="mt-11 border-t border-border pt-9">
            <div className="mt-5 mb-5 flex items-center gap-2.5 rounded-md border border-danger/30 bg-danger/10 px-4 py-3.5 text-[13.5px] font-medium text-danger">
              <CheckCircle2 size={15} />
              Injection Complete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DocGrid({ docs, isBatch, injected = false }) {
  return (
    <div className="flex flex-col gap-6">
      {docs.map((doc, i) => (
        <div key={i}>
          {isBatch && (
            <div className="mb-2.5 truncate text-[12.5px] font-medium text-ink-soft">
              Query {i + 1}: <span className="text-ink">{doc.targetQuery}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 max-[860px]:grid-cols-1">
            {[doc.a1, doc.a2].map((d) => (
              <div key={d.id} className="rounded-md border border-danger/30 bg-danger/10 p-4">
                <div className="mb-2 flex items-center justify-between gap-2 text-[13px] font-semibold text-danger">
                  <span className="flex items-center gap-1.5">
                    <FileWarning size={14} />
                    {d.title}
                  </span>
                  {injected && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-success">
                      <CheckCircle2 size={12} /> Injected
                    </span>
                  )}
                </div>
                <p className="text-[13px] leading-relaxed text-ink-soft">{d.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DocGrid2({ docs, isBatch }) {
  return (
    <div className="flex flex-col gap-6">
      {docs.results.map((doc, i) => (
        <div key={i}>
          {isBatch && (
            <div className="mb-2.5 truncate text-[12.5px] font-medium text-ink-soft">
              Query {i + 1}:{" "}
              <span className="text-ink">{doc.targetQuery}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div
              key={doc.document.id}
              className="rounded-md border border-danger/30 bg-danger/10 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-2 text-[13px] font-semibold text-danger">
                <span className="flex items-center gap-1.5">
                  <FileWarning size={14} />
                  {doc.document.title}
                </span>
              </div>

              <p className="text-[13px] leading-relaxed text-ink-soft">
                {doc.document.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}