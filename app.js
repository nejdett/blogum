const express = require('express');
const connecttodb = require('./models/dbconnection');
const User = require('./models/User');
const app = express();
const bcrypt = require("bcrypt")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session')
const MongoStore = require('connect-mongo').default;
const methodOverride = require('method-override')
const checkAuth = require('./modules/checkIfAuth')
const blogRouter = require('./routes/blog')
const adminRouter = require('./routes/admin')
const Post = require('./models/post')

connecttodb()


app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, dbName: "Session" })
}));
    app.use(passport.authenticate('session'));
    app.use(methodOverride('_method'))
    app.use('/blog', blogRouter)
    app.use('/admin', adminRouter)
    app.use(express.static('public'))



const verifyCallback = async (username, password, done) => {
    try {
        const user = await User.findOne({ email: username });
        if (!user) { return done(null, false, { message: 'Kullanıcı bulunamadı.' }); }

        const match = await bcrypt.compare(password, user.password);
        if (!match) { return done(null, false, { message: 'Şifre hatalı.' }); }

        return done(null, user);
    } catch (err) {
        throw new Error(err)
    };
  }

passport.use(new LocalStrategy({usernameField: "email"}, verifyCallback)),

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, role: user.role });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

app.get("/", checkAuth.checkIfAuthenticated, async (req,res) => {
    const posts = await Post.find({ isPublished: true }).sort({ createdAt: -1 })
    res.render("index", {user: req.user, posts})
})

app.get("/login", checkAuth.checkIfNotAuthenticated, (req,res) => {
    res.render("login", { hata: req.query.hata })
})

app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?hata=1'
   })
)

app.get("/register", checkAuth.checkIfNotAuthenticated, (req,res) => {
    res.render("register")
})

app.post("/register", async (req,res) => {
    try {
        const hasheduser = await bcrypt.hash(req.body.password, 10)
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hasheduser
        })
        res.redirect("/")
    } catch (error) {
        throw new Error(error)
    }
})

app.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { throw new Error(err); }
    res.redirect('/login');
    return next()
  });
});


app.listen(3000,()=> {
    console.log("3000 portu çalışıyor.");
});