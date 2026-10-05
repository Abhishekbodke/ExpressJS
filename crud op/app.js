const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory car inventory
let cars = [
    {
        name: "Ford Aspire",
        id: "A101"
    },
    {
        name: "Ford Ecosport",
        id: "A102"
    },
    {
        name: "Ford Fiesta",
        id: "A103"
    }
];

// GET - Retrieve all cars
app.get("/read", (req, res) => {
    res.json(cars);
});

// POST - Add a new car
app.post("/insert", (req, res) => {
    const car = {
        name: req.body.name,
        id: req.body.id
    };

    cars.push(car);

    res.json(cars);
});

// PUT - Update an existing car
app.put("/update/:id", (req, res) => {
    const id = req.params.id;

    const car = cars.find(car => car.id === id);

    if (car) {
        car.name = req.body.name;
    }

    res.json(cars);
});

// DELETE - Delete a car
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    cars = cars.filter(car => car.id !== id);

    res.json(cars);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});