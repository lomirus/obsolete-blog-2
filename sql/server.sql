-- MySQL dump 10.14  Distrib 5.5.68-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: server
-- ------------------------------------------------------
-- Server version	5.5.68-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `blog_id` bigint(20) NOT NULL,
  `content` varchar(4096) NOT NULL,
  `time` datetime NOT NULL,
  `username` varchar(64) NOT NULL,
  `avatar_url` varchar(1024) NOT NULL,
  `likes` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,7,'貌似 html5 的 notification 在非 https 的情况无法显示...','2020-12-13 21:13:53','Admin','https://pic1.zhimg.com/v2-73868f138ce31170fcf8a84ea73ba9d2_b.jpg',1),(2,7,'整了个 https，测试一下能不能正常使用 notification','2020-12-14 23:33:51','Admin','https://pic1.zhimg.com/v2-73868f138ce31170fcf8a84ea73ba9d2_b.jpg',0),(3,9,'sofa','2021-01-01 09:51:57','Anonymous','https://anonym.ink/statics/images/default.jpeg',67),(4,1,'Mobile test','2021-01-01 16:01:47','Anonymous','https://anonym.ink/statics/images/default.jpeg',0),(5,1,'Mobile test','2021-01-01 16:02:39','Anonymous','https://anonym.ink/statics/images/default.jpeg',0),(6,1,'Mobile test','2021-01-01 16:02:52','Anonymous','https://anonym.ink/statics/images/default.jpeg',0),(7,9,'好耶','2021-01-01 23:58:21','假装自己是 xxj','http://q1.qlogo.cn/g?b=qq&nk=735268835&s=100',17),(8,9,'','2021-01-02 16:20:43','鑫宝','https://anonym.ink/statics/images/default.jpeg',0),(9,9,'','2021-01-02 16:20:47','鑫宝','https://anonym.ink/statics/images/default.jpeg',1),(14,9,'懂了，这就增加后端对评论的二次检测','2021-01-02 17:06:07','Administrator','https://blogblogg.oss-cn-chengdu.aliyuncs.com/lljj.png',6),(15,8,'露姐勇敢飞，迷弟永相随~','2021-01-13 22:10:31','迷弟01','https://blogblogg.oss-cn-chengdu.aliyuncs.com/me.jpg',9),(16,1,'ori yyds','2021-01-13 22:11:31','迷弟01','https://blogblogg.oss-cn-chengdu.aliyuncs.com/me.jpg',6);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` mediumtext,
  `note_time` datetime NOT NULL,
  `note_addr` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (1,'Hello World','2020-12-14 20:31:26','重庆南岸'),(2,'今天才了解到 CSS 媒体查询这东西，突然感觉之前用 JS 写的响应式布局又得重写了qaq...?','2020-12-17 15:09:44','重庆南岸'),(3,'火狐浏览器就离谱，像素居然还能是小数...是小数也就罢了，关键是 JS 和 CSS 的处理方式还不一样：JS会把像素四舍五入，而CSS则会直接用小数判断，搞得我刚才写响应式布局判断临界值时差点要死?','2020-12-17 20:06:50','重庆南岸'),(4,'今天才刚知道之前一直记了这么久的“無駄人間”的正确写法其实是“駄目人間”才对?','2020-12-18 23:29:44','重庆南岸'),(5,'花了大半个月可算给备完案了...（不过公安那边好像还没怎么弄完','2020-12-30 13:43:39','重庆南岸'),(6,'我是废物','2020-12-30 20:22:35','?'),(7,'又被自闭到了...突然去想自己写博客的意义到底是什么，感觉写过的都是些凑字的文章，丝毫没有营养。可能是最近代码写多了吧，又开始怀念文史语了，又去想回到之前继续学习一门语言 -- 争取寒假学会大小舌音吧。话说这篇文章思绪也真是有够乱的，不过也正常，因为我脑子现在也的确挺乱的，毕竟这不也正是这个地方的存在意义所在吗？?今晚本来想复习点高数来着，结果心情太烦，愣是颓了一晚。可能还是因为自己太菜了吧...wiki上查到德文的 leidenschaft 不过是 passion，和我心中长久所预想的也不太一样。就在咫尺而素不相识的一个人死去了，其实这种事也不过是一直在重复而已，为何要去关心呢，毕竟苦难的人实在太多。不过绕了一圈，又跳到了 political depression。不知道我的 depression 是不是也是周期性的。又想起了小时的奇妙感觉，一种是忽然感到胸中似乎突然有着莫名的苦闷；另一者我无法描述，因为我已经忘记了，但是每当想起它就会联系到翻书时的沙沙声，却又有一种吃过槟榔后的梗塞感。人脑的思维方式也真是奇怪，明明已经全然忘记它是什么，只犹然记得几个零星毫不相干的关键词，却依然能记得它曾存在过。对于第二个感觉，我对它第一次的感受似乎就是曾经有过这种感受的感受（挺绕口的）。算了，就写到这儿吧 -- 任思维翩迁，终究还是要回到鸡毛蒜皮与柴米油盐。尽管经年之后，如果我还能看到这个，也许还会有些许的悸动。可当时写完这个后的我转身去补高数这种事，我还会有什么印象吗，恐怕唯一的感触便是讽刺吧...','2020-12-30 22:32:01','?'),(8,'每当心情不好时，就总会去想一些很遥远的东西，仿佛这样就能暂时的解脱。刚刚听到了不知从哪儿传来的音乐，又让我想起了  To the moon （尽管我至今没有玩过这款游戏）。其实我在很久以前至今就一直想开发一款游戏，前后接触过 Unreal, Unity, Cocos Creator, Godot, 但最终也没有掌握其中任何一个，也可能是我过于三心二意了吧。说来也巧，前段时间本来想做一款唯美风格的 3D 游戏，本来都和几个朋友约定好了，我做程序，谁谁谁做建模，谁谁谁负责策划。但当我查资料时却发现当时偶然一瞥到的 Journey 却与我的设想近乎神似。 Honestly, 我之前只是仅仅听说过 Journey 与陈星汉的大名，而对这款游戏一无所知。但是巧合的是，游戏的起点都是沙漠，终点又都是雪山，余者暂不于此一一具言。实际上，我之所以选择雪山，只是因为曾经的一场梦而已。但仔细想想，终年冰封而又弥漫着一层梦幻氛围的皑皑雪山，对于朝圣者来说，其实是一个过于普遍的意象。但是我终究没能将我的想法付诸于现实，现在想来。也挺对不起他们的，毕竟也着实辜负了他们的期望，没能圆上我画过的大饼。希望我何时真的能做出一款真正的游戏吧，能给人哪怕一丁点的感动，就像是前文提到的 To the moon，乃至 Undertale, Evoland，乃至 DDLC  和某个差点肇始我 MD 的不具名游戏。','2020-12-31 17:58:15','巴渝'),(9,'本以为大家都是零基础，最后才发现原来都是oi爷.jpg ?','2021-01-03 22:37:59','重庆南岸'),(10,'刚才用 Godot 写了个 2D 方块运动的 demo，运行的时候发现方块的运动轨迹似乎紧随着些许余影，当时我就心想 Godot 这么厉害的吗，这个小个 2D demo 居然都还默认支持动态模糊。但过了一会儿越想越不对劲，于是截了张运动时的图片看了下，发现实际上并没存在动态模糊，这才乍想起来暑假时好像看到过有人说 R7000 存在有屏幕拖影的问题?','2021-01-09 15:29:26','重庆南岸'),(11,'pixel，不行?\nvector，行?','2021-01-10 00:08:44','重庆南岸'),(12,'当我试图以重构的角度来看待《树上的男爵》时，才发现 Calvino 是何等之强大，以至强大到令我感觉到绝望——在文学层面上，这应该还是我记忆中第一次有如此感受\n（この僕が、お前を最強と呼んでやる）','2021-01-11 21:59:12','重庆南岸');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `account` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

-- Dump completed on 2021-01-26 12:58:09
