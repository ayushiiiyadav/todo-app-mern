const express = require("express");
const protect = require("../middleware/auth");
const {
  createTask,
  getTasks,
  getStats,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/stats", getStats);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;