const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { resolve } = require('path');

const app = express();
const port = 3010;


app.use(express.json());
app.use(express.static('static'));


mongoose.connect('mongodb://localhost:27017/marketplace', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if fields are not empty
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
