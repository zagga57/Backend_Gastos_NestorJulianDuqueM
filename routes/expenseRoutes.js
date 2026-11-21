const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");
const router = express.Router();

//crear gasto

router.post("/new", auth, async (req, res) => {
  const { title, amount, date, category } = req.body;
  try {
    const expense = new Expense({
      title,
      amount,
      date: date || Date.now(),
      category,
      user: req.user.id,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

//Listar gastos

router.get("/list", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los gastos" });
    console.error(error);
  }
});

//Actualizar un gasto
//Eliminar un gasto
module.exports = router;
