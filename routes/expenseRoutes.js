// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Melindungi semua rute di bawah ini

router.post('/add', expenseController.addExpense);
router.get('/get', expenseController.getAllExpense);
router.delete('/:id', expenseController.deleteExpense);
router.put('/:id', expenseController.updateExpense); 
router.get('/downloadexcel', expenseController.downloadExpenseExcel);

module.exports = router;