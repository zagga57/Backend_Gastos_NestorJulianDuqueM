const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");
//const Expense = require("../models/Expense");
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
router.put("/:id", auth, async (req, res) => {
  const { title, amount, date, category } = req.body;

  try {
    // const existingExpense = await Expense.findOne({
    //  title,
    // user: req.user.id,
    //_id: { $ne: req.params.id },
    //});
    //if (existingExpense) {
    // return res
    // .status(400)
    ///.json({ error: "Ya existe otra gasto con este Titulo" });
    //}
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, amount, date, category },
      { new: true, runValidators: true },
    );
    if (!expense) return res.status(404).json({ error: "Gasto no encontrado" });
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el gasto" });
  }
});

//Eliminar un gasto//
module.exports = router;
