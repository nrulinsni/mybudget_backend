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

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    console.log("--------------------");
    console.log("Request Origin Header:", origin);
    console.log("Allowed Origins List:", allowedOrigins);

    if (!origin || allowedOrigins.includes(origin)) {
      console.log("CORS check passed for origin:", origin);
      callback(null, true);
    } else {
      console.error("CORS check FAILED for origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/user", userRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = process.env.PORT || 8080; // Port default di banyak platform hosting

connectDB();

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
}).catch(err => {
  console.log("Error syncing database:", err);
});