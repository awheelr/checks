const days = document.querySelectorAll('.day');

let i = 0

for (const day of days) {
    day.addEventListener('click', function handleClick() {
        if(!day.classList.contains('day-active')) {
            i = i + 1
            day.classList.add('day-active');
            console.log('added')
        } else if (day.classList.contains('day-active')) {
            i = i -1
            day.classList.remove('day-active')
            console.log('removed')
        }
        console.log(day.id)
        console.log(i)
    });
}

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();

var getMonths = function (month, short) {
	// Create month names
	var format = short ? 'short' : 'long';
	var monthNames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (mon) {
		return new Date(year, mon).toLocaleString({}, {month: format});
	});

	// Return month name (or all of them)
    if (typeof month === 'number') {
        return monthNames[(month)]
      }

	return monthNames;
};

const getDaysInMonth = function (year, month) {
    return new Date(year, month, 0).getDate();
  }

const calendar = document.querySelector('.calendar')

for (let month = 0; month <= 11; month++) {
    
    var day = getDaysInMonth(year, month)

    calendar.insertAdjacentHTML("beforeend", `<div class="month">${getMonths(month)}</div> <div class="${getMonths(month)}"></div>`)


    console.log("Loop: " + month)
    console.log("Month: " + getMonths(month))
    console.log("Days: " + getDaysInMonth(year, month))
    console.log("----------")

    for(let num = 0; num <= day; num++) {
        var month_name = document.querySelector(`.${getMonths(month)}`)
        console.log(num)
        var insert_html = `
            <div class="day">${num}</div>
        `
        month_name.insertAdjacentHTML("beforeend", insert_html)
    }

}


// var getDays = function(year, month, )
// console.log(getMonths())
// console.log(getMonths(month, false))

// function getDaysInMonth(year, month) {
//     return new Date(year, month, 0).getDate();
//   }
  
//   const currentYear = date.getFullYear();
//   const currentMonth = date.getMonth() + 1; // 👈️ months are 0-based
  
//   // 👇️ Current Month
//   const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
//   console.log(daysInCurrentMonth);
  
//   // 👇️ Other Months
//   const daysInJanuary = getDaysInMonth(2025, 1);
//   console.log(daysInJanuary); // 👉️ 31
  
//   const daysInSeptember = getDaysInMonth(2025, 9);
//   console.log(daysInSeptember); // 👉️ 30