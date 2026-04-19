# SpaceSync Platform

SpaceSync is a lightweight dashboard built for Jahangirnagar University to manage the booking of departmental resources (like specialized computer labs, libraries, and projectors) cleanly and efficiently.

It was built under a 3 hour hackathon environment utilizing a modern Node.js/Express backend paired with a minimalist React/Vite frontend.

## Team Members & Assigned Roles

- **Backend Lead:** [Md. Ahad Siddiki]
- **Frontend Lead:** [Shadman Rahman]
- **Database and Integration Specialist:** [Abtahi Abid]
- **UI/UX + Testing Lead:** [Md. Mahin]
- **Team Lead:** [Md. Ahad Siddiki]

## Project Structure

Two main folders:

- `/backend`: The Node.js API layer
- `/frontend/client`: The React frontend application

## Setting Up the Project

### Prerequisites

- Make sure you have **Node.js** installed.
- Ensure **MySQL** (XAMPP or native) is running locally.

### Step 1: Database Setup

1. Open your MySQL client (like phpMyAdmin or MySQL shell).
2. Open the file `database.sql` provided at the root of this project.
3. Copy its contents and execute the script.
   - This script creates the `spacesync_db` database.
   - It will create the `Resources` and `Bookings` tables.
   - It inserts relevant mock data.

### Step 2: Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies (Express, Sequelize, MySQL2, Cors):
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
   _The server run on port 5000: `http://localhost:5000`_

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend/client
   ```
2. Install React setup dependencies:
   ```bash
   npm install
   ```
3. Start the React development environment:
   ```bash
   npm run dev
   ```
   _ The server runs on `http://localhost:5173`. Command CTRL+Click the link shown in terminal to open it in your browser!_

## API Endpoints

All endpoints are running locally on port 5000 (`http://localhost:5000/api`).

| Method | URL Path        | Description                                            |
| ------ | --------------- | ------------------------------------------------------ |
| GET    | `/resources`    | Fetch a list of all available resources in the system. |
| POST   | `/resources`    | Create a new resource.                                 |
| GET    | `/bookings`     | Fetch all bookings included with eager-loaded schemas. |
| POST   | `/bookings`     | Create a new booking.                                  |
| DELETE | `/bookings/:id` | Cancel/Delete a specific booking by its ID.            |

## Key Design Philosophies Used

### Nielsen's UX Heuristics

1. **Visibility of System Status**: Loading spinners and indicators during fetches and API posts. Dynamic color coding (Green vs Red) on specific booking callback results.
2. **User Control**: Quick Delete/Cancel feature directly from the UI without reloading. Active "Clear Filters" logic across multiple input sets.
3. **Error Prevention**: Form submit button disabled until all criteria are met. Date Filtering explicitly hides booked resources.
