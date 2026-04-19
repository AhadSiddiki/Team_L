-- SpaceSync Resource Allocation System (MySQL DDL)

CREATE DATABASE IF NOT EXISTS spacesync_db;
USE spacesync_db;

-- 1. Create the Resources Table
CREATE TABLE IF NOT EXISTS Resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create the Users Table (To satisfy user_id FK requirement cleanly)
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Create the Bookings Table
-- Demonstrates One-to-Many relationship (One Resource -> Many Bookings)
CREATE TABLE IF NOT EXISTS Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES Resources(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 4. Insert mock data for standard lab names
INSERT INTO Resources (name, type, capacity) VALUES 
('Networking Lab', 'Lab', 50),
('Seminar Library', 'Library', 30),
('Computer Lab 1', 'Lab', 40),
('Multimedia Projector 4K', 'Equipment', 1),
('Conference Hall', 'Room', 100),
('Wajed Miah Science Research Center', 'Lab', 120),
('TSC Auditorium', 'Room', 350),
('Zahir Raihan Auditorium', 'Room', 1000),
('Central Library Interactive Room', 'Library', 50),
('Physics Optics Lab', 'Lab', 35);

-- Insert mock users
INSERT INTO Users (name) VALUES 
('Md. Ahad Siddiki'),
('Shadman Rahman'),
('Abtahi Abid');

-- Mock bookings
INSERT INTO Bookings (resource_id, user_id, booking_date, status) VALUES
(1, 1, '2026-05-10', 'Confirmed'),
(3, 2, '2026-05-12', 'Confirmed');
