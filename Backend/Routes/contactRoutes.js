const router = require("express").Router();
const auth = require("../Middleware/authMiddleware");
const role = require("../Middleware/roleMiddleware");
const { createContact, getContacts, updateContact, deleteContact } = require("../Controllers/contactController");
router.post("/", createContact);
router.get("/", auth, role("admin"), getContacts);
router.put("/:id", auth, role("admin"), updateContact);
router.delete("/:id", auth, role("admin"), deleteContact);
module.exports = router;
