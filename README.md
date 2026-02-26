# Quest 2 - Merge PDFs

Merge two PDF files into a single document using NodeJS and `pdf-lib`.

## Requirements

- Node.js v16+
- npm

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Place your PDF files in the /pdfs folder
#    - pdfs/fileA.pdf  (e.g., 10-page PDF)
#    - pdfs/fileB.pdf  (e.g., 3-page PDF)

# 3. Run the script
npm start
```

## Usage

### Default (uses pdfs/fileA.pdf + pdfs/fileB.pdf)
```bash
node src/index.js
```

### Custom paths
```bash
node src/index.js --pdfA=./pdfs/fileA.pdf --pdfB=./pdfs/fileB.pdf --output=./output/merged.pdf
```

## Output

The merged PDF will be saved to `./output/merged.pdf`.

```
📄 Starting PDF Merge Process...
   PDF A: ./pdfs/fileA.pdf
   PDF B: ./pdfs/fileB.pdf
   Output: ./output/merged.pdf

✅ PDF A loaded: 10 pages
✅ PDF B loaded: 3 pages

🎉 Merge Complete!
   Total Pages: 13 (10 + 3)
   Output File: ./output/merged.pdf
   File Size: 245.32 KB
   ⏱  Time Elapsed: 0.45s
```

## Project Structure

```
quest2-merge-pdf/
├── src/
│   └── index.js       # Main merge script
├── pdfs/
│   ├── fileA.pdf      # Input PDF A (place here)
│   └── fileB.pdf      # Input PDF B (place here)
├── output/
│   └── merged.pdf     # Result (auto-created)
├── package.json
└── README.md
```

## How It Works

1. Reads both PDF files from disk
2. Loads them in parallel using `Promise.all` for speed
3. Creates a new blank PDF document
4. Copies all pages from PDF A → new document
5. Copies all pages from PDF B → new document
6. Saves the merged result to disk
