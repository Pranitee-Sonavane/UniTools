import express from "express";
import cors from "cors";
import syllabusRoutes from "./routes/syllabus.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/syllabus", syllabusRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
