// Fake catalogue and accounts for the demo shop. Nothing here is real.
function seed(db) {
  db.exec(`
    CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, role TEXT);
    INSERT INTO users (email, password, role) VALUES
      ('admin@acme.test', 's3cret!', 'admin'),
      ('ana@acme.test', 'Summer2026!', 'customer'),
      ('ben@acme.test', 'hunter2-acme', 'customer');

    CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL);
    INSERT INTO products (name, description, price) VALUES
      ('Desk lamp', 'Warm LED lamp with a brass base', 39.0),
      ('Floor lamp', 'Tall reading lamp, dimmable', 89.0),
      ('Notebook', 'A5 dotted notebook, 120 pages', 9.5),
      ('Fountain pen', 'Steel nib, blue ink cartridge included', 24.0),
      ('Desk mat', 'Felt desk mat, 80 x 30 cm', 19.0);
  `);
}

module.exports = { seed };
