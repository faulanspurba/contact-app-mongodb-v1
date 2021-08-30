//contact
const Contact = require("../models/contact");

exports.home = (req, res) => {
  res.render("index", {
    title: "Home",
    layout: "layouts/main-layout",
  });
};

exports.about = (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main-layout",
  });
};

exports.contact = async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    title: "Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
};

exports.add_contact = (req, res) => {
  res.render("add-contact", {
    title: "Add contact",
    layout: "layouts/main-layout",
  });
};

exports.edit_contact = async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params._id });
  res.render("edit-contact", {
    title: "Edit",
    layout: "layouts/main-layout",
    contact,
  });
};
