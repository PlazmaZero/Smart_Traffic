// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// the global variables to control the mode and override index
var mode = -1;
var override = 0;

// Determine if we are out of the start up phase
var if_start = 0;

// A global var that saves which of the two directions currently has cars
var currently_going = "left/right";

// The base machine learning values
var machine_learning_EWA_down = 5;
var machine_learning_EWA_left = 5;

// The last time the left or right has run
var last_time_left = Date.now();
var last_time_down = Date.now();

// A generic list of letters used to work between them
var letters_list = ["l", "r", "u", "d"];

// The historic weight values used
var priority_counts = {
  l: 0,
  r: 0,
  u: 0,
  d: 0,
};

// The settings that the launchpads send
var launchpad_settings = {
  l: {
    priority_forward: "0",
    priority_left: "0",
    broken: "0",
    done: "0",
    timestamp: [],
  },
  r: {
    priority_forward: "0",
    priority_left: "0",
    broken: "0",
    done: "0",
    timestamp: [],
  },
  u: {
    priority_forward: "0",
    priority_left: "0",
    broken: "0",
    done: "1",
    timestamp: [],
  },
  d: {
    priority_forward: "0",
    priority_left: "0",
    broken: "0",
    done: "1",
    timestamp: [],
  },
};

// The running time of each launchpad
var operation_settings = {
  l: { running: false, both_green: 0, left_green: 0, forward_green: 0 },
  r: { running: false, both_green: 0, left_green: 0, forward_green: 0 },
  u: { running: false, both_green: 0, left_green: 0, forward_green: 0 },
  d: { running: false, both_green: 0, left_green: 0, forward_green: 0 },
};

// A variable to store wheter all launchpads have joined the server
var connected = {
  l: false,
  r: false,
  u: false,
  d: false,
  o: false,
};

// Turn on the specified launchpad by setting its runtimes
// Done = 0 means the launchpad knows it has an instruction to run
function turn_on_light(
  letter,
  both_green_time,
  left_green_time,
  forward_green_time
) {
  operation_settings[letter].running = true;
  operation_settings[letter].both_green = both_green_time;
  operation_settings[letter].left_green = left_green_time;
  operation_settings[letter].forward_green = forward_green_time;
  launchpad_settings[letter].done = "0";
}

// Turn off the specified launchpad
// Turn its done value to 1 (telling it to not run), and set its timing to zero just in case
function turn_off_light(letter) {
  operation_settings[letter].running = false;
  operation_settings[letter].both_green = 0;
  operation_settings[letter].left_green = 0;
  operation_settings[letter].forward_green = 0;
  launchpad_settings[letter].done = "1";
}

// Set the default values of the system
// So that each mode will reset them
function set_defaults() {
  if_start = 0;
  turn_on_light("l", 0, 5, 5);
  turn_on_light("r", 0, 5, 5);
  turn_off_light("u");
  turn_off_light("d");

  connected = {
    l: false,
    r: false,
    u: false,
    d: false,
    all: false,
  };
}

// A short cut function to turn on the direction up/down
function turn_on_up_down() {
  turn_off_light("l");
  turn_off_light("r");
  turn_on_light("u", 0, 5, 5);
  turn_on_light("d", 0, 5, 5);
}

// A short cut function to turn on the direction denoted left/right
function turn_on_left_right() {
  turn_off_light("u");
  turn_off_light("d");
  turn_on_light("l", 0, 5, 5);
  turn_on_light("r", 0, 5, 5);
}

// Turns on the forward and left of only one light
function turn_on_sole_lane(letter) {
  turn_off_light("l");
  turn_off_light("d");
  turn_off_light("r");
  turn_off_light("u");

  turn_on_light(letter, 9, 2, 2);
}

// Turns on both lefts in opposite directions
function turn_on_both_left(letter1, letter2) {
  turn_off_light("l");
  turn_off_light("d");
  turn_off_light("r");
  turn_off_light("u");

  turn_on_light(letter1, 0, 5, 0);
  turn_on_light(letter2, 0, 5, 0);
}

// Turn on just the forwards in opposite directions
function turn_on_both_forward(letter1, letter2) {
  turn_off_light("l");
  turn_off_light("d");
  turn_off_light("r");
  turn_off_light("u");

  turn_on_light(letter1, 0, 0, 5);
  turn_on_light(letter2, 0, 0, 5);
}

// Score that cars are in both lanes in both sides of the same direction
function score_4_lane(letter1, letter2) {
  let count = 0;
  if (launchpad_settings[letter1].priority_forward == "1") {
    count += 1;
  }
  if (launchpad_settings[letter2].priority_forward == "1") {
    count += 1;
  }
  if (launchpad_settings[letter1].priority_left == "1") {
    count += 1;
  }
  if (launchpad_settings[letter2].priority_left == "1") {
    count += 1;
  }
  return count;
}

// Score that one side of the intersection has cars in both lanes
function score_both_lanes(letter) {
  let count = 0;
  if (launchpad_settings[letter].priority_forward == "1") {
    count += 1;
  }
  if (launchpad_settings[letter].priority_left == "1") {
    count += 1;
  }
  return count;
}

// Figure out which possible movement allows for the highest number of cars to pass
function Priority_Mode() {
  let best_score = 0;
  let scores = [];
  // There are two ways that 4 lanes get serviced
  scores.push(score_4_lane("l", "r"));
  scores.push(score_4_lane("u", "d"));

  // There are six ways to server 2 lanes
  scores.push(score_both_lanes("r"));
  scores.push(score_both_lanes("l"));
  scores.push(score_both_lanes("u"));
  scores.push(score_both_lanes("d"));

  // There are eight ways for one way to be serviced
  if (launchpad_settings["r"].priority_left == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }
  if (launchpad_settings["l"].priority_left == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }
  if (launchpad_settings["u"].priority_left == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }
  if (launchpad_settings["d"].priority_left == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }
  if (launchpad_settings["r"].priority_forward == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }
  if (launchpad_settings["l"].priority_forward == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }
  if (launchpad_settings["u"].priority_forward == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }
  if (launchpad_settings["d"].priority_forward == "1") {
    scores.push(1);
  } else {
    scores.push(0);
  }

  // Find the highest ranked options
  let max = -1;
  let max_list = [];

  for (let i = 0; i < 14; i++) {
    if (scores[i] > max) {
      max_list = [i];
      max = scores[i];
    } else if (scores[i] == max) {
      max_list.push(i);
    }
  }
  //Choose randomly from the max list
  let item = max_list[Math.floor(Math.random() * max_list.length)];
  if (item == 0) {
    turn_on_left_right();
  } else if (item == 1) {
    turn_on_up_down();
  } else if (item == 2) {
    turn_on_sole_lane("l");
  } else if (item == 3) {
    turn_on_sole_lane("r");
  } else if (item == 4) {
    turn_on_sole_lane("d");
  } else if (item == 5) {
    turn_on_sole_lane("u");
  } else if (item == 6 || item == 7) {
    turn_on_both_left("r", "l");
  } else if (item == 8 || item == 9) {
    turn_on_both_left("u", "d");
  } else if (item == 10 || item == 11) {
    turn_on_both_forward("r", "l");
  } else if (item == 12 || item == 13) {
    turn_on_both_forward("u", "d");
  }
}

function Machine_Learning_Mode() {
  // If all the launchpads are working, collect data in priority mode
  if (launchpad_settings["r"].broken != "1") {
    Priority_Mode();
  } else {
    // assign weights based on the priority scores
    let left_right_score = priority_counts["l"] + priority_counts["r"];
    let up_down_score = priority_counts["u"] + priority_counts["d"];
    let total_score = left_right_score + up_down_score;

    let left_right_weight = 5;
    let up_down_weight = 5;

    // If there is no previous data, default to equal space
    if (total_score != 0) {
      // calculate the percentage that each run should last
      let left_right_percentage =
        left_right_score / (left_right_score + up_down_score);

      // create a max of 90% of the time and a min of 10% of the time
      left_right_weight = Math.min(
        Math.max(Math.floor(left_right_percentage * 10), 1),
        9
      ); // Keep values within 1, 9 to prevent starvation
      up_down_weight = 10 - left_right_weight;
    }

    // Run the tradeoff between left and right using these values
    if (
      currently_going == "left/right" &&
      launchpad_settings["l"].done == "1" &&
      launchpad_settings["r"].done == "1"
    ) {
      currently_going = "up/down";

      turn_off_light("l");
      turn_off_light("r");
      turn_on_light("u", 0, up_down_weight, up_down_weight);
      turn_on_light("d", 0, up_down_weight, up_down_weight);

    } else if (
      currently_going == "up/down" &&
      launchpad_settings["u"].done == "1" &&
      launchpad_settings["d"].done == "1"
    ) {
      currently_going = "left/right";

      turn_off_light("u");
      turn_off_light("d");
      turn_on_light("l", 0, left_right_weight, left_right_weight);
      turn_on_light("r", 0, left_right_weight, left_right_weight);
    }
  }
}

// Override all other lights and set the one we want to on
function Override_Mode() {
  //Take whatever the override variable is and turn that on
  turn_off_light("r");
  turn_off_light("l");
  turn_off_light("u");
  turn_off_light("d");

  // take the override number and match it exactly who to turn back on
  if (override == 0) {
    turn_on_light("d", 0, 0, 5);
  } else if (override == 1) {
    turn_on_light("d", 0, 5, 0);
  } else if (override == 2) {
    turn_on_light("r", 0, 5, 0);
  } else if (override == 3) {
    turn_on_light("l", 0, 0, 5);
  } else if (override == 4) {
    turn_on_light("r", 0, 0, 5);
  } else if (override == 5) {
    turn_on_light("l", 0, 5, 0);
  } else if (override == 6) {
    turn_on_light("u", 0, 5, 0);
  } else if (override == 7) {
    turn_on_light("u", 0, 0, 5);
  }
}

// Recalculate the current modes based on new information from a launchpad
function calculate_variables() {
  // If all the launchpads are connected, allow them to start
  if (
    connected["l"] == true &&
    connected["r"] == true &&
    connected["u"] == true &&
    connected["d"] == true
  ) {
    if_start = "1";
  }

  // These modes are controlled by the launchpad, so give a generic back and forth
  if (mode == 0 || mode == 4 || mode == 5) {
    if (
      currently_going == "left/right" &&
      launchpad_settings["l"].done == "1" &&
      launchpad_settings["r"].done == "1"
    ) {
      currently_going = "up/down";
      turn_on_up_down();
    } else if (
      currently_going == "up/down" &&
      launchpad_settings["u"].done == "1" &&
      launchpad_settings["d"].done == "1"
    ) {
      currently_going = "left/right";
      turn_on_left_right();
    }
  } else if (mode == 1) {
    Machine_Learning_Mode();
  } else if (mode == 2) {
    Priority_Mode();
  } else if (mode == 3) {
    Override_Mode();
  } else if (mode == 6 || mode == 7) {
    // These modes ignore the server settings, so just tell the launchpads they can run
    operation_settings["l"].done = "0";
    operation_settings["r"].done = "0";
    operation_settings["u"].done = "0";
    operation_settings["d"].done = "0";
  }
}

// Build the string to inform the launchpad of its run time
function build_string(letter) {
  let str = "";
  str += operation_settings[letter].both_green;
  str += operation_settings[letter].left_green;
  str += operation_settings[letter].forward_green;
  str += mode;
  str += launchpad_settings[letter].broken;
  str += if_start;
  str += launchpad_settings[letter].done;
  return str;
}

// Get the information for each launchpad
// Use a query parameter to denote the launchpad letter
app.get("/r", (request, response) => {
  let url = request.url;
  let equal_index = url.indexOf("=");
  let letter = url.charAt(equal_index + 1);
  response.json({ data: build_string(letter) });
});

app.post("/", (request, response) => {});

// Mode update from the client side
app.post("/data", (request, response) => {
  let url = request.url;
  let equal_index = url.indexOf("=");
  let parameter = url.substring(equal_index + 1, url.length);
  if (parameter != mode) {
    mode = parameter;
    set_defaults(mode);
  }
});

// Override setting from the client side
app.post("/override", (request, response) => {
  let url = request.url;
  let equal_index = url.indexOf("=");
  let parameter = url.substring(equal_index + 1, url.length);
  override = parameter;
  calculate_variables();
});

// Launchpad update for the launchpads stored parameters
app.post("/launchpad", (request, response) => {
  let url = request.url;
  let equal_index = url.indexOf("=");

  //Extract the information from the query parameter
  let letter = url.charAt(equal_index - 1);
  let priority1 = url.charAt(equal_index + 1);
  let priority2 = url.charAt(equal_index + 2);
  let broken = url.charAt(equal_index + 3);
  let done = url.charAt(equal_index + 4);
  let timestamp = Date.now();

  // The prioritys should be updated straight
  launchpad_settings[letter].priority_forward = priority1;
  launchpad_settings[letter].priority_left = priority2;

  // If the launchpad finished its last instruction, set it
  // back to done with no time
  if (done == "1") {
    launchpad_settings[letter].done = done;
    operation_settings[letter].running = false;
    operation_settings[letter].both_green = 0;
    operation_settings[letter].forward_green = 0;
    operation_settings[letter].left_green = 0;
  }

  // If any launchpad is broken, information the others the system is broken
  if (broken == "1") {
    launchpad_settings["l"].broken = "1";
    launchpad_settings["r"].broken = "1";
    launchpad_settings["u"].broken = "1";
    launchpad_settings["d"].broken = "1";

    // If the mode is not Machine Learning (which has recovery for broken)
    // switch to the broken mode
    if (mode != 1) {
      mode = 6;
    }
  }

  // Store historic data about how many cars their were
  if (launchpad_settings[letter].broken != "1") {
    if (launchpad_settings[letter].priority_forward == "1") {
      priority_counts[letter] += 1;
    }
    if (launchpad_settings[letter].priority_left == "1") {
      priority_counts[letter] += 1;
    }
  }

  // Store the time the last update happens
  launchpad_settings[letter].timestamp.push(timestamp);
  connected[letter] = true;
  calculate_variables();
  response.json(connected[letter]);
});
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
