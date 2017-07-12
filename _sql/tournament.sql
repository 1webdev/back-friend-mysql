/*
SQLyog Ultimate v9.50 
MySQL - 5.5.55-0ubuntu0.14.04.1 : Database - tournament
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`tournament` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `tournament`;

/*Table structure for table `backers` */

DROP TABLE IF EXISTS `backers`;

CREATE TABLE `backers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playerID` int(11) unsigned NOT NULL,
  `backerID` int(11) unsigned NOT NULL,
  `tournamentID` int(11) unsigned NOT NULL,
  `points` int(11) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_backers_to_tournament` (`tournamentID`),
  KEY `FK_backers_to_players` (`playerID`),
  KEY `FK_backers_to_players_backer` (`backerID`),
  CONSTRAINT `FK_backers_to_players` FOREIGN KEY (`playerID`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_backers_to_players_backer` FOREIGN KEY (`backerID`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_backers_to_tournament` FOREIGN KEY (`tournamentID`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `backers` */

insert  into `backers`(`id`,`playerID`,`backerID`,`tournamentID`,`points`,`createdAt`,`updatedAt`,`deletedAt`) values (1,1,2,1,50,'2017-07-12','2017-07-12',NULL),(2,1,3,1,50,'2017-07-12','2017-07-12',NULL),(3,2,3,2,33,'2017-07-12','2017-07-12',NULL),(4,2,4,2,33,'2017-07-12','2017-07-12',NULL);

/*Table structure for table `players` */

DROP TABLE IF EXISTS `players`;

CREATE TABLE `players` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playerId` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT '0',
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `players` */

insert  into `players`(`id`,`playerId`,`points`,`createdAt`,`updatedAt`,`deletedAt`) values (1,'P1',50,'2017-07-12','2017-07-12',NULL),(2,'P2',17,'2017-07-12','2017-07-12',NULL),(3,'P3',17,'2017-07-12','2017-07-12',NULL),(4,'P4',17,'2017-07-12','2017-07-12',NULL),(5,'P5',0,'2017-07-12','2017-07-12',NULL);

/*Table structure for table `players2tournaments` */

DROP TABLE IF EXISTS `players2tournaments`;

CREATE TABLE `players2tournaments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playerID` int(11) unsigned NOT NULL,
  `tournamentID` int(11) unsigned NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_players2tournaments_to_players` (`playerID`),
  KEY `FK_players2tournaments_to_tournaments` (`tournamentID`),
  CONSTRAINT `FK_players2tournaments_to_players` FOREIGN KEY (`playerID`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_players2tournaments_to_tournaments` FOREIGN KEY (`tournamentID`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `players2tournaments` */

insert  into `players2tournaments`(`id`,`playerID`,`tournamentID`,`createdAt`,`updatedAt`,`deletedAt`) values (1,1,1,'2017-07-12','2017-07-12',NULL),(2,4,1,'2017-07-12','2017-07-12',NULL),(3,5,2,'2017-07-12','2017-07-12',NULL),(4,2,2,'2017-07-12','2017-07-12',NULL);

/*Table structure for table `tournaments` */

DROP TABLE IF EXISTS `tournaments`;

CREATE TABLE `tournaments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tournamentId` varchar(255) DEFAULT NULL,
  `deposit` int(11) DEFAULT NULL,
  `status` enum('opened','finished','inProcess') DEFAULT NULL,
  `winnerID` int(11) unsigned DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tournaments_to_players` (`winnerID`),
  CONSTRAINT `FK_tournaments_to_players` FOREIGN KEY (`winnerID`) REFERENCES `players` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `tournaments` */

insert  into `tournaments`(`id`,`tournamentId`,`deposit`,`status`,`winnerID`,`createdAt`,`updatedAt`,`deletedAt`) values (1,'1',150,'finished',1,'2017-07-12','2017-07-12',NULL),(2,'2',100,'opened',NULL,'2017-07-12','2017-07-12',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
