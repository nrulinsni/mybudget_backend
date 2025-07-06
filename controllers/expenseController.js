// controllers/expenseController.js
const Expense = require("../models/Expense");
const XLSX = require("xlsx");

exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const newExpense = await Expense.create({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const deleted = await Expense.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (deleted) {
            res.json({ message: "Expense deleted successfully" });
        } else {
            res.status(404).json({ message: "Expense not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ... (sisakan fungsi lainnya: addExpense, getAllExpense, dst.)

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, amount, date, icon } = req.body;

        const expense = await Expense.findOne({
            where: { id: id, userId: req.user.id }
        });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Update data
        expense.category = category;
        expense.amount = amount;
        expense.date = date;
        expense.icon = icon;

        await expense.save();

        res.json({ message: "Expense updated successfully", expense });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await Expense.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });

        const data = expenses.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: new Date(item.date).toISOString().split("T")[0],
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", 'attachment; filename="expense_data.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};