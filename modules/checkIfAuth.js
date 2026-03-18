function checkIfAuthenticated(req,res,next) {
    if(!req.isAuthenticated()) {
        return res.redirect("/login")
    }
    next()
}

function checkIfNotAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

function checkIfAdmin(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/login")
    }
    if (req.user.role !== 'admin') {
        return res.status(403).send("Bu sayfaya erişim yetkiniz yok.")
    }
    next()
}


module.exports = {
    checkIfAuthenticated: checkIfAuthenticated,
    checkIfNotAuthenticated: checkIfNotAuthenticated,
    checkIfAdmin: checkIfAdmin,
}