const database = require("./database");

const getUsers = (req, res) => {
  const { language, city } = req.query;
  let sql = "select * from users";
  const where = [];

  if (language) {
    where.push({
      column: "language",
      value: language,
    });
  }

  if (city) {
    where.push({
      column: "city",
      value: city,
    });
  }

  if (where.length > 0) {
    sql += " WHERE " + where.map(({ column }) => `${column} = ?`).join(" AND ");
  }

    database
      .query(sql, where.map(({ value }) => value))
      .then(([users]) => {
        if (users.length === 0) {
          res.status(200).json([]);
        } else {
          res.json(users);
        }        
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };
  
  const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select * from users where id = ?", [id])
      .then(([users]) => {
        if (users[0] != null) {
          res.json(users[0]);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  const postUserCreation = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    database
      .query("INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)", [firstname, lastname, email, city, language, hashedPassword])
      .then((result) => {
        const userId = result.insertId;
        res.status(201).json({ id: userId, message: "User created successfully"});
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error inserting data into databse");
      });
  };

  const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;
  
    database
      .query(
        "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
        [firstname, lastname, email, city, language, id]
      )
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the user");
      });
  };

  const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("delete from users where id = ?", [id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the user");
      });
  };

  module.exports = {
    getUsers,
    getUserById,
    postUserCreation,
    updateUser,
    deleteUser,
  };