# 

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 18.2.13.

## Node version

For best results install at least version 20 of Node

## Project setup

* Pull github project: git clone https://github.com/ryanki1/Frische_Luft.git
* Goto project directory: cd Frische_Luft
* Install dependencies: npm install or npm install --legacy-peer-deps

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

Tip: api.service.spec has 2 tests

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

<h1> Fresh Air Application: steps, architecture and challenges </h1>

## (Development) Steps 

* Research public/api endpoints and choose theme
* UI: map and sliding panel
* Heatmap for 1 city
* Autocomplete
* Heatmap for 10 cities
* Normalisation of autocomplete list options: city %% state %% country
* Mapping and normalisation between openstreetmap and airvisual url parameters: city, state and country e.g. Baden-Württemberg -> Baden-Wuerttemberg
* Legend on the map
* Swimlane ngx chart - horizontal barchart configuration

## Architecture
* To improve autocomplete city air selection speed: use cityService cached entry if present in name/value Map
* To improve heatmap display speed: use MapComponent cached entry if present in name/value Map
* Signalling used when city selected to show AppComponent (side-panel) error when city not found or error  
* Signalling used when city selected to show heatmap and update cache in MapComponent
* Heatmap cities represented in 1 layer (cache contents plus new city selection) rather than 1 layer per city to minimize resource use
* Heatmap Layer configuration for meaningful display: Air Index max value reduced (500 -> 150) to show visual heat differences, useful zoom perspective and heat radius to cover city in MapComponent

## Challenges

* Time taken to find a theme of interest from the public/api - also thought about good habit tracker dashboard showing github-like representation of number of puzzles solved in a day 
* Api chosen turned out to be limited, offering only 1 useful endpoint with aqicn pollution index
* Integrating leaflet-heatmap into angular - "@dvina/ngx-leaflet-heat" helped
* Configuring heatlayer attributes to differentiate low pollution cities from high polluters
