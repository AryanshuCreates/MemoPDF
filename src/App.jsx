import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  Button,
  Container,
  Typography,
  Paper,
  Box,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfContainer = styled(Paper)(({ theme }) => ({
  margin: "2rem auto",
  padding: "1rem",
  maxWidth: "90vw",
  background: theme.palette.background.paper,
  textAlign: "center",
}));

function App() {
  const [pdf, setPdf] = useState(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const canvasRef = useRef(null);
  const [filePath, setFilePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);

  // Open dialog and load selected PDF
  async function handleOpenFile() {
    const filePath = await window.electronAPI.openFile();
    if (!filePath) return;

    setLoading(true);
    setFilePath(filePath);
    setFileName(filePath.split(/[\\/]/).pop());

    const url = `file://${filePath}`;
    const savedPages = await window.electronAPI.loadPages();
    const lastPage = savedPages[filePath] || 1;

    const doc = await pdfjsLib.getDocument(url).promise;
    setNumPages(doc.numPages);
    setPage(lastPage);

    setPdf(doc); // <-- set pdf LAST so useEffect doesn't fire with old file/pdf combo
    setLoading(false);
  }

  // Render page and save every change
  useEffect(() => {
    if (!pdf || !filePath || !page) return;

    let isMounted = true;
    async function renderPage() {
      setLoading(true);
      const pg = await pdf.getPage(page);
      const viewport = pg.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await pg.render({ canvasContext: ctx, viewport }).promise;

      window.electronAPI.savePage(filePath, page);

      if (isMounted) setLoading(false);
    }
    renderPage();
    return () => {
      isMounted = false;
    };
  }, [page, pdf, filePath]);

  const nextPage = () => page < numPages && setPage((p) => p + 1);
  const prevPage = () => page > 1 && setPage((p) => p - 1);

  return (
    <Container
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ textAlign: "center" }}>
        📖 PDF Reader
      </Typography>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpenFile}>
          Open PDF
        </Button>
      </Box>
      <PdfContainer
        elevation={4}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {loading && <LinearProgress sx={{ mb: 2, width: "80%" }} />}
        {fileName && (
          <Typography fontWeight="bold" mb={1}>
            {fileName}
          </Typography>
        )}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={2}
          width="100%"
        >
          <Button
            onClick={prevPage}
            variant="outlined"
            disabled={page === 1 || !pdf}
            sx={{ mr: 1 }}
          >
            ⬅ Prev
          </Button>
          <Typography variant="body1" sx={{ minWidth: 140, mx: 1 }}>
            {pdf ? `Page ${page} of ${numPages}` : "No PDF loaded"}
          </Typography>
          <Button
            onClick={nextPage}
            variant="outlined"
            disabled={page === numPages || !pdf}
            sx={{ ml: 1 }}
          >
            Next ➡
          </Button>
        </Box>
        <Box
          sx={{
            overflowX: "auto",
            maxWidth: "90vw",
            maxHeight: "70vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              border: "1px solid #bbb",
              background: "#eee",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Box>
      </PdfContainer>
    </Container>
  );
}

export default App;
