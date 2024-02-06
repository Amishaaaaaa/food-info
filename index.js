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

app.use(express.json());    //middleware

let numberOfRequests = 0;
//middlewares
function calculateRequests(req, res, next) {
    numberOfRequests++;
    console.log("Total requests till now: ",numberOfRequests);
    next();
}

let food = []
app.get("/", calculateRequests, function(req, res) {
    food = []
    let totalFoodItems = 0
    for(let i = 0; i < food_items.length; i++) {
        food.push(food_items[i].name);
        totalFoodItems = i+1;
    }

    res.json({
        food, totalFoodItems
    })
})

app.post("/", calculateRequests, function(req, res) {
    const NAME = req.body.NAME;
    const NUTRIENTS = req.body.NUTRIENTS;
    const HEALTHY = req.body.HEALTHY;
    
    if(!NAME && !NUTRIENTS && !HEALTHY) {
        res.json({
            msg: "Give some input"
        })
    }
    else {
        food_items.push({
            name: NAME,
            nutrients: NUTRIENTS,
            healthy: HEALTHY
        })
    
        res.json({
            msg: "New food item added!"
            
        })
    }
    
})

app.put("/", calculateRequests, function(req, res) {
    let { NAME, NUTRIENTS, HEALTHY } = req.body;

    if(!NAME && !NUTRIENTS && !HEALTHY) {
        res.json({
            msg: "give input for update"
        })
    }
    else {
        for(let i = 0; i < food_items.length; i++) {
            if (NAME == food_items[i].name) {
                food_items[i].name = NAME;
                food_items[i].nutrients = NUTRIENTS;
                food_items[i].healthy = HEALTHY;
            }
        }
        res.json({msgg: "updated the required field"});
        console.log(food_items);
    }
})

app.delete("/", calculateRequests, function(req, res) {
    let NAME = req.body.NAME;
    if (!NAME) {
        res.json({
            msg: "enter item to be deleted"
        })
    }
    let itemFound = false;

    for(let i = 0; i < food_items.length; i++) {
        if (NAME == food_items[i].name) {
            const index = food_items.findIndex(item => item.name === NAME);
            if (index !== -1) {
                food_items.splice(index, 1); 
                res.json({
                    msg: `Food item '${NAME}' deleted`
                  });
                  itemFound = true;
            } 
        }
    }

    if (!itemFound) {
        res.status(404).json({
            error: `Food item '${NAME}' not found`
        });
    }
})

let errcount = 0;
//global catches
//error handling middleware
app.use(function(err, req, res, next) {
    errcount++;
    console.log("error count till now: ",errcount);
    res.json({
        msg: "Something's wrong"
    })
})

app.listen(3000);
