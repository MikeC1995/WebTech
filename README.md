# TripMappr
TripMappr is a web app which allows travellers to share their experiences.
Travellers can create trips, add places to them, and upload their photos to each place.

Currently the "Manage Trips" page has been implemented, which allows users to create this content. Soon, users will be able to view their data on a map and re-live their experiences.

## Stack
This application is built with the MEAN stack:
- MongoDB
- ExpressJS
- AngularJS
- NodeJS

Additionally, I use the following technologies:
- Less CSS
- jQuery
- Grunt (task running, inc. JS linting, less compilation)
- Mocha (server-side testing)
- Amazon Web Services S3 (image storage)
- Heroku (for scalability)

The app is implemented with client-side rendering, and a REST API backend. This will allow me to produce mobile applications which use the same backend.

## Demo
A live demo is available at https://frozen-waters-28070.herokuapp.com/.
I have added some dummy data so you can see how the app works. But by all means try the following out:
- Adding a new trip
- Adding a new place to a trip
- Adding photos to a places (inc. drag-and-drop)
  - [NOTE: photos are not yet auto-resized (coming soon), so uploading hi-res photos will make the app run slow!]
- Selecting and deleting photos
- Deleting a place (right-click for context menu)
- Deleting a trip (right-click for context menu)

I have populated the "Oxford" place on the "Europe 2014" trip with ~500 images (taken from StreetView) to demonstrate infinite scrolling - to save the browser making hundreds of requests for all the images under this place, only a few are loaded, and as the user scrolls, more are loaded 'just-in-time'.

## Coming Soon
- Auto photo resize + thumbnails
- Smooth animations
- User login + SSL
- The map visualisation of the trips + photos... i.e. the exciting bit!
- Continuous test + deployment pipeline
