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

-- Create table Places(
-- 		PlaceID INT NOT NULL AUTO_INCREMENT,
--         PlaceName varchar(1000) NOT NULL,
--         PlaceDescription varchar(5000) NOT NULL,
--         Coordinates varchar(1000),
--         FollowerCount INT,
--         PRIMARY KEY(PlaceID));
--         
describe Places;        
        
-- insert into Places VALUES(Null, "Monal", "Restuarant and sight seeing spot on Margalla Hills", "unknown", 0);

select * from Users;
select * from Places;