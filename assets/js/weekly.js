// var day = document.getElementsByClassName("day");

// var myFunction = function() {
//     this.classList.add('bg-yellow');
// };

// day.addEventListener('click', myFunction());


const days = document.querySelectorAll('.day');

let i = 0

for (const day of days) {
    day.addEventListener('click', function handleClick() {
        i = i + 1
        day.classList.add('day-active');
        console.log(day.id)
        console.log(i)
    });
}