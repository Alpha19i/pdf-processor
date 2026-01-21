const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const pastaEntrada = path.join(__dirname, "pdfs");
const pastaSaida = path.join(__dirname, "output");

if (!fs.existsSync(pastaSaida)) {
  fs.mkdirSync(pastaSaida);
}

async function separarPrimeiraPagina() {
  const arquivos = fs.readdirSync(pastaEntrada);

  for (const arquivo of arquivos) {
    if (path.extname(arquivo).toLowerCase() !== ".pdf") continue;

    const caminhoPdf = path.join(pastaEntrada, arquivo);
    const bytes = fs.readFileSync(caminhoPdf);

    const pdfOriginal = await PDFDocument.load(bytes);
    const novoPdf = await PDFDocument.create();

    const [primeiraPagina] = await novoPdf.copyPages(
      pdfOriginal,
      [0]
    );

    novoPdf.addPage(primeiraPagina);

    const nomeBase = path.basename(arquivo, ".pdf");
    const novoNome = `${nomeBase}_ficha.pdf`;
    const caminhoSaida = path.join(pastaSaida, novoNome);

    const pdfFinal = await novoPdf.save();
    fs.writeFileSync(caminhoSaida, pdfFinal);

    console.log(`✔ Criado: ${novoNome}`);
  }
}

separarPrimeiraPagina().catch(console.error);
