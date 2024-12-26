import express from "express";
import cors from "cors";
import router from "./Routes/AllRoutes.js";
import connectDB from "./Config/bd.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(bodyParser.json());
// Example route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to the database
connectDB();



// Middleware to parse cookies
app.use(cookieParser());
// Routes
app.use("/api/v3/", router);

// Start the server
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
