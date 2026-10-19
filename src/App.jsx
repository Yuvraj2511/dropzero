import { useEffect, useRef, useState } from "react";
import "./App.css";

function DropZeroLogo() {
  return (
    <svg className="dz-logo" viewBox="0 0 44 44" fill="none" role="img" aria-label="DropZero logo">
      <path d="M22 3.5 39 13.2V30.8L22 40.5 5 30.8V13.2L22 3.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 13H27.5C33 13 33 22 27.5 22H14V31" stroke="#E96738" strokeWidth="4" strokeLinecap="square" />
      <path d="M14 22H26" stroke="#C84D25" strokeWidth="4" strokeLinecap="square" />
      <circle cx="31.5" cy="30.5" r="3" fill="#E96738" />
    </svg>
  );
}

const slides = [
  { number: "01", category: "THE DROP", title: "One file. Zero friction.", description: "Drag in a file, choose its lifespan, and get a link ready to share.", visual: "drop-visual", symbol: "↗" },
  { number: "02", category: "THE CONTROL", title: "Time is yours.", description: "Set an expiry window and decide how many downloads are allowed.", visual: "time-visual", symbol: "◷" },
  { number: "03", category: "THE EXIT", title: "Gone means gone.", description: "Expired links should stop granting access, and scheduled cleanup can remove stored files.", visual: "exit-visual", symbol: "↘" }
];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function getFileKind(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (file.type.startsWith("image/")) return { label: "IMAGE", symbol: "▧" };
  if (ext === "pdf") return { label: "PDF DOCUMENT", symbol: "PDF" };
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return { label: "ARCHIVE", symbol: "ZIP" };
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) return { label: "VIDEO", symbol: "▶" };
  if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext)) return { label: "AUDIO", symbol: "♫" };
  if (["doc", "docx", "txt", "rtf", "odt"].includes(ext)) return { label: "DOCUMENT", symbol: "DOC" };
  if (["xls", "xlsx", "csv"].includes(ext)) return { label: "SPREADSHEET", symbol: "XLS" };
  if (["ppt", "pptx"].includes(ext)) return { label: "PRESENTATION", symbol: "PPT" };

  return { label: "FILE", symbol: "↗" };
}

function formatCountdown(expiresAt, now) {
  const remaining = expiresAt - now;

  if (remaining <= 0) return "Expired";

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
function SharePage() {
  const id = window.location.pathname.split("/").filter(Boolean).pop();
  const [transfer, setTransfer] = useState(null);
  const [status, setStatus] = useState("loading");
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  
const downloadFile = async () => {
  try {
    const res = await fetch(
      `https://dropzero-backend.0yuvraj456.workers.dev/api/transfers/${encodeURIComponent(id)}?download=1`
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Download failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = transfer.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    const updated = await fetch(
      `https://dropzero-backend.0yuvraj456.workers.dev/api/transfers/${encodeURIComponent(id)}`
    );

    if (updated.ok) {
      const data = await updated.json();
      setTransfer(data.transfer);
      if (data.transfer.downloads >= data.transfer.maxDownloads) {
        setStatus("limit");
      }
    }
  } catch (err) {
    alert(err.message || "Could not download this file.");
  }
};

  
  useEffect(() => {
  const timer = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(timer);
}, []);
useEffect(() => {
  if (transfer && transfer.expiresAt <= now) {
    setStatus("expired");
  }
}, [now, transfer]);
useEffect(() => {
    let cancelled = false;

    fetch(`https://dropzero-backend.0yuvraj456.workers.dev/api/transfers/${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Transfer unavailable");
        return data.transfer;
      })
      .then((data) => {
        if (cancelled) return;
        setTransfer(data);

if (data.expiresAt <= Date.now()) {
  setStatus("expired");
} else if (data.downloads >= data.maxDownloads) {
  setStatus("limit");
} else {
  setStatus("ready");
}
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });
      
const downloadFile = async () => {
  try {
    const res = await fetch(
      `https://dropzero-backend.0yuvraj456.workers.dev/api/transfers/${encodeURIComponent(id)}?download=1`
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Download failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = transfer.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    const updated = await fetch(
      `https://dropzero-backend.0yuvraj456.workers.dev/api/transfers/${encodeURIComponent(id)}`
    );

    if (updated.ok) {
      const data = await updated.json();
      setTransfer(data.transfer);
      if (data.transfer.downloads >= data.transfer.maxDownloads) {
        setStatus("limit");
      }
    }
  } catch (err) {
    alert(err.message || "Could not download this file.");
  }
};


    return () => {
      cancelled = true;
    };
  }, [id]);
const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    window.prompt("Copy this share link:", window.location.href);
  }
};
  const expiry = transfer
    ? new Date(transfer.expiresAt).toLocaleString()
    : "";

  return (
    <main className="share-page">
      <a className="share-brand" href="/">
        <span className="share-brand-mark">D</span>
        dropzero<span>.</span>
      </a>

      <section className="share-card">
        <div className="share-icon">↘</div>

        {status === "loading" && (
          <>
            <p className="share-kicker">DROPZERO TRANSFER</p>
            <h1>Finding your file<span>.</span></h1>
            <p className="share-description">Checking the transfer details...</p>
          </>
        )}

        {status === "ready" && transfer && (
          <>
            <div className="share-status-row">
  <p className="share-kicker">A FILE WAS SHARED WITH YOU</p>
  <span className={`transfer-status status-${status}`}>
    {status === "ready" ? "ACTIVE" : status.toUpperCase()}
  </span>
</div>
            <h1>Your file is waiting<span>.</span></h1>
            <div className="shared-file">
              <div className="shared-file-icon">↗</div>
              <div className="shared-file-info">
                <strong>{transfer.fileName}</strong>
                <span>{formatSize(transfer.fileSize)}</span>
              </div>
            </div>

            <div className="share-details">
              <div>
  <span>EXPIRES</span>
  <strong>{formatCountdown(transfer.expiresAt, now)}</strong>
  <small className="share-expiry-date">{expiry}</small>
</div>
              <div>
                <span>DOWNLOADS</span>
                <strong>
                  {transfer.downloads} / {transfer.maxDownloads} used
                </strong>
              </div>
            </div>

            <button
  className="share-download-button"
  onClick={downloadFile}
  disabled={status !== "ready"}
>
  DOWNLOAD FILE <span>↗</span>
</button>
            <button className="share-copy-button" onClick={copyShareLink}>
  {copied ? "LINK COPIED ✓" : "COPY SHARE LINK"}
  <span>{copied ? "✓" : "↗"}</span>
</button>
            
          </>
        )}

        {status === "expired" && (
          <>
            <div className="share-status-row">
  <p className="share-kicker">TRANSFER EXPIRED</p>
  <span className="transfer-status status-expired">EXPIRED</span>
</div>
            <h1>Its time is up<span>.</span></h1>
            <p className="share-description">
              This transfer has expired and is no longer available.
            </p>
          </>
        )}
        
{status === "limit" && (
  <>
    <div className="share-status-row">
      <p className="share-kicker">TRANSFER COMPLETE</p>
      <span className="transfer-status status-expired">
        LIMIT REACHED
      </span>
    </div>
    <h1>All downloads used<span>.</span></h1>
    <p className="share-description">
      This transfer has reached its download limit. Ask the sender
      to create a new share link if you still need the file.
    </p>
  </>
)}

        
{status === "unavailable" && (
  <>
    <div className="share-status-row">
      <p className="share-kicker">TRANSFER UNAVAILABLE</p>
      <span className="transfer-status status-unavailable">
        UNAVAILABLE
      </span>
    </div>
    <h1>This link isn't available<span>.</span></h1>
    <p className="share-description">
      This transfer could not be found. It may have been revoked,
      expired, or the backend may be temporarily unavailable.
      Check the link or ask the sender for a new one.
    </p>
  </>
)}


        <a className="share-home-link" href="/">
          ← Back to DropZero
        </a>
      </section>

      <p className="share-footer">LESS CLUTTER. MORE CONTROL.</p>
    </main>
  );
}
const MAX_FILE_SIZE = 10 * 1024 * 1024;
export default function App() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState("24 hours");
  const [limit, setLimit] = useState("5");
  const [dragging, setDragging] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  useEffect(() => {
  if (!file || !file.type.startsWith("image/")) {
    setPreviewUrl("");
    return;
  }

  const url = URL.createObjectURL(file);
  setPreviewUrl(url);

  return () => URL.revokeObjectURL(url);
}, [file]);
  
  
const chooseFile = (selected) => {
  if (!selected) return;

  setError("");
  setShowSuccess(false);
  setLink("");
  setCopied(false);

  if (selected.size === 0) {
    setError("This file is empty. Please choose another file.");
    return;
  }

  if (selected.size > MAX_FILE_SIZE) {
    setError("This file is too large. Choose a file smaller than 10 MB.");
    return;
  }

  setFile(selected);
};


  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };
  if (window.location.pathname.startsWith("/share/")) {
  return <SharePage />;
}

  

const createDemoLink = async () => {
  setShowSuccess(false);
  if (!file || loading) return;

  setLoading(true);
  setError("");
  setLink("");

  const expiryHours = {
    "1 hour": 1,
    "6 hours": 6,
    "24 hours": 24,
    "3 days": 72,
    "7 days": 168
  }[expiry];

  try {
    const params = new URLSearchParams({
      fileName: file.name,
      maxDownloads: String(Number(limit)),
      expiryHours: String(expiryHours)
    });

    const res = await fetch(
      `https://dropzero-backend.0yuvraj456.workers.dev/api/transfers/upload?${params}`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream"
        },
        body: file
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Could not upload file");
    }

    setLink(`${window.location.origin}/share/${data.transfer.id}`);
    setCopied(false);
    setShowSuccess(true);
  } catch (err) {
    setError(err.message || "Could not connect to the backend.");
  } finally {
    setLoading(false);
  }
};



  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      window.prompt("Copy your demo link:", link);
    }
  };

  const reset = () => {
    setShowSuccess(false);
    setFile(null);
    setLink("");
    setCopied(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <main className="app-shell">
      <nav className="navbar">
        <a className="brand" href="#" aria-label="DropZero home">
          <DropZeroLogo />
          <span>dropzero<span className="brand-dot">.</span></span>
        </a>
        <div className="nav-center"><span className="status-dot" />FILE SHARING, REIMAGINED</div>
        <a className="nav-link" href="#how-it-works">How it works <span>↗</span></a>
      </nav>

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-icon">✳</span> YOUR FILE. YOUR RULES. <span className="eyebrow-line" /></div>
            <h1>Share files.<br /><span className="headline-second">Leave <span className="chrome-text">no trace.</span></span></h1>
            <p className="hero-description">Drop it. Share it. Forget it.<br />Temporary file sharing, with an expiration date.</p>
            <div className="hero-proof"><span className="status-dot" /> TEMPORARY BY DESIGN <span className="proof-divider" /> NO ACCOUNT NEEDED</div>
          </div>

          <div className="hero-art">
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            <div className="transfer-visual" aria-label="Illustration of temporary file sharing">
          <div className="transfer-top-label"><span className="transfer-live-dot" />FILE IN MOTION</div>
          <svg className="transfer-path" viewBox="0 0 520 240" fill="none" aria-hidden="true">
            <path d="M92 155 C105 35 222 22 260 115 S420 205 433 85" stroke="#F2D7CA" strokeWidth="2" strokeDasharray="5 7" />
            <path d="M421 94 L433 80 L445 94" stroke="#E96738" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="92" cy="155" r="5" fill="#E96738" /><circle cx="260" cy="115" r="5" fill="#E96738" /><circle cx="433" cy="85" r="5" fill="#E96738" />
          </svg>
          <div className="transfer-card transfer-card-main">
            <div className="transfer-card-top"><span className="transfer-file-icon">↗</span><span className="transfer-menu">•••</span></div>
            <div className="transfer-file-name">your-file.zip</div>
            <div className="transfer-file-meta">24.8 MB · ZIP ARCHIVE</div>
            <div className="transfer-progress"><span /></div>
            <div className="transfer-card-bottom"><span>READY TO SHARE</span><span className="transfer-check">✓</span></div>
          </div>
          <div className="transfer-card transfer-card-receiver">
            <div className="receiver-avatar">↙</div>
            <div className="receiver-copy"><strong>File received</strong><span>Secure transfer</span></div>
            <span className="receiver-check">✓</span>
          </div>
          <div className="transfer-expiry"><span className="expiry-symbol">◷</span><div><strong>24 hours</strong><span>THEN IT EXPIRES</span></div></div>
              <div className="transfer-caption"><span>01</span> DROP <i /><span>02</span> SHARE <i /><span>03</span> EXPIRE</div>
            </div>
            <div className="art-note"><span className="art-note-mark">↗</span><span>ONE LINK.<br />A SHORT LIFETIME.</span></div>
          </div>
        </div>

        <div className="upload-card">
          <div className="card-topline">
            <div className="card-heading"><span className="live-dot" /><span>NEW TRANSFER</span></div>
            <span className="card-index">DZ — 001</span>
          </div>
          <input ref={inputRef} className="visually-hidden" type="file" onChange={(event) => chooseFile(event.target.files?.[0])} />
          <div
            className={`drop-zone ${dragging ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files?.[0]); }}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}
            role="button" tabIndex={0} aria-label="Choose a file or drop a file here"
          >
            {file ? <>
              
<div className={`file-preview ${previewUrl ? "image-preview" : ""}`}>
  {previewUrl ? (
    <img src={previewUrl} alt={`Preview of ${file.name}`} />
  ) : (
    <span>{getFileKind(file).symbol}</span>
  )}
</div>

<div className="file-name">{file.name}</div>
<div className="file-size">{formatSize(file.size)}</div>
<span className="file-type-badge">{getFileKind(file).label}</span>
<span className="change-file">CLICK TO CHANGE FILE</span>

            </> : <>
              <div className="upload-symbol"><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 32V9m0 0L15 18m9-9 9 9" /><path d="M11 28v9a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4v-9" /></svg></div>
              <div className="drop-title">Drop something <span>beautiful.</span></div>
              <div className="drop-subtitle">or <span className="browse-link">browse files</span> from your device</div>
              <div className="file-types"><span>MAX 10 MB</span><i /><span>LOCAL PREVIEW</span></div>
            </>}
          </div>

          <div className="options-row">
            <label className="option-field"><span className="field-label">EXPIRES AFTER</span><span className="select-wrap">
              <select value={expiry} onChange={(event) => setExpiry(event.target.value)}><option>1 hour</option><option>6 hours</option><option>24 hours</option><option>3 days</option><option>7 days</option></select><span className="select-arrow">⌄</span>
            </span></label>
            <label className="option-field"><span className="field-label">DOWNLOAD LIMIT</span><span className="select-wrap">
              <select value={limit} onChange={(event) => setLimit(event.target.value)}><option value="1">1 download</option><option value="5">5 downloads</option><option value="10">10 downloads</option><option value="25">25 downloads</option></select><span className="select-arrow">⌄</span>
            </span></label>
          </div>

          <button className="create-button" disabled={!file || loading} onClick={createDemoLink}>
            <span>
  {loading ? "PREPARING TRANSFER..." : link ? "TRANSFER CREATED" : "CREATE SHARE LINK"}
</span>
<span className={`button-arrow ${loading ? "is-loading" : ""}`}>
  {loading ? "◌" : link ? "✓" : "↗"}
</span>
            </button>
            {loading && (
  <div className="transfer-loading" role="status" aria-live="polite">
    <span className="loading-spinner" />
    <div>
      <strong>Preparing your transfer</strong>
      <span>Validating your file and creating your share link...</span>
    </div>
  </div>
)}
          {error && <p role="alert" className="error-message">{error}</p>}
          {link && <div className="link-result">
            
<div
  className={`success-banner ${showSuccess ? "success-enter" : ""}`}
  role="status"
  aria-live="polite"
>
  <span className="success-check">
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" />
      <path d="m9 16 5 5 9-10" />
    </svg>
  </span>

  <span className="success-copy">
    <strong>Link created successfully!</strong>
    <span>Your transfer is ready to share.</span>
  </span>

  <span className="success-spark" aria-hidden="true">✳</span>
</div>

            <span className="link-caption">SECURE TRANSFER · {expiry.toUpperCase()} · {limit} DOWNLOADS</span>
            <div className="link-row"><span className="link-value">{link}</span><button className="copy-button" onClick={copyLink}>{copied ? "COPIED ✓" : "COPY"}</button></div>
            <p>Your file is uploaded. Share this link while it remains active.</p>
            <button className="reset-button" onClick={reset}>Remove file and start again</button>
          </div>}
          <div className="card-footer"><span><span className="shield-icon">◇</span> PRIVATE BY DESIGN</span><span>NO ACCOUNT NEEDED</span></div>
        </div>
        <div className="below-note"><span className="note-star">✳</span> YOUR FILES DON'T LIVE HERE FOREVER.</div>
      </section>

      <section className="showcase" aria-label="DropZero features">
        <div className="showcase-heading">
          <div><div className="section-kicker">A SMALL THING, DONE DIFFERENTLY</div><h2>Less baggage.<br /><span>More freedom.</span></h2></div>
          <div className="carousel-controls">
            <button onClick={() => moveSlide(-1)} aria-label="Previous slide">←</button><span>0{activeSlide + 1} <i>/</i> 0{slides.length}</span><button onClick={() => moveSlide(1)} aria-label="Next slide">→</button>
          </div>
        </div>
        <div className="carousel-window"><div className="carousel-track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
          {slides.map((slide) => <article className="showcase-slide" key={slide.number}>
            <div className={`slide-art ${slide.visual}`}><span className="slide-index">{slide.number} / 03</span><div className="slide-object">{slide.symbol}</div><span className="slide-orbit orbit-left" /><span className="slide-orbit orbit-right" /><span className="slide-category">{slide.category}</span></div>
            <div className="slide-copy"><span className="slide-kicker">DROPZERO / FIELD NOTES</span><h3>{slide.title}</h3><p>{slide.description}</p></div>
          </article>)}
        </div></div>
        <div className="carousel-progress">{slides.map((slide, index) => <button key={slide.number} className={activeSlide === index ? "progress-active" : ""} onClick={() => setActiveSlide(index)} aria-label={`Go to slide ${index + 1}`} aria-current={activeSlide === index ? "true" : undefined} />)}</div>
      </section>

      <section className="features" id="how-it-works">
        <div className="section-kicker">THE ART OF LETTING GO</div>
        <div className="feature-grid">
          <article className="feature"><span className="feature-number">01</span><div className="feature-icon">↗</div><h2>Drop anything.</h2><p>Choose a file from your device. No complicated setup, no unnecessary steps.</p></article>
          <article className="feature"><span className="feature-number">02</span><div className="feature-icon">⌁</div><h2>Set the rules.</h2><p>Choose when your share link expires and how many downloads it allows.</p></article>
          <article className="feature"><span className="feature-number">03</span><div className="feature-icon">✳</div><h2>Let it vanish.</h2><p>The cloud backend will enforce expiry rules and clean up expired files.</p></article>
        </div>
      </section>

      <footer className="footer"><a className="brand footer-brand" href="#" aria-label="DropZero home"><DropZeroLogo /><span>dropzero<span className="brand-dot">.</span></span></a><span>LESS CLUTTER. MORE CONTROL.</span><span>BUILT FOR THE MOMENT.</span></footer>
    </main>
  );
}
