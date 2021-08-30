const express = require("express");
const route = express.Router();

const Contact = require("../models/contact");

exports.delete = (req, res) => {
  Contact.deleteOne({ _id: req.body._id }).then((result) => {
    req.flash("msg", "Kontak berhasil dihapus");
    res.redirect("/contact");
  });
};
