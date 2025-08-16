# PDF Reader with Page Memory - Electron + React + MUI

[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material UI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![pdf.js](https://img.shields.io/badge/pdf.js-414141?style=for-the-badge&logo=mozilla&logoColor=white)](https://mozilla.github.io/pdf.js/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A lightweight cross-platform PDF reader built with Electron and React that remembers the last page you read for each PDF file. This app lets you open PDFs natively on your system, smoothly navigate pages, and automatically resumes at the page where you left off — even if you open multiple files!

---

## Features

- **Open PDF files** via native system dialog (Electron's dialog API).
- **Render PDFs** using `pdfjs-dist`.
- **Remember last-read page per file** and resume exactly where you left off.
- Modern, responsive UI built with **React** and **Material-UI (MUI)**.
- Works on Windows, macOS, and Linux via **Electron**.
- Auto-saves reading progress locally in a JSON file.
- Keyboard and button controls for page navigation.

---

## Installation

Make sure you have Node.js (v16+) and npm installed.
git clone https://github.com/yourusername/pdf-reader.git
cd pdf-reader
npm install

---

## Running the App

Start the Electron app with React frontend:
npm run start

This will launch the Electron window. Use the **Open PDF** button to select PDF files. Your reading position per file will be saved automatically.

---

## Building for Production

To build your app and create executables:
npm run build

_(Make sure your `package.json` contains appropriate build scripts and configuration for electron-builder or similar.)_

---

## How It Works

- The Electron main process handles IPC messaging and shows native open file dialogs.
- The React app renders PDFs using `pdfjs-dist` on a `<canvas>`.
- The last page read for each PDF is saved using a local JSON file via the main process.
- State synchronization ensures that opening any previously opened file takes you back to the last page you read.

---

## Dependencies

- **Electron** - Desktop app shell
- **React** - Frontend UI
- **MUI (Material-UI)** - UI components and styling
- **pdfjs-dist** - PDF parsing and rendering
- **Vite** - Fast frontend build tool

---

## Notes

- The app **must run inside Electron** for file system access and native dialogs.
- PDF files are referenced by their absolute paths to uniquely track last-read pages.
- Deleting the storage JSON resets saved pages.

---

## Contributing

Contributions welcome! Feel free to open issues or submit pull requests for enhancements or bug fixes.

---

## License

MIT License © Aryanshu Aman

---

Enjoy your seamless PDF reading experience with automatic page remembering!
