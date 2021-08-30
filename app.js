// EXPRESS
const express = require("express");
const app = express();
const port = 3000;

// Validator
const { body, validationResult, check } = require("express-validator");

// DATABASE Connections
require("./server/database/db");

// METHOD-OVERRIDE
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// MODELS
//contact
const Contact = require("./server/models/contact");

// EJS
app.set("view engine", "ejs");

// EJS Layouts
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

// req.body
app.use(express.urlencoded({ extended: true }));

// FLASH MESSAGE
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
// Konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: {
      maxAge: 6000,
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    },
  })
);
app.use(flash());

// ***--ROUTER--***
const render = require("./server/services/render");

// Home
app.get("/", render.home);
// About
app.get("/about", render.about);
// Contact
app.get("/contact", render.contact);

// Add-data contact Routes
app.get("/contact/add", render.add_contact);

// Edit-data Routes
app.get("/contact/edit/:_id", render.edit_contact);

// ***--ROUTER--***
const action = require("./server/services/action");
// Add-data contact process
app.post(
  "/contact",
  [
    body("name").custom(async (value) => {
      const mirror = await Contact.findOne({ name: value });
      if (mirror) {
        throw new Error("Nama contact sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email anda tidak valid").isEmail(),
    check("mPhone", "Nomor HP anda tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Contact",
        layout: "./layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        req.flash("msg", "Kontak berhasil ditambahkan!");
        res.redirect("/contact");
      });
    }
  }
);

// Update Data
app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const mirror = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && mirror) {
        throw new Error("Nama contact sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("mPhone", "Nomor HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Edit",
        layout: "./layouts/main-layout",
        contact: req.body,
        errors: errors.array(),
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mPhone: req.body.mPhone,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data berhasil diubah");
        res.redirect("/contact");
      });
    }
  }
);

// Delete data contact
app.delete("/contact", action.delete);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
