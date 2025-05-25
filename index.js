const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const designsRoute = require("./routes/designRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

const uri =
  "mongodb+srv://younsiahmed:younsiahmed@cluster0.3bhdu1k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/api/users", userRoutes);
app.use("/api/designs", designsRoute);
app.use("/api/categories", categoryRoutes);

const distPath = path.join(__dirname, "tshirt/browser");

// Serve Angular static files
app.use(express.static(distPath));

// Catch-all route to index.html for Angular routing

app.get(/^\/(?!api|uploads).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
