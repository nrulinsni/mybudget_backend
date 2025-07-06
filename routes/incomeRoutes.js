const express = require("express");
const {
    addIncome,
    getAllIncome,
    deleteIncome,
    updateIncome, // <-- Impor fungsi update
    downloadIncomeExcel
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Melindungi semua rute di bawah ini dengan satu baris
router.use(protect);

// Definisikan rute
router.post("/add", addIncome);
router.get("/get", getAllIncome);
router.get("/downloadexcel", downloadIncomeExcel);
router.delete("/:id", deleteIncome);
router.put("/:id", updateIncome); // <-- TAMBAHKAN RUTE INI UNTUK EDIT

module.exports = router;