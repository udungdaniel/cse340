const express = require("express")
const router = express.Router()
const profileController = require("../controllers/profileController")
const utilities = require("../utilities")

router.get("/", utilities.checkLogin, utilities.handleErrors(profileController.buildProfileView))
router.post("/update", utilities.checkLogin, utilities.handleErrors(profileController.updateProfile))

module.exports = router
