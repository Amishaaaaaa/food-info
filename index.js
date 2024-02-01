const express = require("express");

const app = express();

const food_items = [
    {
        "name": "Apple",
        "nutrients": ["vitamin_c", "fiber", "calories"],
        "healthy": "Healthy"
      },
      {
        "name": "Banana",
        "nutrients": ["potassium", "vitamin_b6", "calories"],
        "healthy": "Moderately Healthy"
      },
      {
        "name": "Spinach",
        "nutrients": ["iron", "vitamin_k", "fiber", "calories"],
        "healthy": "Healthy"
      },
      {
        "name": "Cold Drink",
        "nutrients": ["sugar", "calories"],
        "healthy": "Unhealthy"
      },
      {
        "name": "Brown Rice",
        "nutrients": ["fiber", "magnesium", "calories"],
        "healthy": "Healthy"
      },
      {
        "name": "Salmon",
        "nutrients": ["omega_3", "protein", "vitamin_d", "calories"],
        "healthy": "Moderately Healthy"
      }
  ]

let food = []
app.get("/", function(req, res) {
    for(let i = 0; i < food_items.length; i++) {
        food.push(food_items[i].name);
    }

    res.json({
        food
    })
})

app.listen(3000);
