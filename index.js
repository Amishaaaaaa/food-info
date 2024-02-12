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


app.post("/signin", async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  console.log("getting in signin: ");
try {
    if (!(await userExists(username, password))) {
      const error = new Error("User doesn't exist");
      error.status = 403;
      throw error;  // Use throw instead of next
    }

    const token = generateToken(username);
    return res.json({
      token,
    });
  } catch (error) {
    if (!res.headersSent) { // Check if headers have been sent
      res.status(error.status || 500).json({
        error: error.message || "Internal Server Error",
      });
    }
  }
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


// global catches
// error handling middleware
let errcount = 0;
app.use(function(err, req, res, next) {
    errcount++;
    console.log("error count till now: ",errcount);
    const status = err.status || 500;
    console.log("error me ghus gaya: ");
    res.status(status).json({
        msg: err.msg || "Something's wrong",
    });
})


//app listening on port 3000
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
});