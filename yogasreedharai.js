// Define the displayMessage function
function displayMessage(message) {
    let chatOutput = document.getElementById('chat-output');
    chatOutput.innerHTML += '<div>' + message + '</div>';
    chatOutput.scrollTop = chatOutput.scrollHeight;

    // Read out the message using text-to-speech
    speakMessage(message);
}

// Function to speak out the message using text-to-speech
function speakMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(speech);
}

let calendar = new Map();

function handleUserInput() {
    let userInput = document.getElementById('user-input').value.trim();
    document.getElementById('user-input').value = '';

    if (!userInput) {
        return;
    }

    displayMessage('User: ' + userInput);

    if (userInput.toLowerCase().includes('hi')) {
        greetUser();
    } else if (userInput.toLowerCase().includes("book appointment")) {
        askForAppointmentPurpose();
    } else {
        displayMessage("Assistant: I'm sorry, I didn't understand that.");
    }
}

function greetUser() {
    displayMessage("Assistant: Hello! How are you, sir? How can I help you?");
}

function askForAppointmentPurpose() {
    displayMessage("Assistant: Sure, give me 2 min to check the planner. May I know the purpose of the appointment?");

    // Simulating asynchronous behavior with setTimeout
    setTimeout(function() {
        let purpose = prompt("Answer: ");
        if (purpose) {
            displayMessage("User: " + purpose);
            if (purpose.toLowerCase().includes('cricket match scheduled')) {
                displayMessage("Assistant: Checking the planner for a cricket match slot...");
            }
            askForDate("Assistant: Great! Please provide the date for the appointment (YYYY-MM-DD):", function(date) {
                handleUserInputForAppointment(purpose, date);
            });
        } else {
            displayMessage("Assistant: Operation canceled.");
        }
    }, 2000);
}

function handleUserInputForAppointment(purpose, date) {
    // Check if the date is in the past
    let today = new Date().toISOString().split('T')[0];
    if (date < today) {
        displayMessage("Assistant: The date you provided is in the past. Please provide a valid future date.");
        return;
    }

    // Check if the person is free on the given date
    if (calendar.has(date)) {
        displayMessage("Assistant: Sorry, there's already an appointment scheduled for that day. Boss is busy with prior commitments. Please try to book another slot.");
        return;
    }

    // Additional scenarios based on the purpose
    let response = getResponseForDateAndPurpose(date, purpose);

    displayMessage(response);
}

function askForDate(promptMessage, callback) {
    let date = prompt(promptMessage);

    if (!date) {
        displayMessage("Assistant: Operation canceled.");
        return;
    }

    callback(date);
}

function getResponseForDateAndPurpose(date, purpose) {
    let response = "Assistant: I'm sorry, I didn't understand that.";

    if (purpose.toLowerCase().includes('cricket match scheduled')) {
        response = "Assistant: Wait, I'm checking the slot for your time. If there's any clash, I'll let you know.";
    }

    // Other scenarios based on purpose and date
    else if (purpose.toLowerCase().includes('play cricket')) {
        response = "Assistant: Sure, your cricket match is scheduled for " + date + ".";
    } else if (purpose.toLowerCase().includes('art exhibition')) {
        response = "Assistant: Art exhibition plan successfully made for " + date + ".";
    } else if (purpose.toLowerCase().includes('book club')) {
        response = "Assistant: Book club meeting scheduled for " + date + ".";
    } else if (purpose.toLowerCase().includes('coffee break')) {
        response = "Assistant: Coffee break scheduled for " + date + ".";
    } else if (purpose.toLowerCase().includes('haircut day')) {
        response = "Assistant: Haircut day scheduled for " + date + ".";
    } else if (purpose.toLowerCase().includes('team-building event')) {
        response = "Assistant: Team-building event scheduled for " + date + ".";
    } else if (purpose.toLowerCase().includes('lunch outing')) {
        response = "Assistant: Lunch outing planned for " + date + ".";
    } else if (purpose.toLowerCase().includes('movie night')) {
        response = "Assistant: Movie night planned for " + date + ".";
    } else if (purpose.toLowerCase().includes('fitness challenge')) {
        response = "Assistant: Fitness challenge scheduled for " + date + ".";
    } else if (purpose.toLowerCase().includes('shopping')) {
        response = "Assistant: Shopping day planned for " + date + ".";
    } else if (purpose.toLowerCase().includes('birthday party')) {
        response = "Assistant: Birthday party successfully planned for " + date + ".";
    } else if (purpose.toLowerCase().includes('business meeting')) {
        response = "Assistant: Let me check the schedule for a business meeting on " + date + "...";

        // Simulate random scheduling behavior
        setTimeout(function() {
            if (Math.random() < 0.3) {
                // 50% chance of scheduling the meeting
                if (calendar.has(date)) {
                    response = "Assistant: Sorry, there's already an appointment scheduled for that day. Boss is busy with prior commitments. Please try to book another slot.";
                } else {
                    calendar.set(date, purpose);
                    response = "Assistant: Business meeting successfully scheduled for " + date + ".";
                }
            } else {
                // 50% chance of not scheduling the meeting
                response = "Assistant: Sorry, my boss is busy with other commitments on " + date + ". Unable to schedule the business meeting.";
            }
            displayMessage(response);
        }, 2000);
    }

    return response;
}