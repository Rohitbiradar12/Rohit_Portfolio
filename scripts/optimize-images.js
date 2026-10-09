import sharp from "sharp";
import fs from "node:fs/promises";
const names = ["canvas", "worknest", "money-mates", "call-pilot", "cogagent", "resume_preview", "rohit-photo"];
for (const name of names) {
  const source = "public/images/" + name + (name === "resume_preview" ? ".jpg" : ".png");
  const target = "public/images/" + name + ".webp";
  await sharp(source).resize({ width: name === "resume_preview" ? 1200 : 960, withoutEnlargement: true }).webp({ quality: 85 }).toFile(target);
  console.log(name, (await fs.stat(source)).size, "→", (await fs.stat(target)).size);
}
await sharp("public/favicon.png").resize(64,64,{fit:"inside"}).png({compressionLevel:9}).toFile("public/favicon-small.png");
await sharp("public/images/logos/aws.png").resize({width:160,withoutEnlargement:true}).webp({quality:85}).toFile("public/images/logos/aws.webp");
