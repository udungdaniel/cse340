'use strict'

const form = document.querySelector("#updateForm")

if (form) {
    form.addEventListener("change", function () {
        const updateBtn = form.querySelector("button[type='submit']")
        if (updateBtn.hasAttribute("disabled")) {
            updateBtn.removeAttribute("disabled")
            console.log("Form changed — Update button enabled")
        }
    })
}
