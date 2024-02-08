const express = require("express");
const zod = require("zod");
const app = express();

const schema_name_healthy = zod.string();
const schema_nutrients = zod.array(zod.string())

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
    const inputName = req.body.NAME;
    const NAME = schema_name_healthy.safeParse(inputName)

    const inputNutrients = req.body.NUTRIENTS;
    const NUTRIENTS = schema_nutrients.safeParse(inputNutrients)

    const inputHealthy = req.body.HEALTHY;
    const HEALTHY = schema_name_healthy.safeParse(inputHealthy)
    
    if(!NAME.success || !NUTRIENTS.success || !HEALTHY.success) {
        res.json({
            msg: "invalid input"
        })
    }
    else {
        food_items.push({
            name: inputName,
            nutrients: inputNutrients,
            healthy: inputHealthy
        })
    
        res.json({
            msg: "New food item added!"
            
        })
    }
    
})

app.put("/", calculateRequests, function(req, res) {
    const inputName = req.body.NAME;
    const NAME = schema_name_healthy.safeParse(inputName);

    const inputNutrients = req.body.NUTRIENTS;
    const NUTRIENTS = schema_nutrients.safeParse(inputNutrients);

    const inputHealthy = req.body.HEALTHY;
    const HEALTHY = schema_name_healthy.safeParse(inputHealthy);
    let found = 0;
    if(!NAME.success && !NUTRIENTS.success && !HEALTHY.success) {
        res.json({
            msg: "invalid input"
        })
    }
    else {
        for(let i = 0; i < food_items.length; i++) {
            if (inputName == food_items[i].name) {
                found = 1;
                food_items[i].name = inputName;
                food_items[i].nutrients = inputNutrients;
                food_items[i].healthy = inputHealthy;
                
            }
        }
        if (found == 1) {
            res.json({msgg: "updated the required field"});
                console.log(food_items);
        } else {
            res.json({
                msg: "item not found"
            })
        }
    }
})

app.delete("/", calculateRequests, function(req, res) {
    let inputName = req.body.NAME;
    const NAME = schema_name_healthy.safeParse(inputName);
    if (!NAME.success) {
        res.json({
            msg: "enter valid item"
        })
    }
    let itemFound = false;

    for(let i = 0; i < food_items.length; i++) {
        if (inputName == food_items[i].name) {
            const index = food_items.findIndex(item => item.name === inputName);
            if (index !== -1) {
                food_items.splice(index, 1); 
                res.json({
                    msg: `Food item '${inputName}' deleted`
                  });
                  itemFound = true;
            } 
        }
    }

    if (!itemFound) {
        res.status(404).json({
            error: `Food item '${inputName}' not found`
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
