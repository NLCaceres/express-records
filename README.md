# Express - Infection Control Records
Express based site to be used as a REST API backend for health records apps. Currently building out front-facing webapp with Ang2+.

## Future Ideas
- Added health practice routes, and corrected a few mistakes, but this will probably end up being more of an exercise in Express than indication that this project will keep being actively worked on / improved upon.
  - Probably need to delete the help directory. Likely an early attempt to merge angular into this project.
  - Similarly dist/ang-records exists, which was an early attempt to merge angular in, so likely deletion incoming.
- Likely to switch backend to either Django/Flask or Rails. Express is great but definitely feels a bit slow paced, despite its seemingly
endless options. Plus with its stagnant repo, it seems likely to be left behind in the future.
  - Front end may be kept in Ang but if going with Rails, then Inertia could be used to convert the front-end into Svelte (since Svelte's client side routing is currently in beta [as of May 2021])

## Usage

- Had 3 scripts, now just 2 since dotenv requires var expansion, which needs dotenv-expand to work. All setup in config.js for convenience
- The scripts found in package.json are used as following:
  - `npm run start` -> Used by Heroku (their standard web process) after building. Will not react to changes.
  - `npm run devstart` -> Runs nodemon (a node management wrapper) to watch and swap in changes as you develop 
