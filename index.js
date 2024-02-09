//requirements
const express = require("express");
const zod = require("zod");
const { userExists, generateToken,authenticateUser} = require("./authorization");
const {food_items} = require("./data");

//express app initialize
const app = express();

//zod schema defined
const schema_name_healthy = zod.string();
const schema_nutrients = zod.array(zod.string())

//middleware (for getting json input from body)
app.use(express.json());    


//middlewares
let numberOfRequests = 0;
function calculateRequests(req, res, next) {
    numberOfRequests++;
    console.log("Total requests till now: ",numberOfRequests);
    next();
}

//post for generating token if user exists
app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!userExists(username, password)) {
        return res.status(403).json({
            msg: "user doesn't exist",
        });
    }
    const token = generateToken(username);
    return res.json({
        token,
    });
});


//get route
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

//post route
app.post("/", authenticateUser, calculateRequests, function(req, res) {
    const inputName = req.body.NAME;
    const NAME = schema_name_healthy.safeParse(inputName)

    const inputNutrients = req.body.NUTRIENTS;
    const NUTRIENTS = schema_nutrients.safeParse(inputNutrients)

    const inputHealthy = req.body.HEALTHY;
    const HEALTHY = schema_name_healthy.safeParse(inputHealthy)
    
    //wrong input values handling
    if(!NAME.success || !NUTRIENTS.success || !HEALTHY.success) {
        res.json({
            msg: "invalid input"
        })
    }

    //inserting food item
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

//put route
app.put("/", authenticateUser, calculateRequests, function(req, res) {
    const inputName = req.body.NAME;
    const NAME = schema_name_healthy.safeParse(inputName);

    const inputNutrients = req.body.NUTRIENTS;
    const NUTRIENTS = schema_nutrients.safeParse(inputNutrients);

    const inputHealthy = req.body.HEALTHY;
    const HEALTHY = schema_name_healthy.safeParse(inputHealthy);
    let found = 0;

    //wrong input values handling
    if(!NAME.success && !NUTRIENTS.success && !HEALTHY.success) {
        res.json({
            msg: "invalid input"
        })
    }

    //updation
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

//delete route
app.delete("/", authenticateUser, calculateRequests, function(req, res) {
    let inputName = req.body.NAME;
    const NAME = schema_name_healthy.safeParse(inputName);

    // for wrong input (anything other than string)
    if (!NAME.success) {
        res.json({
            msg: "enter valid item"
        })
    }

    // deletion of fooditem
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

    //if item not found
    if (!itemFound) {
        res.status(404).json({
            error: `Food item '${inputName}' not found`
        });
    }
})


//global catches
//error handling middleware
let errcount = 0;
app.use(function(err, req, res, next) {
    errcount++;
    console.log("error count till now: ",errcount);
    res.json({
        msg: "Something's wrong"
    })
})


//app listening on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
});