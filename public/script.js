// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// The audio for Disco mode: Staying Alive by the Bee Gees
var audio = new Audio(
  "https://cdn.glitch.global/c147efa7-a27c-4b09-b335-0aabcaff90e9/07%20The%20Bee%20Gees%20-%20Stayin'%20Alive.mp3?v=1654153360256"
);
console.log("hello world :o");

// Grab the rows of the override mode, to display them when necessary
const collection = document.getElementsByClassName("row");
var count = collection.length;
for (var i = 0; i < count; i++) {
  collection[i].style.display = "none";
}

// Grab the display text that describes the mode
var display_text = document.getElementById("mode_text");

// Mode: one of eight programmable modes
var mode = -1;

// Last Button: whatever the last button selected was, used for coloring the button borders
var last_button = -1;

// Post message: send a value to the server (either the override or mode number)
function post_message(message, value) {
  let url =
    "https://sudsy-dent-close.glitch.me/" + message + "=" + value.toString();

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  };

  let data = `{added: "piece"}`;

  xhr.send(data);
}

// Takes care of the mode value changing
function button_switch(value) {
  const collection = document.getElementsByClassName("row");
  var count = collection.length;

  // Change the display of the rows of override mode on or off
  // depending on mode selection
  for (var i = 0; i < count; i++) {
    if (value == 3) {
      collection[i].style.display = "flex";
    } else {
      collection[i].style.display = "none";
    }
  }

  // If the mode changed, switch the old button back to green
  if (mode != value && mode != -1) {
    let element = document.getElementById(mode.toString() + "_button");
    element.style.borderColor = "rgb(50, 164, 49)";
  }
  // Switch the new butotn to red and send the new mode
  let element = document.getElementById(value.toString() + "_button");
  element.style.borderColor = "red";
  mode = value;
  post_message("data?mode", mode);
}

// Send the value of the override button
function override_button(value) {
  console.log(value);
  // Toggle the override color: green for the selected one
  if (last_button != value && last_button != -1) {
    let element = document.getElementById("override_" + last_button.toString());
    element.style.borderColor = "red";
  }
  let element = document.getElementById("override_" + value.toString());
  element.style.borderColor = "rgb(50, 164, 49)";
  last_button = value;
  post_message("override?override", value);
}

// Each more and override option calls a general function to send an indexed number to refer to itself.
function simple_mode_click() {
  audio.pause();
  display_text.textContent =
    "This is your average, everyday traffic light. Simple mode will allocate time for both streets to run. When one street is finished, the other gets a turn. In simple mode, pedestrians are able to cross only when the forward go light of the corresponding street is on. This is meant to protect them from oncoming traffic and cars taking left turns.";
  button_switch(0);
}

function machine_learning_mode_click() {
  audio.pause();
  display_text.textContent =
    "Machine Learning Mode takes traffic lights to the next level. The force sensitive resistors embedded into the traffic lanes can tell when certain lanes want to go, as is orchestrated in priority mode. However, Machine Learning Mode can recover from faults - if a weighted plate is shown to be broken, Machine Learning mode will use previous data to allocate which lights should turn on.";
  button_switch(1);
}

function priority_mode_click() {
  audio.pause();
  display_text.textContent =
    "If you are anything like us, you absolutely hate waiting at traffic lights when the other road has no cars coming. It's a waste of time. Priority Mode will cater to routes that actually have cars on them. Priority Mode can tell the difference between the left turn lane and the forward lane, and will always make the decision that prioritizes the most available cars to come through. (Note: Priority Mode may switch to a less desired route to avoid starvation of certain lanes.)";
  button_switch(2);
}

function override_mode_click() {
  audio.pause();
  display_text.textContent =
    "Do you know an estimated 20% of ambulance deaths happen because the emergency vehicle is stuck in traffic (The Nation, 2017)? We have laws directing people to move out of the way of ambulances, but wouldn't it be nice if the emergency dispatcher could force traffic to move? Intersections could be forcibly overriden so that these necessary vehicles get prioritized. Override mode allows the user to pick one of eight lanes and will cut off all other traffic to play that lane.";
  button_switch(3);
}

function night_mode_click() {
  audio.pause();
  display_text.textContent =
    "Night Mode ensures extra safety at intersections at night by increasing the time that all lights are red. This way it ensures all vehicles are through the intersection before a green light is given.";
  button_switch(4);
}

function auto_walking_mode_click() {
  audio.pause();
  display_text.textContent =
    "Safe walking mode protects pedestrians creating periods where only pedestrian walking signals are active. This prevents vehicle movement for the safety of pedestrians, at the cost of run time. It is especially useful for people with mobility impairments, who may not be able to move quickly if a car incorrectly attempts to turn right at the intersection while they are walking.  It is also useful in scenarios with children, say near schools, who can understand walking signs but cannot fully be trusted to judge oncoming traffic.";
  button_switch(5);
}

function broken_mode_click() {
  audio.pause();
  display_text.textContent =
    "Broken mode is a selectable mode which will make the traffic lights signal themselves as a all way stop intersection.  If the system detects a force resistor as broken and it is not in machine learning mode, it will will automatically trigger broken mode to ensure the traffic light still functions. We have included it as an option because waiting for the system to break naturally would be time consuming. The system considers a force sensitive resistor to be broken if its value has not changed for a full day, under the logic that any intersection large enough to have traffic lights would likely see at least one car in each direction over the course of the day. If the value stays the same over that entire time frame, it is likely a stuck-at-fault and should be checked out by the city.";
  button_switch(6);
}

function surprise_mode_click() {
  audio.play();

  display_text.textContent =
    "Lets have a party! Dance to the sound of the all time hit 'Stayin' Alive' by Bee Gees to the flashing of the traffic lights. Disclaimer: We do not actually suggest party to be used as an actual mode of traffic control. It is simply light fun because we had LEDs. Although, if you are having a parade of some sort where the road is blocked off anyway...";
  button_switch(7);
}

function left_turn() {
  override_button(2);
}

function left() {
  override_button(4);
}

function down_turn() {
  override_button(6);
}

function down() {
  override_button(7);
}

function right() {
  override_button(3);
}

function right_turn() {
  override_button(5);
}

function up_turn() {
  override_button(1);
}

function up() {
  override_button(0);
}
