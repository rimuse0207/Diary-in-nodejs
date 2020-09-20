var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const filename = path.join(__dirname, "../textfile");

/* GET home page. */
let update = "";
router.get("/", function(req, res, next) {
  if (req.user) {
    fs.readdir(filename, (err, files) => {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      res.render("index", {
        name: req.user,
        title: "FILES SHOW",
        length: files.length,
        filename: files,
        description: "CHOISE YOUR FILES"
      });
    });
  } else {
    res.redirect("users/login");
  }
});
router.get("/create", (req, res, next) => {
  res.render("create");
});
router.post("/create_prodcess", (req, res) => {
  const post = req.body;
  fs.writeFile(`./textfile/${post.title}`, post.description, err => {
    if (err) throw err;
    console.log("the file has been saved");
  });
  res.redirect("/");
});

router.get("/:pageId", (req, res, next) => {
  const filteredId = path.parse(req.params.pageId).name;
  fs.readFile(`./textfile/${filteredId}`, "utf8", (err, data) => {
    res.render("index", {
      name: req.user,
      title: req.params.pageId,
      length: 0,
      description: data
    });
  });
});

router.get("/:pageId/delete", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;
  const filepath = `./textfile/${filteredId}`;
  if (!filteredId) {
    res.redirect("/", alert("choice file"));
  } else {
    fs.unlinkSync(filepath);
    res.redirect("/");
  }
});
router.get("/:pageId/update", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;
  update = filteredId;
  fs.readFile(`./textfile/${filteredId}`, "utf8", (err, data) => {
    res.render("update", {
      title: req.params.pageId,
      description: data
    });
  });
});
router.post("/update_prodcess", (req, res) => {
  const post = req.body;
  fs.rename(`./textfile/${update}`, `./textfile/${post.title}`, err => {
    fs.writeFile(`./textfile/${post.title}`, post.description, err => {
      if (err) throw err;
      console.log("the file has been saved");
    });
    res.redirect("/");
  });
  // const filteredId = path.parse(req.params.pageId).name;
  // const filepath = `./textfile/${filteredId}`;
  // fs.unlinkSync(filepath);
});

module.exports = router;
