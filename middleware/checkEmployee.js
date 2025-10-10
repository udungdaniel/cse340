const jwt = require("jsonwebtoken");

function checkEmployee(req, res, next) {
    const token = req.cookies.jwt; // make sure this matches your JWT cookie name

    if (!token) {
        // No token, redirect to login
        req.flash("error", "You must be logged in to access that page.");
        return res.redirect("/account/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check account type
        if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
            // Allow access
            next();
        } else {
            // Not authorized
            req.flash("error", "You do not have permission to access that page.");
            return res.redirect("/account/login");
        }
    } catch (err) {
        // Invalid token
        req.flash("error", "Your session has expired. Please log in again.");
        return res.redirect("/account/login");
    }
}

module.exports = checkEmployee;
