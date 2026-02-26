const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

/**
 * Quest 2: Merge PDF Files
 * Merges two PDF files (A and B) into a single document.
 *
 * Usage:
 *   node src/index.js
 *   node src/index.js --pdfA=./pdfs/fileA.pdf --pdfB=./pdfs/fileB.pdf --output=./output/merged.pdf
 */

// Parse CLI arguments (e.g., --pdfA=path --pdfB=path --output=path)
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  args.forEach((arg) => {
    const [key, value] = arg.replace('--', '').split('=');
    result[key] = value;
  });
  return result;
}

async function mergePDFs(pdfAPath, pdfBPath, outputPath) {
  console.log('📄 Starting PDF Merge Process...');
  console.log(`   PDF A: ${pdfAPath}`);
  console.log(`   PDF B: ${pdfBPath}`);
  console.log(`   Output: ${outputPath}`);
  console.log('');

  const startTime = Date.now();

  // Read both PDF files
  if (!fs.existsSync(pdfAPath)) {
    throw new Error(`PDF A not found: ${pdfAPath}`);
  }
  if (!fs.existsSync(pdfBPath)) {
    throw new Error(`PDF B not found: ${pdfBPath}`);
  }

  const [pdfABytes, pdfBBytes] = await Promise.all([
    fs.promises.readFile(pdfAPath),
    fs.promises.readFile(pdfBPath),
  ]);

  // Load both PDFs
  const [pdfA, pdfB] = await Promise.all([
    PDFDocument.load(pdfABytes),
    PDFDocument.load(pdfBBytes),
  ]);

  const pdfAPageCount = pdfA.getPageCount();
  const pdfBPageCount = pdfB.getPageCount();

  console.log(`✅ PDF A loaded: ${pdfAPageCount} pages`);
  console.log(`✅ PDF B loaded: ${pdfBPageCount} pages`);

  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();

  // Copy all pages from PDF A
  const pagesFromA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
  pagesFromA.forEach((page) => mergedPdf.addPage(page));

  // Copy all pages from PDF B
  const pagesFromB = await mergedPdf.copyPages(pdfB, pdfB.getPageIndices());
  pagesFromB.forEach((page) => mergedPdf.addPage(page));

  const totalPages = mergedPdf.getPageCount();

  // Set metadata
  mergedPdf.setTitle('Merged PDF Document');
  mergedPdf.setAuthor('Quest 2 - PDF Merger');
  mergedPdf.setCreationDate(new Date());

  // Save merged PDF
  const mergedPdfBytes = await mergedPdf.save();

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await fs.promises.writeFile(outputPath, mergedPdfBytes);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('');
  console.log('🎉 Merge Complete!');
  console.log(`   Total Pages: ${totalPages} (${pdfAPageCount} + ${pdfBPageCount})`);
  console.log(`   Output File: ${outputPath}`);
  console.log(`   File Size: ${(mergedPdfBytes.length / 1024).toFixed(2)} KB`);
  console.log(`   ⏱  Time Elapsed: ${elapsed}s`);

  return {
    success: true,
    totalPages,
    pdfAPages: pdfAPageCount,
    pdfBPages: pdfBPageCount,
    outputPath,
    elapsedSeconds: parseFloat(elapsed),
  };
}

async function main() {
  const args = parseArgs();

  const pdfAPath = args.pdfA || path.join(__dirname, '../pdfs/fileA.pdf');
  const pdfBPath = args.pdfB || path.join(__dirname, '../pdfs/fileB.pdf');
  const outputPath = args.output || path.join(__dirname, '../output/merged.pdf');

  try {
    const result = await mergePDFs(pdfAPath, pdfBPath, outputPath);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
