# RAMS

This project is the frontend implemenation for RAMS - Resource Allocation Management System. This is a part of Insta's technical assessment for Teemu Tannerma.

Frontend and Backend form a MERN stack. MERN stands for MongoDB, Express, Node, React.

# How it works

The app consists of three tabs. Tabs serve following functions:

1. Factory information
- Create factories. Factory name must be unique and there are validations enforcing you to enter a unique name. You must also enter a factory time zone. (Note: Task was to input a IANA timezone identifier,this was not implemented)

- Delete factories

2. Personnel information
- Create personnel. Person must have a name, email and a list of factories where the person can be allocated.
- Delete personnel

3. Reservations
- Create personnel reservations. Reservation includes at least one person, a factory which the person(s) will be allocated, start and end time. The factories where the person can be allocated to are validated. 

(Note: Task was to allow allocating a person to one factory at a time, but this was not implemented.)

Tasks 4. and 5. were not implemented.

# About the project

Frontend implementation for RAMS. Uses React w/ Typescript.

- The project is scaffolded with Vite.
- React with Typescript.
- React compiler (handles memoization automatically. No need to use useMemo, useCallback manually)
- Material UI component library
- Tanstack Query for data fetching and mutations
- Date-fns (mainly for Mui Datepicker locales)
- Prettier w/ my preferred config

# Installation

1. **Clone the repository (https) and go to appropriate directory:**
   ```bash
   git clone https://github.com/ttannerma/rams.git
   cd rams-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:**  
> Make sure you have [Node.js v25](https://nodejs.org/) (or newer) and [npm 11.6.2](https://www.npmjs.com/) or newer  installed.