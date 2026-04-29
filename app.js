const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname), {
  dotfiles: 'deny',
  index: 'index.html',
  setHeaders(res) {
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

app.get('*.html', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => console.log(`Mane Mogul running on port ${PORT}`));
