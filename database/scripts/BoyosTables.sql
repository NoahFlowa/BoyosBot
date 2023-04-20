DROP TABLE sys.cowboyIndianWar;

CREATE TABLE sys.cowboyIndianWar (
	ID int NOT NULL auto_increment PRIMARY KEY,
    faction VARCHAR(26),
    points int NOT NULL DEFAULT 0
)

SELECT *
FROM sys.cowboyIndianWar;

INSERT INTO sys.cowboyIndianWar (faction, points)
VALUES ("Cowboys", 0);

ALTER TABLE sys.cowboyIndianWar
ADD lastUser int NOT NULL DEFAULT 0,
ADD dateTimeStamp DATE;

ALTER TABLE sys.cowboyIndianWar
MODIFY lastUser VARCHAR(128) NOT NULL;

UPDATE sys.cowboyIndianWar
SET points = 0
WHERE faction = "cowboys";

UPDATE sys.cowboyIndianWar
SET points = 0,
	lastUser = "Noaho";



CREATE TABLE IF NOT EXISTS sys.featureRequests (
    requestID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    request TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy VARCHAR(255) NOT NULL,
    PRIMARY KEY (requestID)
  );

CREATE TABLE IF NOT EXISTS sys.botErrorLogs (
	errorID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    errorMessage TEXT NOT NULL,
    errorLocation VARCHAR(255) NOT NULL,
    encounteredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    encounteredBy VARCHAR(255) NOT NULL,
    PRIMARY KEY (errorID)
);

CREATE TABLE IF NOT EXISTS sys.gameServers (
	gameServerID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    serverGame VARCHAR(255) NOT NULL,
    serverName VARCHAR(255) NOT NULL,
    serverIP VARCHAR(255) NOT NULL,
    serverPort VARCHAR(255) NOT NULL,
    serverPassword VARCHAR(255) NOT NULL,
    createdBy VARCHAR(255) NOT NULL,
    PRIMARY KEY (gameServerID)
);

CREATE TABLE IF NOT EXISTS sys.Permissions (
	permissionID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    permissionLabel VARCHAR(255) NOT NULL,
    permissionDescription VARCHAR(255) NOT NULL,
    permissionColor VARCHAR(255) NOT NULL,
    PRIMARY KEY (permissionID)
);

CREATE TABLE IF NOT EXISTS sys.Users (
	userID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    discordUserName VARCHAR(255),
    discordUserID VARCHAR(255),
    permissionID INT UNSIGNED NOT NULL,
    PRIMARY KEY (userID),
    FOREIGN KEY (permissionID) REFERENCES Permissions(permissionID)
);

DROP TABLE sys.cowboyindian;

CREATE TABLE IF NOT EXISTS sys.cowboyindian (
    teamID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    teamName VARCHAR(255) NOT NULL,
    teamPoints INT NOT NULL,
    teamLastUser VARCHAR(255) NOT NULL,
    teamLastUserDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (teamID)
);


SELECT *
FROM sys.featureRequests

SELECT *
FROM sys.botErrorLogs

SELECT *
FROM sys.gameServers

SELECT *
FROM sys.Permissions

SELECT *
FROM sys.Users

SELECT *
FROM sys.Users u
INNER JOIN sys.Permissions p ON p.permissionID = u.permissionID


INSERT INTO sys.Permissions (permissionLabel, permissionDescription, permissionColor)
VALUES ('Admin', 'This permission is reserved for NoahFlowa', '0x22c2fc');

INSERT INTO sys.Users (name, discordUserName, discordUserID, permissionID)
VALUES('NoahFlowa', '@NoahFlowa', '215624149597421568', 1);