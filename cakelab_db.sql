-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cakelab_db
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '8fc6105f-ce77-11f0-80d6-0a0027000005:1-189';

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `pickup_date` date NOT NULL,
  `cake_item_string` text NOT NULL,
  `notes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'王小姐','0900000000','2026-01-03','季節水果塔 x 1, 法式草莓千層 x 1 (總計: $458)','無','2026-01-02 09:16:30','2026-01-02 09:16:30'),(2,'徐先生','0909090909','2026-01-04','藍莓生乳酪 x 3, 覆盆子慕斯 x 1 (總計: $490)','要餐具','2026-01-02 09:20:39','2026-01-02 11:34:38'),(3,'許小姐','0918085479','2026-01-17','法式草莓千層 x 1, 季節水果塔 x 1 (總計: $458)','要蠟燭','2026-01-02 11:35:50','2026-01-02 11:35:50');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `description` text,
  `is_featured` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'經典黑森林',128,'img/cake1.png','濃郁巧克力戚風搭配酸甜櫻桃與鮮奶油，德式經典風味。',0,'2026-01-02 08:11:05','2026-01-02 11:34:05'),(2,'法式草莓千層',158,'img/cake2.png','職人手作薄餅堆疊細緻卡士達，每一口都是酸甜草莓香。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(3,'季節水果塔',300,'img/cake3.png','酥脆塔殼盛裝時令鮮甜水果，色彩繽紛的視覺饗宴。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(4,'抹茶歐培拉',110,'img/cake4.png','靜岡抹茶與巧克力層層交織，層次分明、韻味悠長。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(5,'紐約重乳酪',1080,'img/cake5.png','極致濃郁的起司口感，紮實綿密，起司愛好者必點。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(6,'檸檬老奶奶',880,'img/cake6.png','磅蛋糕淋上清新檸檬糖霜，樸實中帶著令人眷戀的酸甜。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(7,'提拉米蘇',115,'img/cake7.png','正統義式風味，浸泡咖啡酒的拇指餅乾與瑪斯卡邦起司。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(8,'藍莓生乳酪',120,'img/cake8.png','嚴選新鮮藍莓熬煮成果醬，與生乳酪交織出夢幻紫色。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(9,'覆盆子慕斯',130,'img/cake9.png','輕盈蓬鬆的慕斯口感，帶有覆盆子獨特的優雅酸感。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(10,'蒙布朗栗子塔',1450,'img/cake10.png','經典法式栗子泥拉花，內裹整顆香甜栗子，層次豐富。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(11,'海鹽焦糖戚風',950,'img/cake11.png','自製鹹甜焦糖醬淋在鬆軟戚風上，口感輕盈不膩口。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(12,'紅絲絨蛋糕',1250,'img/cake12.png','經典美式風味，獨特的微可可香氣與乳酪糖霜完美結合。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(13,'香草卡士達泡芙',450,'img/cake13.png','酥脆外皮爆漿灌入大溪地香草籽卡士達，簡單卻不平凡。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(14,'比利時巧克力塔',1180,'img/cake14.png','使用 70% 苦甜巧克力內餡，濃郁絲滑，巧克力控首選。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(15,'芒果夏洛特',1380,'img/cake15.png','圍繞指形餅乾，中央盛裝大塊新鮮芒果與特製芒果慕斯。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(16,'伯爵茶千層',150,'img/cake16.png','淡淡伯爵茶清香融入奶油內餡，優雅優質的下午茶良伴。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(17,'巴斯克乳酪',990,'img/cake17.png','西班牙焦香風味，外層焦香、中心濕潤如流心般順滑。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(18,'抹茶紅豆捲',780,'img/cake18.png','選用小山園抹茶，軟綿蛋糕體包裹蜜紅豆與抹茶鮮奶油。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(19,'歌劇院蛋糕',1600,'img/cake19.png','杏仁蛋糕、咖啡奶油與巧克力淋面，演繹法式高雅美學。',0,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(20,'可麗露禮盒',680,'img/cake20.png','外層焦脆硬香、內裡 Q 彈多孔，法式傳統「天使之鈴」。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05'),(21,'馬卡龍繽紛組',880,'img/cake21.png','多種經典口味一次擁有，外殼酥脆內餡豐潤的法式浪漫。',1,'2026-01-02 08:11:05','2026-01-02 08:11:05');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-02 19:47:13
