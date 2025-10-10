const profileModel = require("../models/profile-model")
const utilities = require("../utilities")

async function buildProfileView(req, res) {
    const account_id = res.locals.accountData.account_id
    const account = await profileModel.getProfileById(account_id)
    res.render("account/profile", {
        title: "My Profile",
        account,
        errors: null,
    })
}

async function updateProfile(req, res) {
    const { account_firstname, account_email, phone, address } = req.body
    const account_id = res.locals.accountData.account_id
    const updated = await profileModel.updateProfile(account_id, account_firstname, account_email, phone, address)
    if (updated) {
        req.flash("notice", "Profile updated successfully.")
        res.redirect("/account/profile")
    } else {
        req.flash("notice", "Update failed.")
        res.redirect("/account/profile")
    }
}

module.exports = { buildProfileView, updateProfile }
