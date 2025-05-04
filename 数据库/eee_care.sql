-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: e_care
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_type` varchar(50) NOT NULL,
  `service_content` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `address` text NOT NULL,
  `staff` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,2,'cooking','上门做饭',1,'浙江杭州','3号厨师','2025-04-13 12:18:47'),(3,2,'cooking','上门做饭',4,'湖南长沙','1号厨师','2025-04-13 13:59:14'),(5,2,'companion','找人陪伴',1,'湖南长沙','4号陪伴','2025-04-13 13:59:56'),(6,2,'health','身心健康',2,'湖南岳阳','5号检查','2025-04-13 14:11:05'),(8,2,'companion','找人陪伴',2,'湖南衡阳','3号陪伴','2025-04-14 05:11:46'),(11,2,'companion','找人陪伴',4,'湖南岳阳','5号陪伴','2025-04-14 11:29:06'),(14,2,'cooking','上门做饭',2,'四川','3号厨师','2025-04-14 14:16:34'),(17,2,'cleaning','打扫卫生',3,'深圳市','2号卫生','2025-04-21 13:15:24'),(19,2,'health','身心健康',1,'浙江杭州','3号检查','2025-04-22 12:34:15'),(21,2,'running','跑腿',1,'湖南','3号跑腿','2025-04-28 13:20:34'),(23,2,'cleaning','打扫卫生',3,'浙江杭州','3号卫生','2025-04-29 03:32:26'),(26,2,'running','跑腿',6,'湖南岳阳','5号跑腿','2025-05-02 14:42:54');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_records`
--

DROP TABLE IF EXISTS `health_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `blood_sugar` decimal(5,2) DEFAULT NULL,
  `blood_pressure` varchar(10) DEFAULT NULL,
  `cholesterol` decimal(5,2) DEFAULT NULL,
  `heart_rate` int DEFAULT NULL,
  `vision` varchar(10) DEFAULT NULL,
  `sleep_duration` decimal(4,2) DEFAULT NULL,
  `sleep_quality` enum('优','良','中','差') DEFAULT NULL,
  `recorded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `health_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_records`
--

LOCK TABLES `health_records` WRITE;
/*!40000 ALTER TABLE `health_records` DISABLE KEYS */;
INSERT INTO `health_records` VALUES (1,2,178.00,78.00,23.00,'120/80',7.00,98,'1.0/0.8',10.00,'良','2025-04-12 11:47:52','2025-04-13 08:54:47'),(2,2,178.00,78.00,23.00,'120/80',7.00,98,'1.0/0.8',10.00,'良','2025-04-12 11:47:52','2025-04-13 08:54:47'),(3,2,178.00,67.00,21.00,'120/87',5.00,100,'1.0/0.8',8.00,'良','2025-04-12 11:49:10','2025-04-13 08:54:47'),(11,2,178.00,78.00,19.00,'120/80',6.00,89,'1.0/0.88',9.00,'良','2025-04-13 09:02:47','2025-04-13 09:02:47'),(12,2,178.00,78.00,16.00,'120/80',5.00,89,'1.0/0.88',7.00,'良','2025-04-13 10:08:14','2025-04-13 10:08:14'),(13,2,178.00,67.00,16.00,'120/80',6.00,98,'1.0/0.88',9.00,'中','2025-04-13 10:48:39','2025-04-13 10:48:39'),(14,2,178.00,78.00,23.00,'120/80',6.00,98,'1.0/0.88',6.00,'中','2025-04-13 10:49:11','2025-04-13 10:49:11'),(15,2,178.00,78.00,24.00,'120/80',7.00,100,'1.0/0.88',9.00,'良','2025-04-13 10:49:38','2025-04-13 10:49:38'),(16,2,178.00,78.00,26.00,'120/80',5.00,98,'1.0/0.88',9.00,'良','2025-04-13 10:50:04','2025-04-13 10:50:04'),(17,2,178.00,78.00,25.00,'120/80',5.00,89,'1.0/0.88',9.00,'良','2025-04-14 19:17:18','2025-04-14 19:17:18'),(18,2,178.00,78.00,4.70,'120/80',4.80,98,'1.0/0.88',9.00,'良','2025-04-23 13:36:53','2025-04-23 13:36:53'),(19,2,178.00,67.00,3.20,'120/80',5.60,98,'1.0/0.88',8.00,'良','2025-04-27 12:54:35','2025-04-27 12:54:35'),(20,2,178.00,70.00,3.00,'120/80',5.60,98,'1.0/0.88',9.00,'良','2025-04-27 12:58:12','2025-04-27 12:58:12'),(21,2,178.00,67.00,5.50,'120/80',3.00,98,'1.0/0.88',9.00,'良','2025-04-27 13:28:10','2025-04-27 13:28:10'),(22,2,178.00,67.00,6.80,'120/80',5.60,90,'1.0/0.88',15.00,'中','2025-04-27 13:28:50','2025-04-27 13:28:50'),(23,2,178.00,76.00,6.70,'120/80',5.80,98,'1.0/0.8',9.00,'中','2025-04-27 13:30:57','2025-04-27 13:30:57'),(24,2,178.00,67.00,4.30,'120/80',5.00,98,'1.0/0.8',9.00,'优','2025-04-28 12:05:08','2025-04-28 12:05:08'),(26,2,178.00,67.00,4.50,'120/80',4.70,90,'0.9/0.8',7.00,'中','2025-04-29 03:19:39','2025-04-29 03:19:39'),(27,2,178.00,68.00,2.80,'120/80',5.70,90,'1.0/0.8',8.00,'中','2025-04-29 03:22:06','2025-04-29 03:22:06'),(28,2,178.00,70.00,4.30,'120/80',5.70,89,'0.9/0.8',8.00,'良','2025-04-29 06:06:00','2025-04-29 06:06:00');
/*!40000 ALTER TABLE `health_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication_logs`
--

DROP TABLE IF EXISTS `medication_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medication_id` int NOT NULL,
  `scheduled_time` datetime NOT NULL,
  `actual_time` datetime DEFAULT NULL,
  `status` enum('已服','跳过','未响应') NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medication_id` (`medication_id`),
  CONSTRAINT `medication_logs_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication_logs`
--

LOCK TABLES `medication_logs` WRITE;
/*!40000 ALTER TABLE `medication_logs` DISABLE KEYS */;
INSERT INTO `medication_logs` VALUES (1,5,'2025-05-02 16:40:13','2025-05-03 00:40:15','已服',NULL,'2025-05-02 16:40:14'),(2,5,'2025-05-02 16:40:18',NULL,'跳过',NULL,'2025-05-02 16:40:22'),(3,5,'2025-05-02 16:43:23',NULL,'跳过',NULL,'2025-05-02 16:43:26'),(4,5,'2025-05-03 15:35:26','2025-05-03 23:35:29','已服',NULL,'2025-05-03 15:35:29'),(5,5,'2025-05-03 15:39:16','2025-05-03 23:39:17','已服',NULL,'2025-05-03 15:39:17'),(6,5,'2025-05-03 17:24:27',NULL,'跳过',NULL,'2025-05-03 17:24:31'),(7,5,'2025-05-03 17:24:40',NULL,'跳过',NULL,'2025-05-03 17:24:42'),(8,5,'2025-05-03 20:08:03','2025-05-04 04:08:05','已服',NULL,'2025-05-03 20:08:04'),(9,5,'2025-05-03 20:16:40',NULL,'跳过',NULL,'2025-05-03 20:16:42');
/*!40000 ALTER TABLE `medication_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication_reminders`
--

DROP TABLE IF EXISTS `medication_reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication_reminders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medication_id` int NOT NULL,
  `reminder_type` enum('声音','震动','闪光','组合') NOT NULL,
  `advance_minutes` int DEFAULT '5' COMMENT '提前提醒分钟数',
  `repeat_interval` int DEFAULT '15' COMMENT '重复提醒间隔(分钟)',
  `max_repeats` int DEFAULT '3' COMMENT '最大重复次数',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medication_id` (`medication_id`),
  CONSTRAINT `medication_reminders_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication_reminders`
--

LOCK TABLES `medication_reminders` WRITE;
/*!40000 ALTER TABLE `medication_reminders` DISABLE KEYS */;
INSERT INTO `medication_reminders` VALUES (5,5,'震动',1,15,3,1,'2025-05-02 14:46:16','2025-05-03 20:10:06'),(6,6,'声音',1,15,3,1,'2025-05-02 16:28:51','2025-05-03 16:35:08');
/*!40000 ALTER TABLE `medication_reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medications`
--

DROP TABLE IF EXISTS `medications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `purpose` text,
  `dosage` varchar(50) NOT NULL,
  `frequency` varchar(50) NOT NULL COMMENT '如"每日3次"',
  `times` text COMMENT '具体时间点，如"08:00,12:00,18:00"',
  `method` enum('口服','外用','注射','其他') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `medications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medications`
--

LOCK TABLES `medications` WRITE;
/*!40000 ALTER TABLE `medications` DISABLE KEYS */;
INSERT INTO `medications` VALUES (5,2,'藿香正气水',NULL,'预防中暑','1瓶','每日2次','03:41','口服','2025-04-18','2025-05-03','难吞咽','2025-05-02 14:46:16','2025-05-03 20:16:38'),(6,2,'阿莫西林',NULL,'消炎','2粒','每日3次','02:53','口服','2025-04-25','2025-05-10','','2025-05-02 16:28:51','2025-05-03 18:51:08'),(7,2,'999感冒灵',NULL,'治疗普通感冒','2包','每日3次','08:00，12:00，17:00','口服','2025-05-03','2025-05-14','','2025-05-03 20:18:39','2025-05-03 20:18:39');
/*!40000 ALTER TABLE `medications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_type` varchar(50) NOT NULL,
  `service_content` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `address` text NOT NULL,
  `staff` varchar(100) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,'running','跑腿',3,'湖南长沙','2号跑腿','pending','2025-04-13 12:07:54'),(12,2,'cooking','上门做饭',3,'湖南','3号厨师','pending','2025-04-14 14:05:46'),(23,2,'companion','找人陪伴',2,'武汉湖北','2号陪伴','pending','2025-04-14 16:01:49'),(25,2,'health','身心健康',3,'湖南长沙','3号检查','pending','2025-04-14 19:15:54'),(29,2,'running','跑腿',1,'四川','2号跑腿','pending','2025-04-21 13:21:26'),(41,2,'cleaning','打扫卫生',3,'深圳市','2号卫生','pending','2025-04-21 13:59:05'),(42,2,'cleaning','打扫卫生',3,'深圳市','2号卫生','pending','2025-04-21 13:59:18'),(43,2,'companion','找人陪伴',1,'浙江杭州','2号陪伴','pending','2025-04-21 13:59:52'),(44,2,'cleaning','打扫卫生',1,'深圳市','4号卫生','pending','2025-04-21 13:59:52'),(45,2,'cooking','上门做饭',4,'湖南长沙','1号厨师','pending','2025-04-22 12:33:50'),(46,2,'health','身心健康',1,'浙江杭州','3号检查','pending','2025-04-22 12:34:21'),(47,2,'health','身心健康',2,'湖南岳阳','5号检查','pending','2025-04-22 12:34:21'),(48,2,'health','身心健康',1,'浙江杭州','3号检查','pending','2025-04-22 12:34:24'),(49,2,'health','身心健康',1,'浙江杭州','3号检查','pending','2025-04-22 12:34:24'),(50,2,'running','跑腿',1,'湖南','2号跑腿','pending','2025-04-23 13:13:17'),(51,16,'running','跑腿',2,'湖南衡阳','3号跑腿','pending','2025-04-28 13:19:36'),(54,2,'cleaning','打扫卫生',3,'深圳市','2号卫生','pending','2025-04-29 03:32:05'),(55,2,'running','跑腿',1,'浙江杭州','3号跑腿','pending','2025-05-02 14:43:25'),(56,2,'running','跑腿',6,'湖南岳阳','5号跑腿','pending','2025-05-02 14:43:25'),(57,2,'cleaning','打扫卫生',3,'深圳市','2号卫生','pending','2025-05-02 14:44:12');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_type` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'running','跑腿服务','速度快 / 能力强 / 好说话 / 态度好 / 做事细心',10.00,'图片/1跑腿.png','2025-04-13 11:44:42'),(2,'companion','陪伴服务','提供超高情绪价值 / 积极乐观 / 情商高 / 态度好 / 应变能力强',55.00,'图片/1陪伴.png','2025-04-13 11:44:42'),(3,'cooking','上门做饭','厨艺高 / 态度好 / 绝不浪费 / 不包食材费用 / 可代买食材',35.00,'图片/1厨师.png','2025-04-13 11:44:42'),(4,'cleaning','打扫卫生','完成度高 / 态度好 / 无犯罪历史 / 心理健康 / 自觉带走垃圾',75.00,'图片/1卫生.png','2025-04-13 11:44:42'),(5,'health','身心健康检查','持证上岗 / 检查细致认真 / 能力专业 / 态度好 / 不坑蒙拐骗',120.00,'图片/1健康.png','2025-04-13 11:44:42');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fullName` varchar(50) DEFAULT NULL,
  `gender` enum('男','女','其他') DEFAULT NULL,
  `age` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `hobbies` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'独角兽','19891837373','$2b$10$Pj8IA0oA2M1BIX9UIqCAlO63tKjTymNV0gHyRpC7MYdHjdY6uGNq.',NULL,NULL,NULL,'2025-04-10 13:57:50',NULL),(2,'独角兽','19891872435','$2b$10$WsrbUf8u58./yd1EEpH8YuXUbahWpTDOgcuEyPeG4lCF4Fe4X/Js2','哈哈哈','女',67,'2025-04-10 14:14:04','睡觉'),(10,'叽叽叽叽','18475845455','$2b$10$7Sr7p9xu/ECZ1UMr1rgLXOYQYkaP7ACRV4KUDkRIgdkvTq6djlTxa',NULL,NULL,NULL,'2025-04-12 10:57:07',NULL),(12,'嘿嘿嘿','19894384344','$2b$10$2r0Cc2FywYSj0r4BWSRg1.xZJ.4pM4/qB9WrRopANYnJxmb39DWiO',NULL,NULL,NULL,'2025-04-14 18:20:43',NULL),(14,'嘿嘿嘿','18958945455','$2b$10$DvyEfggqIcwTnUGIoW1eoeBmjbyHjuvVnWqkIzKCLLM4XgI/NIWzy',NULL,NULL,NULL,'2025-04-14 19:18:28',NULL),(16,'秒呵呵','19894398433','$2b$10$UHG7sfj//zPVl.t4tsf9Ne/hsFuKCHY3QZdkQDvS.4ff4VCxGNNe2',NULL,NULL,NULL,'2025-04-28 13:19:19',NULL),(17,'大街小巷','18507406918','$2b$10$0LpqYZeyzydpLj2nwwz6.ev1bo4tBMIybUu0X7Tc3vVz4XAC05FZG','哈哈哈','女',46,'2025-04-29 02:55:04','睡觉'),(18,'嘿嘿嘿','19873624343','$2b$10$g.FCgY8T7eUTybW2.LpnP.jOezHQRhMXQZBRZ3YyvqQ6lJp2wBAli',NULL,NULL,NULL,'2025-05-04 15:52:09',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-05  0:00:57
