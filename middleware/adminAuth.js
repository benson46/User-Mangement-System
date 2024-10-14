const isLogin = async (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/admin/login')
    }
    next()
}

const isLogout = async (req, res, next) => {
    if(req.session.user_id){
        return res.redirect('/admin/home')
    }
    next();
}

const nocache =  (req, res, next) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
    next();
}

module.exports = {
    isLogin,
    isLogout,
    nocache
}
