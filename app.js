// EXPRESS
const express = require("express");
const app = express();
const port = 3000;

// Validator
const { body, validationResult, check } = require("express-validator");

// DATABASE Connections
require("./utils/db");

// METHOD-OVERRIDE
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// MODELS
//contact
const Contact = require("./models/contact");

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

// Home
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    layout: "layouts/main-layout",
  });
});
// About
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main-layout",
  });
});
// Contact
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    title: "Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
});

// Add-data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add contact",
    layout: "layouts/main-layout",
  });
});

// Add-data contact process
app.post("/contact", (req, res) => {
  Contact.insertMany(req.body, (error, result) => {
    req.flash("msg", "Kontak berhasil ditambahkan!");
    res.redirect("/contact");
  });
});

// Delete data contact
app.delete("/contact", (req, res) => {
  Contact.deleteOne({ _id: req.body._id }).then((result) => {
    req.flash("msg", "Kontak berhasil dihapus");
    res.redirect("/contact");
  });
});

// Routes edit data
app.get("/contact/edit/:_id", async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params._id });
  res.render("edit-contact", {
    title: "Edit",
    layout: "layouts/main-layout",
    contact,
  });
});
// Update Data
app.put("/contact", (req, res) => {
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
});

// ***--ROUTER--***
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
