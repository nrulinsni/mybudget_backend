const Income = require("../models/Income");
const XLSX = require("xlsx");

exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, source, amount, date } = req.body;
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const newIncome = await Income.create({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        res.status(201).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomes = await Income.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const deleted = await Income.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (deleted) {
            res.json({ message: "Income deleted successfully" });
        } else {
            res.status(404).json({ message: "Income not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomes = await Income.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });

        const data = incomes.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: new Date(item.date).toISOString().split("T")[0],
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Income");
        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", 'attachment; filename="income_data.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { source, amount, date, icon } = req.body;

        const income = await Income.findOne({
            where: { id: id, userId: req.user.id }
        });

        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }

        // Update data
        income.source = source;
        income.amount = amount;
        income.date = date;
        income.icon = icon;

        await income.save();

        res.json({ message: "Income updated successfully", income });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};