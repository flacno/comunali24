const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-preference', (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, 'preferences.json');
  
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    let preferences = JSON.parse(fileData);
    preferences.push(data);

    fs.writeFile(filePath, JSON.stringify(preferences, null, 2), err => {
      if (err) {
        return res.status(500).send('Error writing file');
      }

      res.status(200).send('Preference saved');
    });
  });
});

app.get('/get-preferences', (req, res) => {
  const filePath = path.join(__dirname, 'preferences.json');
  
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const preferences = JSON.parse(fileData);
    res.json(preferences);
  });
});

// Route to reset preferences
app.post('/reset-preferences', (req, res) => {
  const filePath = path.join(__dirname, 'preferences.json');
  
  fs.writeFile(filePath, JSON.stringify([]), err => {
    if (err) {
      return res.status(500).send('Error resetting preferences');
    }

    res.status(200).send('Preferences reset');
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

// Initialize the preferences.json file if it does not exist
const filePath = path.join(__dirname, 'preferences.json');
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}
