$(document).ready(function() {
  // Date Picker Options
  var datePickerOptions = {
    format: 'mm/dd/yyyy',
    formatSubmit: 'mm/dd/yyyy',
    selectYears: 10,
    selectMonths: true,

    // Accessibility labels
    labelMonthNext: 'Next month',
    labelMonthPrev: 'Previous month',
    labelMonthSelect: 'Select a month',
    labelYearSelect: 'Select a year',

    // Editable input
    editable: true
  }

  // Start Date Picker
  var $inputStartDate = $('#datepicker__start-date').pickadate(datePickerOptions);

  var startDatePicker = $inputStartDate.pickadate('picker');

  $('#datepicker__start-icon').click(function() {
    event.stopPropagation();
    event.preventDefault();
    startDatePicker.open();
  })

  // End Date Picker
  var $inputEndDate = $('#datepicker__end-date').pickadate(datePickerOptions);

  // Use the picker object directly.
  var endDatePicker = $inputEndDate.pickadate('picker');

  $('#datepicker__end-icon').click(function() {
    event.stopPropagation();
    event.preventDefault();
    endDatePicker.open();
  })

  // Time Picker Options
  var timePickerOptions = {
    // Formats
    format: 'HHi',

    // Time intervals
    interval: 60,

    // Editable input
    editable: true
  }

  // Start Time Picker
  var $inputStartTime = $('#timepicker__start-time').pickatime(timePickerOptions);

  var startTimePicker = $inputStartTime.pickatime('picker');

  $('#timepicker__start-icon').click(function() {
    event.stopPropagation();
    event.preventDefault();
    startTimePicker.open();
  })

  // End Time Picker
  var $inputEndTime = $('#timepicker__end-time').pickatime(timePickerOptions);

  var endTimePicker = $inputEndTime.pickatime('picker');

  $('#timepicker__end-icon').click(function() {
    event.stopPropagation();
    event.preventDefault();
    endTimePicker.open();
  })
})