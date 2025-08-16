import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

// ✅ Correct worker import for Vite
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [pdf, setPdf] = useState(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const canvasRef = useRef(null);
  const [filePath, setFilePath] = useState(null);
  const [savedPages, setSavedPages] = useState({});

  useEffect(() => {
    window.electronAPI.loadPages().then(setSavedPages);
  }, []);

  async function openPdf(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    const doc = await pdfjsLib.getDocument(url).promise;
    setPdf(doc);
    setNumPages(doc.numPages);

    setFilePath(file.name);
    const lastPage = savedPages[file.name] || 1;
    setPage(lastPage);
    renderPage(doc, lastPage);
  }

  async function renderPage(doc, pageNum) {
    const pg = await doc.getPage(pageNum);
    const viewport = pg.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await pg.render({ canvasContext: ctx, viewport }).promise;
    window.electronAPI.savePage(filePath, pageNum);
  }

  function nextPage() {
    if (page < numPages) {
      const next = page + 1;
      setPage(next);
      renderPage(pdf, next);
    }
  }

  function prevPage() {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      renderPage(pdf, prev);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>📖 PDF Reader</h1>
      <input type="file" accept="application/pdf" onChange={openPdf} />
      <div>
        <button onClick={prevPage}>⬅ Prev</button>
        <span>
          {" "}
          Page {page} / {numPages}{" "}
        </span>
        <button onClick={nextPage}>Next ➡</button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid gray", marginTop: 10 }}
      />
    </div>
  );
}

export default App;
