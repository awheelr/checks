const { writeDb } = require('./dbFunctions')

const obj = {
    monday: ["2", "completed"]
}

writeDb(obj)