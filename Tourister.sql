-- drop database Tourister;
-- show databases;
-- create database Tourister;

use Tourister;

-- Create table Users(
-- 				 UserID  INT NOT NULL AUTO_INCREMENT,
--                  UserName varchar(100) NOT NULL,
--                  UserPassword varchar(16),
--                  UserEmail varchar(100),
--                  SocialNetwork varchar(8),
--                  SocialNetworkID long,
--                  RoleType char(16),
--                  LikedPlaces varchar(5000),
--                  PRIMARY KEY(UserID));
-- 
insert into Users VALUES(Null, "TestUser", "", "", "", 0, "user", "1,3");


-- drop table Places;
 Create table Places(
 		PlaceID INT NOT NULL AUTO_INCREMENT,
         PlaceName varchar(1000) NOT NULL,
         ImageName varchar(100),
         PlaceDescription varchar(5000) NOT NULL,
         Coordinates varchar(1000),
         FollowerCount INT,
         PRIMARY KEY(PlaceID));
         
describe Places;        

select * from places
        
insert into Places VALUES(Null, "Hingol National Park","hingol.jpg", "Pakistan's largest national park located in Balochistan", "unknown", 0);

drop Table UserTrips;
Create table UserTrips(
		TripID INT NOT NULL AUTO_INCREMENT,
        UserID INT NOT NULL,
        UserName varchar(100) NOT NULL,
        PlaceName varchar(1000) NOT NULL,
        ImagePath varchar (2000) NOT NULL,
        TripDescription varchar(5000) NOT NULL,
        Coordinates varchar(1000),
        LikeCount INT,
        PRIMARY KEY(TripID));

describe UserTrips;

select * from Users;

SELECT * FROM Users WHERE useremail='hassanafzal@hotmail.com'
select * from Places;

select * from UserTrips where UserID != 2;

-- delete from UserTrips;
