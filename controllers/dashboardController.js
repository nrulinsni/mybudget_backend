const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Op, fn, col, literal } = require("sequelize");

const formatToRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number || 0);
};

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalIncome = await Income.sum('amount', { where: { userId } });
        const totalExpense = await Expense.sum('amount', { where: { userId } });

        const recentIncomes = await Income.findAll({ where: { userId }, limit: 5, order: [['date', 'DESC']] });
        const recentExpenses = await Expense.findAll({ where: { userId }, limit: 5, order: [['date', 'DESC']] });

        // --- LOGIKA BARU DI SINI ---
        const expenseByCategory = await Expense.findAll({
            where: { userId },
            attributes: [
                'category',
                [fn('SUM', col('amount')), 'total_amount'],
            ],
            group: ['category'],
            raw: true,
        });

        const lastTransactions = [...recentIncomes, ...recentExpenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(txn => ({
                ...txn.toJSON(),
                type: txn.source ? 'income' : 'expense'
            }));

        res.json({
            totalBalance: formatToRupiah(totalIncome - totalExpense),
            totalIncome: formatToRupiah(totalIncome),
            totalExpenses: formatToRupiah(totalExpense),
            recentTransactions: lastTransactions,
            expenseByCategory: expenseByCategory.map(item => ({ // Format data untuk chart
                name: item.category,
                amount: parseFloat(item.total_amount)
            })),
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};