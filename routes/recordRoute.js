const router = require("express").Router();
const recordController = require("../controllers/recordController");

router.post("/", recordController.addRecord);
router.put("/:recordId", recordController.updateRecord);
router.delete("/:recordId", recordController.deleteRecord);
router.get("/records", recordController.getRecords);
module.exports = router;
