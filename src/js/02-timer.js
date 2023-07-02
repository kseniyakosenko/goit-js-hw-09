import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/dark.css';
// import 'notiflix/dist/notiflix-3.2.6.min.css';

const datePicker = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('button[data-start]');

//Add placeholder in our datePicker(input)
datePicker.setAttribute('placeholder', 'Choose required date');

// Disabled start Button if date is not chosen.
btnStart.setAttribute('disabled', 'disabled');

//Create Button "Reset"
const createBtn = document.createElement('button');
const resetBtn = btnStart.insertAdjacentElement('afterend', createBtn);

resetBtn.textContent = 'Reset';
resetBtn.setAttribute('type', 'button');
resetBtn.setAttribute('data-reset', '');
resetBtn.classList.add('is-hidden');

const options = {
  //   minDate: new Date(),
  enableTime: true,
  time_24hr: true,
  //   defaultDate: new Date(),
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // console.log(selectedDates[0]);
    const currentTime = Date.now();

    // If date chosen correct the Button "Start" become available.
    if (selectedDates[0].getTime() < currentTime) {
      window.alert('Please choose future date!');
    } else {
      btnStart.removeAttribute('disabled');
    }
  },
};

flatpickr('#datetime-picker', options);


const reversTimerComponents = {
  getDays: document.querySelector('span[data-days]'),
  getHours: document.querySelector('span[data-hours]'),
  getMinutes: document.querySelector('span[data-minutes]'),
  getSeconds: document.querySelector('span[data-seconds]'),
};


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Adding zero if amount of figures less then 2.
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

//Creating Functionality of Reveres Timer
btnStart.addEventListener('click', onClickStartReversTimer);

let intervalId = null;

function onClickStartReversTimer() {
  intervalId = setInterval(updateCounter, 1000);

  function updateCounter() {
    let inputDate = new Date(datePicker.value);
    const currentDate = Date.now();
    const deltaTime = inputDate.getTime() - currentDate;
    const deltaTimeObj = convertMs(deltaTime);

    //Test - if value is NaN abort function.
    if (isNaN(inputDate)) {
      window.alert('Please choose future date!');
      clearInterval(intervalId);

      return;
    }

    // Test - if user has chosen past date - abort function.
    if (deltaTime < 0) {
      clearInterval(intervalId);
      resetBtn.classList.add('is-hidden');
      btnStart.classList.remove('is-hidden');
      datePicker.value = '';
      return;
    }

    reversTimerComponents.getDays.textContent = addLeadingZero(
      deltaTimeObj.days
    );
    reversTimerComponents.getHours.textContent = addLeadingZero(
      deltaTimeObj.hours
    );
    reversTimerComponents.getMinutes.textContent = addLeadingZero(
      deltaTimeObj.minutes
    );
    reversTimerComponents.getSeconds.textContent = addLeadingZero(
      deltaTimeObj.seconds
    );

    btnStart.classList.add('is-hidden');
    resetBtn.classList.remove('is-hidden');
  }
}

resetBtn.addEventListener('click', onClickClearInterval);

function onClickClearInterval() {
  //
  clearInterval(intervalId);

  reversTimerComponents.getDays.textContent = '00';
  reversTimerComponents.getHours.textContent = '00';
  reversTimerComponents.getMinutes.textContent = '00';
  reversTimerComponents.getSeconds.textContent = '00';

  datePicker.value = '';

  resetBtn.classList.add('is-hidden');
  btnStart.classList.remove('is-hidden');
}
