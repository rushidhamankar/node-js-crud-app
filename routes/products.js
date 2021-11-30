var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");

router.get("/", function (req, res, next) {
  let limit;
  let page;

  if (req.query.page === undefined && req.query.limit === undefined) {
    page = 0;
    limit = 1000;
  } else if (req.query.page === undefined && req.query.limit !== undefined) {
    page = 0;
    limit = req.query.limit;
  } else if (req.query.page !== undefined && req.query.limit === undefined) {
    page = 0;
    limit = 1000;
  } else if (req.query.page == 1) {
    limit = req.query.limit;
    page = 0;
  } else {
    limit = req.query.limit;
    page = (req.query.page - 1) * limit;
  }

  dbConn.query(
    `SELECT product.id, product.product_id, product.product_name, category.category_id, category.category_name FROM product INNER JOIN category ON product.category_id = category.category_id limit ${limit} offset ${page} `,
    function (err, rows) {
      if (err) {
        req.flash("error", err);
        // render to views/books/index.ejs
        res.render("products", { data: "" });
      } else {
        // render to views/books/index.ejs
        res.render("products", { data: rows });
      }
    }
  );
});

// display add book page
router.get("/add", function (req, res, next) {
  // render to add.ejs
  res.render("products/add", {
    product_id: "",
    product_name: "",
    category_id: "",
  });
});

// add a new book
router.post("/add", function (req, res, next) {
  let product_id = req.body.product_id;
  let product_name = req.body.product_name;
  let category_id = req.body.category_id;
  let errors = false;

  if (
    product_id.length === 0 ||
    product_name.length === 0 ||
    category_id.length === 0
  ) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter Product ID , Product Name or Category ID");
    // render to add.ejs with flash message
    res.render("products/add", {
      product_id: product_id,
      product_name: product_name,
      category_id: category_id,
    });
  }

  // if no error
  if (!errors) {
    var form_data = {
      product_id: product_id,
      product_name: product_name,
      category_id: category_id,
    };

    // insert query
    dbConn.query(
      "INSERT INTO product SET ?",
      form_data,
      function (err, result) {
        //if(err) throw err
        if (err) {
          req.flash("error", err);

          // render to add.ejs
          res.render("products/add", {
            product_id: form_data.product_id,
            product_name: form_data.product_name,
            category_id: form_data.category_id,
          });
        } else {
          req.flash("success", "Product successfully added");
          res.redirect("/products");
        }
      }
    );
  }
});

router.get("/edit/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query(
    "SELECT * FROM product WHERE id = " + id,
    function (err, rows, fields) {
      if (err) throw err;

      // if user not found
      if (rows.length <= 0) {
        req.flash("error", "Product not found with id = " + id);
        res.redirect("/products");
      }
      // if book found
      else {
        // render to edit.ejs
        res.render("products/edit", {
          title: "Edit Product",
          id: rows[0].id,
          product_id: rows[0].product_id,
          product_name: rows[0].product_name,
          category_id: rows[0].category_id,
        });
      }
    }
  );
});

// update book data
router.post("/update/:id", function (req, res, next) {
  let id = req.params.id;
  let product_id = req.body.product_id;
  let product_name = req.body.product_name;
  let category_id = req.body.category_id;
  let errors = false;

  if (
    product_id.length === 0 ||
    product_name.length === 0 ||
    category_id.length === 0
  ) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter Product Id , Product Name or Category ID");
    // render to add.ejs with flash message
    res.render("products/edit", {
      id: req.params.id,
      product_id: product_id,
      product_name: product_name,
      category_id: category_id,
    });
  }

  // if no error
  if (!errors) {
    var form_data = {
      product_id: product_id,
      product_name: product_name,
      category_id: category_id,
    };
    // update query
    dbConn.query(
      "UPDATE product SET ? WHERE id = " + id,
      form_data,
      function (err, result) {
        //if(err) throw err
        if (err) {
          // set flash message
          req.flash("error", err);
          // render to edit.ejs
          res.render("products/edit", {
            id: req.params.id,
            product_id: form_data.product_id,
            product_name: form_data.product_name,
            category_id: form_data.category_id,
          });
        } else {
          req.flash("success", "Product successfully updated");
          res.redirect("/products");
        }
      }
    );
  }
});

router.get("/delete/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query("DELETE FROM product WHERE id = " + id, function (err, result) {
    //if(err) throw err
    if (err) {
      // set flash message
      req.flash("error", err);
      // redirect to books page
      res.redirect("/products");
    } else {
      // set flash message
      req.flash("success", "product successfully deleted! ID = " + id);
      // redirect to books page
      res.redirect("/products");
    }
  });
});

module.exports = router;
