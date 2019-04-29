const express = require('express');
const cors = require('cors');
const app = express();

// allow cross-origin requests
app.use(cors());

// Bodyparser Middleware
app.use(express.json());
require('./routes/email')(app);
require('./routes/homePage')(app);
require('./routes/workHist')(app);
require('./routes/projects')(app);
require('./routes/skills')(app);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));