let appointments = [];

// Define a function to read out messages using text-to-speech
function speakMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(speech);
}

// Function to read out user inputs and assistant prompts
function readInputsAndPrompts() {
    const purposeInput = document.getElementById("purpose").value;
    const dateInput = document.getElementById("date").value;
    const startTimeInput = document.getElementById("startTime").value;
    const endTimeInput = document.getElementById("endTime").value;
    const formTitle = document.getElementById("formTitle").innerText;

    // Read out user inputs
    speakMessage("You entered the purpose as " + purposeInput);
    speakMessage("You entered the date as " + dateInput);
    speakMessage("You entered the start time as " + startTimeInput);
    speakMessage("You entered the end time as " + endTimeInput);

    // Read out assistant prompts
    speakMessage("The form title is " + formTitle);
}

function showAppointmentForm(option) {
    const formDiv = document.getElementById("appointmentForm");
    const table = document.getElementById("appointmentTable");
    const formTitle = document.getElementById("formTitle");
    const purposeInput = document.getElementById("purpose");
    const dateInput = document.getElementById("date");
    const startTimeInput = document.getElementById("startTime");
    const endTimeInput = document.getElementById("endTime");

    formDiv.style.display = "block";
    table.style.display = "none";

    switch (option) {
        case 1:
            formTitle.innerText = "Book an Appointment";
            purposeInput.value = "";
            dateInput.value = "";
            startTimeInput.value = "";
            endTimeInput.value = "";
            speakMessage("Please fill in the details to book an appointment. Enter purpose, date, start time, and end time.");
            break;
        case 2:
            formTitle.innerText = "Reschedule an Appointment";
            purposeInput.value = "";
            dateInput.value = "";
            startTimeInput.value = "";
            endTimeInput.value = "";
            speakMessage("Please fill in the details to reschedule an appointment. Enter purpose, date, start time, and end time.");
            break;
        case 3:
            formTitle.innerText = "Show Appointments on a Date";
            purposeInput.style.display = "none";
            startTimeInput.style.display = "none";
            endTimeInput.style.display = "none";
            speakMessage("Please select a date to show appointments.");
            break;
        case 4:
            formDiv.style.display = "none";
            table.style.display = "block";
            displayAppointments();
            speakMessage("Here are the appointments for the selected date.");
            break;
        case 5:
            formDiv.style.display = "none";
            table.style.display = "none";
            speakMessage("Exiting appointment system.");
            break;
    }
}

function submitForm() {
    readInputsAndPrompts();

    const purposeInput = document.getElementById("purpose");
    const dateInput = document.getElementById("date");
    const startTimeInput = document.getElementById("startTime");
    const endTimeInput = document.getElementById("endTime");

    const purpose = purposeInput.value;
    const date = dateInput.value;
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    const appointment = {
        purpose: purpose,
        date: date,
        startTime: startTime,
        endTime: endTime
    };

    // Check if the appointment already exists for the given date and time
    const existingIndex = appointments.findIndex(
        (app) => app.date === appointment.date && app.startTime === appointment.startTime
    );

    if (existingIndex !== -1) {
        // If exists, overwrite the existing appointment
        appointments[existingIndex] = appointment;
        alert("Appointment rescheduled successfully!");
    } else {
        // If not, check for overlapping time slots
        if (isSlotAvailable(appointment)) {
            // If available, add the new appointment
            appointments.push(appointment);
            alert("Appointment booked successfully!");
        } else {
            // If not available, show an alert
            alert("The selected time slot is already booked. Please choose another time slot.");
        }
    }

    return false;
}

function isSlotAvailable(appointment) {
    for (const bookedAppointment of appointments) {
        if (bookedAppointment.date === appointment.date) {
            const bookedStartTime = parseTime(bookedAppointment.startTime);
            const bookedEndTime = parseTime(bookedAppointment.endTime);
            const newStartTime = parseTime(appointment.startTime);
            const newEndTime = parseTime(appointment.endTime);

            if (checkOverlap(bookedStartTime, bookedEndTime, newStartTime, newEndTime)) {
                return false;
            }
        }
    }
    return true;
}

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return {
        hours,
        minutes
    };
}

function checkOverlap(start1, end1, start2, end2) {
    return (
        (start1.hours < end2.hours ||
            (start1.hours === end2.hours && start1.minutes < end2.minutes)) &&
        (end1.hours > start2.hours ||
            (end1.hours === start2.hours && end1.minutes > start2.minutes))
    );
}

function displayAppointments() {
    const table = document.getElementById("appointmentTable");
    table.innerHTML =
        "<tr><th>Date</th><th>Purpose</th><th>TimeSlot</th></tr>";

    for (const appointment of appointments) {
        const row = table.insertRow();
        const dateCell = row.insertCell();
        const purposeCell = row.insertCell();
        const timeSlotCell = row.insertCell();

        dateCell.innerText = appointment.date;
        purposeCell.innerText = appointment.purpose;
        timeSlotCell.innerText = `${appointment.startTime} - ${appointment.endTime}`;
    }
}