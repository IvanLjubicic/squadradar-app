CREATE TABLE IF NOT EXISTS incidents (id INTEGER PRIMARY KEY AUTOINCREMENT, people_number_estimate INTEGER, latitude TEXT, longitude TEXT, tstamp DATETIME DEFAULT (strftime('%d.%m.%Y %H:%M:%S', 'now', 'localtime')), comment TEXT );
--INSERT OR IGNORE INTO incidents (people_number_estimate, latitude, longitude, comment) VALUES (10, "45.791186", "15.939993", "People, get serious");
--INSERT OR IGNORE INTO incidents (people_number_estimate, latitude, longitude, comment) VALUES (20, "45.784201", "15.936108", "Nice day but to many people around");
--INSERT OR IGNORE INTO incidents (people_number_estimate, latitude, longitude, comment) VALUES (50, "45.795455", "15.917740", "You should watch yourself a bit");
