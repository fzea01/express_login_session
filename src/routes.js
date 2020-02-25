let express = require("express"),
    path = require('path'),
    fs = require('fs'),
    router = express.Router(),
    { check, validationResult, matchedData } = require("express-validator"),
    directoryPath = path.join(__dirname, 'public/images/computer');
    
let listFile = []
let listType =[]

router.use((req,res,next) => {
  let tmpStr = []
  let tmpType = []

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.log('Unable to scan directory: ' + err);
    } 
    files.forEach( (file) => {
        // console.log(file);
        let tmp = file.split('.')
        tmpStr.push(tmp[0])
        tmpType.push(tmp[1])
    });

    listFile = tmpStr;
    listType = tmpType;

  });
  
  next();
})

router.get("/", (req, res) => {
  console.log("Please Login !!! ")
  res.render("index", {
    data: {},
    errors: {}
  });
});

router.post(
  "/",
  [
    check("email")
      .isEmail()
      .withMessage("That email doesn‘t look right")
      .bail()
      .trim()
      .normalizeEmail(),
    check("password")
      .isLength({ min: 1 })
      .withMessage("Password is required")
      .trim()
  ],
  (req, res) => {
    console.log(req.body);
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("index", {
        data: req.body,
        errors: errors.mapped()
      });
    }

    let data = matchedData(req);
    console.log("Sanitized: ", data);
    req.session.password = data.password;
    req.session.email = data.email;

    res.redirect("/admin");
  }

  
);

router.get("/admin",(req,res) => {
  if(!req.session.email || req.session.password != 240311){
    req.flash("false", "Please Login First.");
    console.log("Login False!")
  } else {
    req.flash("success", `Login Success Hello ${req.session.email}`);
    console.log("Login Success!")

  }
  
  res.render("admin")
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy( (err) => {
      if(err) {
        return next(err);
      } else {
        console.log('Logout Success')
        return res.redirect('/');
      }
    });
  }
});


router.get('/computer', (req,res) => {
  res.render('computer',{lists:listFile,type:listType})
})

module.exports = router;