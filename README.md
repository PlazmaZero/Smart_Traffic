# Smart Traffic
A server for a 4 way traffic light, complete with traffic signals and weighted plates. You can see a video and the web interface [here](https://smart-traffic-embedded-systems.glitch.me/). 

## The Inspiration
On the way into campus, there is a 4 way traffic light that sees an incredible amount of traffic in only two directions. Yet, the traffic light for the other direction lasts as long. The line for the left/right side fills up, even as there is no traffic in the intersection. Clearly, the traffic light was set up to give equal time to each side, regardless of whether that side was actually used.

Waiting in traffic for other cars to cross is at least understandable, but waiting for nothing is a waste of gas and time. A better system would weight the amount of time relative to the number of cars.

## The Model
I built a to-scale model in Google Sketch-Up before assembling the model. This allowed me to see problems in building ahead of time and plan out where the wires would go. The .skp and .stl files are available in the repository. The physical model was built with LEDs, Force Sensitive Resistors, TI Launchpads, wires, polymer clay and a lot of cardboard. It can be seen in the video linked above.

## Modes
The different modes represent different ways the traffic light can be used and make up the "smart" portion of smart traffic light.

### Simple Mode
Simple Mode is your everyday traffic light. It allows for traffic to move one way for a set amount of time and then switches in the other direction. It does not take into account the weighted plates at all.

### Machine Learning Mode
Machine Learning Mode does take into account the weighted plates and more. While the weighted plates are active, Machine Learning Mode will accept their data. Machine Learning Mode can use more complicated approach to serving lanes than Simple Mode. For example, one lane can send its left turn and forward at the same time while the other lanes are blocked. Machine Learning Mode will also make sure not to starve any lanes, just in case there are pedestrians who need to cross. Additionally, if the plates are registered as broken, the system will continue to work. Historical data will be used to weight time towards the lanes.

### Priority Mode
Priority Mode is very similar to Machine Learning Mode. However, in Priority Mode, if a weighted plate is registered as broken, the sytem will switch to broken mode. Depending on how often plates are broken or disconnected, this mode may make more sense. If the breaking is rare, showing broken mode will result in quicker recognition of the problem.

### Override Mode
Override Mode is for emergencies, like an ambulance that needs to arrive on the scene. Clicking on override mode will pull up a dashboard, allowing the user to select one lane to turn on. All the others will immediately turn yellow and then red. If one were to imagine the city controller having a whole map of the city, lanes could be turned on and off on a timer to allow desparate hospital cases through. Large cities that have diplomatic visits may also choose to use Override Mode when diplomatic processions come through. Parades would also be able to make use of this feature, as their route can be blocked off.

### Night Mode
Night mode extends the amount of time that all lights in the intersection are red. In real intersections, all lights are made red for some time to lower the chance of collisions by drivers running yellows. However, this time is pretty short because it slows down traffic when no cars are allowed to pass. At night, when visibility is low and the number of cars is smaller, it makes sense to extend this all red time. The increase in safety is worth the cost of slowing down traffic.

### Safe Walking Mode
Some traffic lights operate by allowing pedestrians to cross when cars are moving in the same direction. This can still put pedestrians at risk of cars turning right, but it is efficient because cars and pedestrians are almost always moving through the intersection. An alternative setting is that cars are allowed to go in certain intervals, but pedestrians for the entire intersection also get their own turn. This is ideal for situations where there are more pedestrians than the average American city. For example, Berkeley, CA and New York, NY have some of these types of traffic lights. However, all cities might want to make use of this city every now and then. Saturday fairs, farmer's markets, and parades might be events where the efficient course goes to the sides of pedestrians. By adding safe walking mode as an option, cities can switch certain traffic lights as needed.

### Broken Mode
Broken mode is the red, blinking light set. It signals to drivers and pedestrians to treat the intersection like a stop sign. In "Smart Traffic", it is programmed to come on when a break is registered in the weighted plates. It was added as a option to click so that it could be modelled easily during the competition, without mangling the model or breaking a Force Resistor.

### Surprise Mode
Surprise Mode was made to amuse the judges. Part of the scoring was creativity and a traffic light playing disco music was an amusing concept. At one point, there was a bug that set off all the lights randomly, so it looked like a dance floor. However, disco music and blinking lights might make a fun parade float stop.