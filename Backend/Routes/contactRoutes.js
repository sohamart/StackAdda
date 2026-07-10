const router = require("express").Router();
const auth = require("../Middleware/authMiddleware");
const role = require("../Middleware/roleMiddleware");
const { createContact, getContacts, updateContact } = require("../Controllers/contactController");
router.post("/", createContact);
router.get("/", auth, role("admin"), getContacts);
router.put("/:id", auth, role("admin"), updateContact);
module.exports = router;
