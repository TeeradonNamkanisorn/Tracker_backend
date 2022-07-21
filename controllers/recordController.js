const createError = require("../services/createError");
const { Record } = require("../models");
const { Op } = require("sequelize");
const isDate = require("../services/isDate");

module.exports.addRecord = async (req, res, next) => {
  try {
    const { amount, type, date, title } = req.body;

    if (!amount && amount !== 0) createError("Record amount is required", 400);
    if (amount < 0)
      createError("The amount cannot be negative. Income or expense.", 400);

    if (!type) createError("Type is required", 400);
    if (!date) createError("Date is required", 400);
    if (typeof type !== "string") createError("Invalid type", 400);

    if (type !== "INCOME" && type !== "EXPENSE")
      createError("Invalid type", 400);

    if (!isDate(date)) createError("Invalid date");
    if (new Date(date).getTime() > new Date().getTime()) {
      createError("You cannot add a record beyond today.");
    }

    const record = await Record.create({
      amount,
      type,
      date,
      title,
      userId: req.user.id,
    });
    res.json({ record });
  } catch (err) {
    next(err);
  }
};

module.exports.updateRecord = async (req, res, next) => {
  //Update only the provided values
  try {
    const { title, amount, date } = req.body;
    console.log(req.body);
    const { recordId } = req.params;
    if (amount != null && typeof amount !== "number")
      createError("The amount must be a number", 400);
    if (amount < 0) createError("Cannot be negative value", 400);
    if (date && !isDate(date)) createError("Invalid date");
    if (date && new Date(date).getTime() > new Date().getTime()) {
      createError("You cannot add a record beyond today.", 400);
    }
    if (title !== undefined && !title) createError("title is required.", 400);

    const record = await Record.findByPk(recordId);
    if (!record) createError("Invalid record", 400);
    if (record.userId !== req.user.id)
      createError("You are not allowed to edit this resource", 403);

    await Record.update({ title, amount, date }, { where: { id: recordId } });
    const returnedRecord = await Record.findByPk(recordId);
    res.json({ record: returnedRecord });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteRecord = async (req, res, next) => {
  try {
    const recordId = req.params.recordId;
    const record = await Record.findByPk(recordId);
    if (!record) createError("Record not found", 400);
    await record.destroy();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getRecords = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(req.query);
    let whereStatement = { userId };

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    console.log(TODAY_START, NOW);

    if (req.query.today === "true") {
      whereStatement.date = {
        [Op.lt]: NOW,
        [Op.gte]: TODAY_START,
      };
    }

    if (req.query.date) {
      const DAY_START = new Date(new Date(req.query.date).toLocaleDateString());
      const DAY_END = new Date(
        new Date(req.query.date).toLocaleDateString()
      ).setHours(23, 59, 59, 999);
      whereStatement.date = {
        [Op.lte]: DAY_END,
        [Op.gte]: DAY_START,
      };
    }

    let records = await Record.findAll({
      where: whereStatement,
      order: [["date", "ASC"]],
    });

    records = JSON.parse(JSON.stringify(records));
    if (req.query.type === "INCOME" || req.query.type === "EXPENSE") {
      records = records.filter((record) => record.type === req.query.type);
    }

    records = records.map((record) => ({
      ...record,
      date: new Date(record.date).toLocaleString("en-UK", "Asia/Bangkok"),
      utcDate: record.date,
    }));

    res.json({ records });
  } catch (err) {
    next(err);
  }
};
