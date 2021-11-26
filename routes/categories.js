var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");

// display books page
router.get("/", function (req, res, next) {
  dbConn.query("SELECT * FROM category ORDER BY id desc", function (err, rows) {
    if (err) {
      req.flash("error", err);
      // render to views/books/index.ejs
      res.render("categories", { data: "" });
    } else {
      // render to views/books/index.ejs
      res.render("categories", { data: rows });
    }
  });
});

// display add book page
router.get("/add", function (req, res, next) {
  // render to add.ejs
  res.render("categories/add", {
    category_id: "",
    category_name: "",
  });
});

// add a new book
router.post("/add", function (req, res, next) {
  let category_id = req.body.category_id;
  let category_name = req.body.category_name;
  let errors = false;

  if (category_id.length === 0 || category_name.length === 0) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter Category ID and Name");
    // render to add.ejs with flash message
    res.render("categories/add", {
      category_id: category_id,
      category_name: category_name,
    });
  }

  // if no error
  if (!errors) {
    var form_data = {
      category_id: category_id,
      category_name: category_name,
    };

    // insert query
    dbConn.query(
      "INSERT INTO category SET ?",
      form_data,
      function (err, result) {
        //if(err) throw err
        if (err) {
          req.flash("error", err);

          // render to add.ejs
          res.render("categories/add", {
            category_id: form_data.category_id,
            category_name: form_data.category_name,
          });
        } else {
          req.flash("success", "Category successfully added");
          res.redirect("/categories");
        }
      }
    );
  }
});

// display edit book page
router.get("/edit/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query(
    "SELECT * FROM category WHERE id = " + id,
    function (err, rows, fields) {
      if (err) throw err;

      // if user not found
      if (rows.length <= 0) {
        req.flash("error", "Category not found with id = " + id);
        res.redirect("/categories");
      }
      // if book found
      else {
        // render to edit.ejs
        res.render("categories/edit", {
          title: "Edit Category",
          id: rows[0].id,
          category_id: rows[0].category_id,
          category_name: rows[0].category_name,
        });
      }
    }
  );
});

// update book data
router.post("/update/:id", function (req, res, next) {
  let id = req.params.id;
  let category_id = req.body.category_id;
  let category_name = req.body.category_name;
  let errors = false;

  if (category_id.length === 0 || category_name.length === 0) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter Id and Name");
    // render to add.ejs with flash message
    res.render("categories/edit", {
      id: req.params.id,
      category_id: category_id,
      category_name: category_name,
    });
  }

  // if no error
  if (!errors) {
    var form_data = {
      category_id: category_id,
      category_name: category_name,
    };
    // update query
    dbConn.query(
      "UPDATE category SET ? WHERE id = " + id,
      form_data,
      function (err, result) {
        //if(err) throw err
        if (err) {
          // set flash message
          req.flash("error", err);
          // render to edit.ejs
          res.render("categories/edit", {
            id: req.params.id,
            category_id: form_data.category_id,
            category_name: form_data.category_name,
          });
        } else {
          req.flash("success", "Product successfully updated");
          res.redirect("/categories");
        }
      }
    );
  }
});

// delete book
router.get("/delete/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query("DELETE FROM category WHERE id = " + id, function (err, result) {
    //if(err) throw err
    if (err) {
      // set flash message
      req.flash("error", err);
      // redirect to books page
      res.redirect("/categories");
    } else {
      // set flash message
      req.flash("success", "Category successfully deleted! ID = " + id);
      // redirect to books page
      res.redirect("/categories");
    }
  });
});

module.exports = router;
