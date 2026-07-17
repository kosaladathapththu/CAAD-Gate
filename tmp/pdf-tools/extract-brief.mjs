import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const source = "C:/Users/ASUS/Downloads/CAAD_Gate_Website_UI_Content_Brief.pdf";
const document = await getDocument({
  data: new Uint8Array(fs.readFileSync(source)),
  useSystemFonts: true,
}).promise;

for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const content = await page.getTextContent();
  const lines = [];
  let currentY = null;
  let currentLine = [];

  for (const item of content.items) {
    const y = Math.round(item.transform[5]);
    if (currentY !== null && Math.abs(y - currentY) > 2) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
      currentLine = [];
    }
    currentY = y;
    currentLine.push(item.str);
  }
  if (currentLine.length) lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());

  console.log(`\n===== PAGE ${pageNumber} =====\n`);
  console.log(lines.filter(Boolean).join("\n"));
}
