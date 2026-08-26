import express from 'express';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello, Welcome to Express.js World!');
});

app.listen(port, () => {
  console.log(`Leave msg app listening on port ${port}`);
});