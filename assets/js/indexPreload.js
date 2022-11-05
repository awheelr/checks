const { ipcRenderer } = require("electron");
const Sequelize = require("sequelize");
const path = require("path");

var sequelize = new Sequelize("database", "austin", "root", {
  host: "0.0.0.0",
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database.sqlite"),
});

var getDaysArray = function (start, end) {
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push({
      date: new Date(dt).toLocaleDateString(),
      month: new Date(dt).toLocaleString("default", { month: "long" }),
      dayOfMonth: new Date(dt).getDate(),
      dayOfWeek: dt.getDay() + 1, // day of week 1 - 7
      day: new Date(dt).toLocaleDateString("default", { weekday: "long" }),
      completed: false,
    });
  }
  return arr;
};

function getFirstDayOfYear(year) {
  return new Date(year, 0, 1);
}
function getLastDayOfYear(year) {
  return new Date(year, 11, 31);
}

const currentYear = new Date().getFullYear();

// Create array for 365 days:
const array = getDaysArray(
  getFirstDayOfYear(currentYear),
  getLastDayOfYear(currentYear)
);
const newArray = array;

const Dates = sequelize.define("dates", {
  listOfDates: Sequelize.JSON,
});

Dates.sync();

async function init() {
  try {
    // Auth to db
    await sequelize.authenticate();

    const datesModel = await Dates;
    let db = await datesModel.findAll();
    db = db[0];

    if (!db) {
      await Dates.create({ listOfDates: newArray });
      console.log("Creating database..");
    }

    if (db) {
      console.log("Database found!", db.listOfDates);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
init();

const loadWeek = async (dt) => {
  try {
    const datesModel = await Dates;
    let db = await datesModel.findAll();
    db = db[0];

    if (db) {
      const dbFindArray = await Dates.findAll(); // holds the database model
      const array = await dbFindArray[0].dataValues.listOfDates; // array saved to database model
      let newArray = await array.map((obj) => ({ ...obj }));
      for (let i = 0; i < dt.length; i++) {
        const dateIndex = await newArray.findIndex(
          (a) => a.date === `${dt[i]}`
        );
        // console.log(newArray[dateIndex].completed);
        if (dateIndex !== -1) {
          if (newArray[dateIndex].completed === true) {
            const thisDay = newArray[dateIndex].day;
            const thisDiv = document.getElementById(`${thisDay.toLowerCase()}`);
            thisDiv.classList.add("day-active");
          }
        }
      }
    }

    if (!db) {
      console.log("Database not found.");
    }
  } catch (err) {
    console.log(`[!] ERROR: ${err}`);
  }
};

async function updateDates(myDate, element) {
  try {
    console.log(myDate);
    const dbFindArray = await Dates.findAll(); // holds the database model
    const array = await dbFindArray[0].dataValues.listOfDates; // array saved to database model
    let newArray = await array.map((obj) => ({ ...obj }));
    const dateIndex = await newArray.findIndex((a) => a.date === `${myDate}`);
    console.log(dateIndex);
    if (dateIndex !== -1) {
      if (newArray[dateIndex].completed === false) {
        // update array completed value
        newArray[dateIndex].completed = true;
        // update db update db with new array
        await Dates.update({ listOfDates: newArray }, { where: { id: 1 } });

        element.classList.add("day-active");

        findDates(myDate); //log changes
      } else if (newArray[dateIndex].completed === true) {
        // update array completed value
        newArray[dateIndex].completed = false;
        // update db with new array
        Dates.update({ listOfDates: newArray }, { where: { id: 1 } });

        element.classList.remove("day-active");

        findDates(myDate);
      }
      ipcRenderer.send("updateDay", myDate);
      console.log(await Dates.findAll());
    }
  } catch (err) {
    console.log(`ERROR! ${err}`);
  }
}

async function findDates(date) {
  try {
    const dbFindArray = await Dates.findAll();
    const array = dbFindArray[0].dataValues.listOfDates;
    const arrayFindDate = array.find((x) => x.date === `${date}`);

    console.log(arrayFindDate);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/* 
  [!] Notes
  finding the current day of week is still troublesome currently
  the problem is that when calling updateDates and inputing: week[0]
  the output would be plus or minus a day so if it was Nov 6 it could
  come out as Nov 5 or Nov 7 in the function. Weird bug so probably
  recode the way i find the current day's date.
*/

function dates() {
  const current = new Date();
  var week = new Array();
  // Starting Monday not Sunday
  current.setDate(current.getDate() - current.getDay());
  for (var i = 0; i < 7; i++) {
    week.push(new Date(current).toLocaleDateString());
    current.setDate(current.getDate() + 1);
  }
  return week;
}

const thisSunday = dates()[0];
const thisMonday = dates()[1];
const thisTuesday = dates()[2];
const thisWednesday = dates()[3];
const thisThursday = dates()[4];
const thisFriday = dates()[5];
const thisSaturday = dates()[6];

window.addEventListener("DOMContentLoaded", () => {
  const currentWeek = dates();
  loadWeek(currentWeek);

  document.getElementById("sunday").addEventListener("click", () => {
    const element = document.getElementById("sunday");
    updateDates(thisSunday, element);
  });

  document.getElementById("monday").addEventListener("click", () => {
    const element = document.getElementById("monday");
    updateDates(thisMonday, element);
  });

  document.getElementById("tuesday").addEventListener("click", () => {
    const element = document.getElementById("tuesday");
    updateDates(thisTuesday, element);
  });

  document.getElementById("wednesday").addEventListener("click", () => {
    const element = document.getElementById("wednesday");
    updateDates(thisWednesday, element);
  });

  document.getElementById("thursday").addEventListener("click", () => {
    const element = document.getElementById("thursday");
    updateDates(thisThursday, element);
  });

  document.getElementById("friday").addEventListener("click", () => {
    const element = document.getElementById("friday");
    updateDates(thisFriday, element);
  });

  document.getElementById("saturday").addEventListener("click", () => {
    const element = document.getElementById("saturday");
    updateDates(thisSaturday, element);
  });

  document.getElementById("menu").addEventListener("click", () => {
    ipcRenderer.send("open-menu-window");
  });
});
