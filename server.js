if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
// const flash = require("express-flash");
const session = require("cookie-session");

const methodOverride = require("method-override");
// const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const initializePassport = require("./passport-config");
const User = require("./models/Users");
const { body, validationResult } = require("express-validator");
const auth = require("./middleware/jwtAuth");
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
const LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      console.log(password);
      //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      // return User.findOne({ email })
      return User.findOne({ $and: [{ email: email }, { password: password }] })
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: "Incorrect email or password." });
          }
          const passwordMatch = bcrypt.compare(
            password,
            user.password,
            function (err, isMatch) {
              if (err) {
                throw err;
              } else if (!isMatch) {
                console.log("Password doesn't match!");
              } else {
                console.log("Password matches!");
              }
            }
          );
          return cb(null, user, { message: "Logged In Successfully" });
        })
        .catch((err) => cb(err));
    }
  )
);

const mongoose = require('mongoose')
mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("mongoose conected")
  })
  .catch(err => console.log(err.message))
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://madhanRecroot:arinno123@cluster0.0tjrs.mongodb.net/?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect()
//     .then( () => {
      
//         console.log('Connected to the database ')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. n${err}`);
//     })
// mongoose.connect('mongodb+srv://madhanRecroot:arinno123@cluster0.0tjrs.mongodb.net/?retryWrites=true&w=majority',
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }
// ).then(()=>{console.log("Mongoose connetced")}).catch((err)=> console.log(err.message))

const users = [];
app.use(express.json());
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// const passport = require("passport");

// passport.use(strategy);

// app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/resume", auth, express.static("upload/resume"));
app.use("/cover", express.static("upload/cover"));

require("./routes/companyRouter")(app);
require("./routes/userRouter")(app);
require("./routes/JobRoute")(app);

app.get("/", checkAuthenticated, (req, res) => {
  res.status(200).json({ message: "User loged in Sucessfully" });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.status(200).json({ message: "User loged in failed" });
});

app.post("/login", checkNotAuthenticated, async (req, res) => {
  // try {
  //   console.log(req.body.name);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Something Went Wrong" });
  // }
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      // console.log(err);
      return res.status(400).json({
        message: err,
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      // const token = jwt.sign(user, "your_jwt_secret");
      return res.json({ user });
    });
  })(req, res);
});

// app.get("/register", checkNotAuthenticated, (req, res) => {
//   res.render("register.ejs");
// });

app.post(
  "/register",
  checkNotAuthenticated, // username must be an email
  body("email", "Your email is not valid. Please Enter a Valid Email")
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const email = newUser.email;
      // Create token
      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      console.log(token);
      newUser.token = token;
      console.log(newUser);
      res
        .status(200)
        .json({ message: "User Saved Sucessfully", User: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode");
});
