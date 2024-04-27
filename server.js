const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Sync Sequelize models to the database, then turn on the server
const schemaFilePath = path.join(__dirname, 'db', 'schema.sql');
const schemaSQL = fs.readFileSync(schemaFilePath, 'utf8');

// Execute the SQL script
sequelize.query(schemaSQL)
  .then(() => {
    console.log('Schema imported successfully.');
  })
  .catch(err => {
    console.error('Error importing schema:', err);
  });


sequelize.sync()
  .then(() => {
    console.log('Sequelize models synced to the database');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch(err => {
    console.error('Sequelize sync error:', err);
  });
// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}!`);
// });
