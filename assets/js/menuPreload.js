const { ipcRenderer } = require("electron");
const Sequelize = require("sequelize");
const path = require("path");

// var sequelize = new Sequelize({
//   logging: false,
//   dialect: "sqlite",
//   storage: path.join(__dirname, "..", "db.sqlite"),
// });

var sequelize = new Sequelize({
  logging: false,
  dialect: "sqlite",
  storage: path.join("assets/db.sqlite"),
});

const Dates = sequelize.define("dates", {
  listOfDates: Sequelize.JSON,
});

window.addEventListener("DOMContentLoaded", async function (event) {
  loadMenu();
});

window.onload = function () {
  smoothScroll();
};

const loadMenu = async () => {
  try {
    const datesModel = await Dates;
    let db = await datesModel.findAll();
    db = db[0];

    if (db) {
      const dbFind = await Dates.findAll();
      const array = await dbFind[0].dataValues.listOfDates;
      const newArray = await array.map((obj) => ({ ...obj }));

      for (let i = 0; i < newArray.length; i++) {
        const isCompleted = newArray[i].completed;
        const thisMonth = newArray[i].month;
        const thisDay = newArray[i].dayOfMonth;
        const thisWeekDay = newArray[i].dayOfWeek;
        const thisDate = newArray[i].date;

        console.log(thisMonth);
        const daysDiv = document.querySelectorAll(`#${thisMonth} > .days`);
        let insert_html = `<div class="day" id="${thisDate}">${thisDay}</div>`;

        if (isCompleted === false) {
          daysDiv[0].insertAdjacentHTML("beforeend", insert_html);
          let thisDiv = document.getElementById(`${thisDate}`);
          if (thisDay === 1)
            thisDiv.style["grid-column-start"] = `${thisWeekDay}`;
        } else if (isCompleted === true) {
          daysDiv[0].insertAdjacentHTML("beforeend", insert_html);
          let thisDiv = document.getElementById(`${thisDate}`);
          thisDiv.classList.add("day-active");
          if (thisDay === 1)
            thisDiv.style["grid-column-start"] = `${thisWeekDay}`;
        }
      }
    }

    if (!db) {
      console.log("Database not found.");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const smoothScroll = () => {
  const target = document.getElementById(`November`);

  target.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

const updateDay = async (dt) => {
  const thisDiv = document.getElementById(`${dt}`);

  if (thisDiv.classList.contains("day-active")) {
    console.log("removing day-active");
    thisDiv.classList.remove("day-active");
  } else {
    console.log("adding day-active");
    thisDiv.classList.add("day-active");
  }
};

ipcRenderer.on("updateDay", function (evt, message) {
  updateDay(message);
  console.log(message);
});

// Removed becuase updateDay seems to solve the problem in a more efficent way.
// ipcRenderer.on("updateMenu", function (evt, message) {
//   updateMenu();
//   console.log(message);
// });
