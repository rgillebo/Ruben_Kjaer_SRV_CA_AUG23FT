const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const participantsRoutes = require('./routes/participants');

const app = express();
app.use(express.json());

app.use('/participants', participantsRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
