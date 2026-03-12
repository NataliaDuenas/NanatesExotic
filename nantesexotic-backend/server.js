import express from "express";
import cors from "cors";
import diagnosticRoute from "./routes/diagnostic.js";
import { CROP_CATALOG } from "./catalog/crops.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// servir /crops/*.jpg desde backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// montar router diagnostic
app.use("/diagnostic", diagnosticRoute);

// catálogo para Home
app.get("/crops", (req, res) => {
  const crops = CROP_CATALOG.map((c) => ({
    id: c.id,
    name: c.name,
    scientificName: c.scientificName,
    imageUrl: c.imageUrl,
  }));
  res.json({ crops });
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});