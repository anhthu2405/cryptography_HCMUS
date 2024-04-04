const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Khóa bí mật và IV cho AES
const secretKey = crypto.randomBytes(32); 
const algorithm = 'aes-256-cbc'; // Thuật toán AES

// Hàm mã hóa
function encrypt(text) {
  const initVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, initVector);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: initVector.toString('hex'), encryptedData: encrypted };
}

// Hàm giải mã
function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encrypted.iv, 'hex'));
  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

let users = {};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/signup', (req, res) => {
  res.send(`
    <form action="/signup" method="post">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  `);
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const encryptedPassword = encrypt(password);
  users[username] = encryptedPassword;
  res.send(`<script>localStorage.setItem('password', JSON.stringify(${JSON.stringify(encryptedPassword)}));</script>Signup successful!`);
});

app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    const decryptedPassword = decrypt(users[username]);
    if (password === decryptedPassword) {
      res.send('Login successful!');
    } else {
      res.send('Invalid username or password.');
    }
  } else {
    res.send('Invalid username or password.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});