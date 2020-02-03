# Bravo Hotel
Built with NodeJS and TypeScript.
  - requires NodeJS v12 
  - install: ```npm install```
  - build: ```npm run build```
  - run: ```npm start``` (also executes build)
  - test: ```npm test```
# Retrospective
I could have spent an extra 10 hours with this.

What I'm happy with:
 - Organization: It's structured appropriately for a small API.
 - Build/Configuration: I probably did more here than the scope of the project called for, but it's all very well set up.
 - Functionality: It's ~90% there. 
 - Tech choices: I've become very fond of TypeScript lately, and this was a good opportunity to try using it with Node, which has long been my go-to for prototyping. The results were mostly positive, with very notable exceptions below.

What I'd change if I did it again or had more time:
 - Conceptualization/business logic: My system reserves a specific room for a customer at the time of reservation. It occurred to me much too late that hotels don't actually do this. It'd be preferable to simply ensure enough rooms were available with attributes appropriate to the reservation.
  - A real database: My mock implementation took at least as long and was much more painful than simply setting up an actual db and seeding it with a script.
  - Tech choices: ```moment``` and ```moment-range``` did not play as nicely as I'd have liked with TS and I spent far too long trying to make them get along. It still isn't right. This is my biggest pain point - I would have preferred to deliver something fully functional, even if it meant building it with simpler tech.
  - Functionality: Due to the above issue we're left with limited functionality. Two critical helper methods that handle check-in/check-out times are throwing nondescript runtime errors from deep within the stack, and a lot is breaking because of this.
  - Testing: I only got to unit tests, and I could use more of them, and more passing. I'd like to test the endpoints rather than just the public methods on the service, and I'd like the unit tests to explore more edge cases.

Overall, I think it's a solid result for ~4 hours of work, and I'm looking forward to your feedback.