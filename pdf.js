const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const pastaEntrada = path.join(
  __dirname,
  "pdfs"
);
const arquivoSaida = path.join(
  __dirname, 
  "fichas.pdf"
);

async function criarPdfComTodasAsPrimeirasPaginas() {
  const arquivos = fs.readdirSync(pastaEntrada);

  const pdfFinal = await PDFDocument.create();

  for (const arquivo of arquivos) {
    if (path.extname(arquivo).toLowerCase() !== ".pdf") continue;

    const caminhoPdf = path.join(pastaEntrada, arquivo);
    const bytes = fs.readFileSync(caminhoPdf);

    const pdfOriginal = await PDFDocument.load(bytes);

    if (pdfOriginal.getPageCount() === 0) continue;

    const [primeiraPagina] = await pdfFinal.copyPages(
      pdfOriginal,
      [0]
    );

    pdfFinal.addPage(primeiraPagina);

    console.log(`✔ Página adicionada: ${arquivo}`);
  }

  const pdfBytes = await pdfFinal.save();
  fs.writeFileSync(arquivoSaida, pdfBytes);

  console.log("\n📄 PDF final criado:", arquivoSaida);
}

criarPdfComTodasAsPrimeirasPaginas().catch(console.error);
