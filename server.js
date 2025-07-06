require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB, sequelize } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


// Inicuma sebagai cadangankalau proxy dimatikan
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",


app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/user", userRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!'); 
});

const PORT = process.env.PORT || 5000;

connectDB();

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
}).catch(err => {
  console.log("Error syncing database:", err);
});