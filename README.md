# Smart Traffic
A server for a 4 way traffic light, complete with traffic signals and weighted plates.

## The Inspiration
On the way into campus, there is a 4 way traffic light that sees an incredible amount of traffic in only two directions. Yet, the traffic light for the other direction lasts as long. The line for the left/right side fills up, even as there is no traffic in the intersection. Clearly, the traffic light was set up to give equal time to each side, regardless of whether that side was actually used.

This is, of course, extremely frustrating to wait in traffic for.  Waiting in traffic for other cars to cross is at least understandable, but waiting for nothing is a waste of gas and time. A better system would weight the amount of time relative to the number of cars. Thus, Smart Traffic was born.

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

