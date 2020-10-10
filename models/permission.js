exports.permission = function (checkRole) {
    return (req, res, next) => {
        if(req.session.role == checkRole && req.session.userId != undefined) {
            next();
        } else {
            req.session.destroy();
            res.redirect('/');
        }
    }
}