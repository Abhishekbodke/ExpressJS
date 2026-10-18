
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

app.use(express.json());

// Secret key used to sign and verify JWTs
const JWT_SECRET = "my_secure_jwt_secret_key";

// Sample user
const user = {
    id: 1,
    username: "admin",
    password: "password123"
};

// Sample movie collection
const movies = [
    { id: 1, title: "Interstellar" },
    { id: 2, title: "The Dark Knight" },
    { id: 3, title: "Inception" }
];

// Home route
app.get("/", (req, res) => {
    res.send("JWT Authentication Server Running");
});

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate credentials
    if (
        username !== user.username ||
        password !== user.password
    ) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Generate JWT
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        message: "Login successful",
        token: token
    });
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. Token missing"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Token missing"
        });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid token"
            });
        }

        req.user = decoded;
        next();
    });
}

// Protected movies route
app.get("/movies", authenticateToken, (req, res) => {
    res.status(200).json(movies);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
