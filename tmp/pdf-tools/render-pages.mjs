import fs from "node:fs";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const source = "C:/Users/ASUS/Downloads/CAAD_Gate_Website_UI_Content_Brief.pdf";
const pdf = await getDocument({
  data: new Uint8Array(fs.readFileSync(source)),
  useSystemFonts: true,
}).promise;

for (const pageNumber of [3, 4, 12, 15]) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;
  fs.writeFileSync(`tmp/pdfs/brief-page-${pageNumber}.png`, canvas.toBuffer("image/png"));
}
