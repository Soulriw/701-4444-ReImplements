-- QuadGrimoire Book Store Database Setup Script
-- Run this script on your MySQL Railway database

-- The database 'railway' already exists in Railway
-- No need to create it, just start creating tables

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS `Carts`;
DROP TABLE IF EXISTS `Historys`;
DROP TABLE IF EXISTS `PromotionsBook`;
DROP TABLE IF EXISTS `Books`;
DROP TABLE IF EXISTS `Categories`;
DROP TABLE IF EXISTS `Admins`;
DROP TABLE IF EXISTS `Users`;

-- Create Categories table
CREATE TABLE `Categories` (
    `categoryID` INT AUTO_INCREMENT PRIMARY KEY,
    `categoryName` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Books table
CREATE TABLE `Books` (
    `bookID` INT PRIMARY KEY,
    `bookName` VARCHAR(255) NOT NULL,
    `categoryID` INT NOT NULL,
    `categoryName` VARCHAR(100) NOT NULL,
    `bookDescription` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `proPrice` DECIMAL(10,2),
    `enchantment` TEXT,
    FOREIGN KEY (`categoryID`) REFERENCES `Categories`(`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Users table
CREATE TABLE `Users` (
    `userID` INT AUTO_INCREMENT PRIMARY KEY,
    `userName` VARCHAR(100) NOT NULL UNIQUE,
    `userPassword` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Admins table
CREATE TABLE `Admins` (
    `adminID` INT AUTO_INCREMENT PRIMARY KEY,
    `adminName` VARCHAR(100) NOT NULL UNIQUE,
    `adminPassword` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Carts table
CREATE TABLE `Carts` (
    `cartID` INT AUTO_INCREMENT PRIMARY KEY,
    `cartBookID` INT NOT NULL,
    `bookName` VARCHAR(255) NOT NULL,
    `categoryID` INT NOT NULL,
    `categoryName` VARCHAR(100) NOT NULL,
    `bookDescription` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `proPrice` DECIMAL(10,2),
    `quantity` INT NOT NULL DEFAULT 1,
    `enchantment` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Historys table
CREATE TABLE `Historys` (
    `historyID` INT AUTO_INCREMENT PRIMARY KEY,
    `bookID` INT NOT NULL,
    `bookName` VARCHAR(255) NOT NULL,
    `categoryID` INT NOT NULL,
    `categoryName` VARCHAR(100) NOT NULL,
    `sellPrice` DECIMAL(10,2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `enchantment` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create PromotionsBook table
CREATE TABLE `PromotionsBook` (
    `proBookID` INT AUTO_INCREMENT PRIMARY KEY,
    `bookID` INT NOT NULL,
    `bookName` VARCHAR(255) NOT NULL,
    `categoryID` INT NOT NULL,
    `categoryName` VARCHAR(100) NOT NULL,
    `bookDescription` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `proPrice` DECIMAL(10,2),
    FOREIGN KEY (`bookID`) REFERENCES `Books`(`bookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Categories
INSERT INTO `Categories` (`categoryName`) VALUES
('Fantasy'),
('Romance'),
('Mystery'),
('Adventure'),
('Mythology');

-- Insert Sample Books
INSERT INTO `Books` (`bookID`, `bookName`, `categoryID`, `categoryName`, `bookDescription`, `price`, `proPrice`, `enchantment`) VALUES
-- Fantasy Books (101-112)
(101, 'The Magic Portal', 1, 'Fantasy', 'A young mage discovers a portal to another dimension where magic reigns supreme.', 29.99, 19.99, 'Magical transformation abilities'),
(102, 'Shadow Realm Chronicles', 1, 'Fantasy', 'Epic tale of heroes fighting dark forces in parallel realms.', 34.99, NULL, 'Darkness manipulation'),
(103, 'Dragon Heart Legacy', 1, 'Fantasy', 'The last dragon rider must save the kingdom from ancient evil.', 32.99, 24.99, 'Dragon bonding magic'),
(104, 'Enchanted Forest Secrets', 1, 'Fantasy', 'Lost in a magical forest, a group of friends discovers hidden powers.', 27.99, NULL, 'Nature magic'),
(105, 'Spellbound Kingdom', 1, 'Fantasy', 'A magical kingdom where spells come alive and reality bends.', 31.99, 22.99, 'Reality warping'),
(106, 'Crystal Prism Legend', 1, 'Fantasy', 'Seven crystals that control the elements of the world.', 36.99, NULL, 'Elemental control'),
(107, 'Mystic Academy Year 1', 1, 'Fantasy', 'A new student at a school for magical arts faces dark secrets.', 28.99, 19.99, 'Academic magic'),
(108, 'Phantom Knight''s Quest', 1, 'Fantasy', 'A knight returns from the dead to fulfill an ancient prophecy.', 33.99, NULL, 'Undead power'),
(109, 'The Moonlit Spell', 1, 'Fantasy', 'When the full moon rises, magic awakens in this sleepy town.', 30.99, 23.99, 'Lunar magic'),
(110, 'Eternal Flames Saga', 1, 'Fantasy', 'Fire mages protect the world from eternal winter.', 35.99, NULL, 'Fire manipulation'),
(111, 'Guardians of the Light', 1, 'Fantasy', 'Legendary guardians awaken to fight the approaching darkness.', 37.99, 29.99, 'Light magic'),
(112, 'The Time Weaver', 1, 'Fantasy', 'A weaver of time must save the past and future simultaneously.', 39.99, NULL, 'Time manipulation'),

-- Romance Books (201-212)
(201, 'Love in the Garden', 2, 'Romance', 'A sweet love story blooming in a Victorian garden.', 24.99, 17.99, 'Love and devotion'),
(202, 'Starry Night Romance', 2, 'Romance', 'Two souls meet under the stars in Paris.', 26.99, NULL, 'Romantic connection'),
(203, 'Coffee Shop Encounters', 2, 'Romance', 'Daily coffee visits lead to unexpected love.', 23.99, 16.99, 'Daily rituals'),
(204, 'The Wedding Planner', 2, 'Romance', 'Behind every perfect wedding is a story of love.', 27.99, NULL, 'Commitment magic'),
(205, 'Second Chance at Love', 2, 'Romance', 'Old flames rekindle after twenty years apart.', 25.99, 18.99, 'Reunion magic'),
(206, 'Beachside Memories', 2, 'Romance', 'A summer beach vacation that changes everything.', 22.99, NULL, 'Summer love'),
(207, 'The Art Collector', 2, 'Romance', 'Love blossoms in the galleries of Rome.', 29.99, 21.99, 'Artistic passion'),
(208, 'Highland Hearts', 2, 'Romance', 'A modern woman finds love in the Scottish highlands.', 28.99, NULL, 'Highland magic'),
(209, 'Letters from Italy', 2, 'Romance', 'Pen pals discover they''re meant for each other.', 24.99, 17.99, 'Written romance'),
(210, 'The Bakery Owner', 2, 'Romance', 'Sweet treats lead to sweet romance.', 21.99, NULL, 'Culinary love'),
(211, 'Island Paradise Love', 2, 'Romance', 'Cast away on an island, two strangers become lovers.', 26.99, 19.99, 'Tropical magic'),
(212, 'Winter Wedding', 2, 'Romance', 'A Christmas wedding brings two families together.', 27.99, NULL, 'Holiday romance'),

-- Mystery Books (301-312)
(301, 'The Midnight Murders', 3, 'Mystery', 'A detective must solve murders that occur exactly at midnight.', 19.99, 14.99, 'Detective intuition'),
(302, 'Vanishing Evidence', 3, 'Mystery', 'All clues point to the impossible being possible.', 21.99, NULL, 'Hidden truths'),
(303, 'The Anonymous Threat', 3, 'Mystery', 'A series of cryptic messages threaten a small town.', 18.99, 13.99, 'Enigmatic puzzles'),
(304, 'Cold Case Files', 3, 'Mystery', 'Reopening a case from 30 years ago reveals dark secrets.', 22.99, NULL, 'Time-bending mystery'),
(305, 'The Last Witness', 3, 'Mystery', 'Only one person knows the truth, but they''re speaking in riddles.', 20.99, 15.99, 'Truth revelation'),
(306, 'Bloodstain Secrets', 3, 'Mystery', 'Forensic evidence leads to an impossible conclusion.', 19.99, NULL, 'Scientific deduction'),
(307, 'The Forbidden Library', 3, 'Mystery', 'Books that have never been read hold the key to murders.', 23.99, 17.99, 'Literary mystery'),
(308, 'Twisted Alibi', 3, 'Mystery', 'Everyone has an alibi, but none of them add up.', 21.99, NULL, 'Logical puzzles'),
(309, 'The Secret Society', 3, 'Mystery', 'A detective infiltrates a mysterious organization.', 20.99, 14.99, 'Undercover skills'),
(310, 'Cryptic Cipher Murders', 3, 'Mystery', 'Each murder is encoded with an ancient cipher.', 22.99, NULL, 'Cryptographic skills'),
(311, 'The Last Letter', 3, 'Mystery', 'A dying man''s letter contains clues to his murder.', 19.99, 13.99, 'Final messages'),
(312, 'Shadows of Suspicion', 3, 'Mystery', 'In a town full of secrets, no one is innocent.', 21.99, NULL, 'Suspenseful atmosphere'),

-- Adventure Books (401-412)
(401, 'Amazon Expedition', 4, 'Adventure', 'A team discovers a lost civilization in the Amazon jungle.', 27.99, 19.99, 'Exploration skills'),
(402, 'The Arctic Quest', 4, 'Adventure', 'Surviving the Arctic in search of lost treasure.', 29.99, NULL, 'Survival instincts'),
(403, 'Treasure Island Revisited', 4, 'Adventure', 'A modern retelling of classic treasure hunting.', 25.99, 17.99, 'Navigational skills'),
(404, 'Mountain Climb Chronicles', 4, 'Adventure', 'Conquering the world''s highest peaks.', 28.99, NULL, 'Endurance'),
(405, 'Desert Mystery', 4, 'Adventure', 'Lost in the Sahara, searching for a mythical oasis.', 26.99, 18.99, 'Desert survival'),
(406, 'Deep Sea Discovery', 4, 'Adventure', 'Exploring the depths of the ocean reveals ancient mysteries.', 30.99, NULL, 'Underwater exploration'),
(407, 'Jungle Warrior', 4, 'Adventure', 'Adapting to survive in the most dangerous jungle on Earth.', 27.99, 20.99, 'Jungle wisdom'),
(408, 'Island Survival', 4, 'Adventure', 'Stranded on an uninhabited island, every day is a challenge.', 24.99, NULL, 'Island survival'),
(409, 'The Lost Civilization', 4, 'Adventure', 'Discovering Atlantis might not be a myth after all.', 31.99, 22.99, 'Archaeological skills'),
(410, 'Volcano Expedition', 4, 'Adventure', 'Journeying into an active volcano for scientific research.', 29.99, NULL, 'Scientific courage'),
(411, 'The Wild Safari', 4, 'Adventure', 'African safari turns into a fight for survival.', 26.99, 18.99, 'Wildlife knowledge'),
(412, 'Space Station Mystery', 4, 'Adventure', 'Mysterious events on a space station far from Earth.', 33.99, NULL, 'Space exploration'),

-- Mythology Books (501-512)
(501, 'Greek Gods Reborn', 5, 'Mythology', 'The ancient gods return to the modern world.', 34.99, 24.99, 'Divine powers'),
(502, 'Norse Legends', 5, 'Mythology', 'Vikings, gods, and the end of the world: Ragnarok.', 32.99, NULL, 'Norse wisdom'),
(503, 'Egyptian Gods Awaken', 5, 'Mythology', 'Ancient Egyptian deities return in modern times.', 36.99, 26.99, 'Ancient knowledge'),
(504, 'Celtic Mythology Tales', 5, 'Mythology', 'The myths and legends of the Celtic peoples.', 30.99, NULL, 'Celtic magic'),
(505, 'The Titan''s War', 5, 'Mythology', 'The great war between Titans and Olympians.', 35.99, 25.99, 'Titan power'),
(506, 'Hindu Mythology Stories', 5, 'Mythology', 'Epic tales from Hindu mythology and the Mahabharata.', 33.99, NULL, 'Spiritual wisdom'),
(507, 'Japanese Kami Stories', 5, 'Mythology', 'The spirits and deities of Japanese mythology.', 31.99, 22.99, 'Shinto power'),
(508, 'Mayan Prophecy', 5, 'Mythology', 'The ancient Mayan calendar and its hidden prophecies.', 37.99, NULL, 'Prophecy understanding'),
(509, 'Arthurian Legends', 5, 'Mythology', 'The tales of King Arthur and the Knights of the Round Table.', 34.99, 24.99, 'Chivalric code'),
(510, 'Chinese Mythology', 5, 'Mythology', 'Dragons, phoenixes, and the Jade Emperor.', 32.99, NULL, 'Eastern wisdom'),
(511, 'Nordic Runes and Magic', 5, 'Mythology', 'The magical alphabet of the Norse gods.', 29.99, 20.99, 'Runic magic'),
(512, 'The Pantheon Wars', 5, 'Mythology', 'Gods from different mythologies clash in epic battles.', 39.99, NULL, 'Divine warfare');

-- Insert Sample Users (password: user123 for all)
INSERT INTO `Users` (`userName`, `userPassword`) VALUES
('john_doe', 'user123'),
('jane_smith', 'user123'),
('alice_wonder', 'user123'),
('bob_miller', 'user123');

-- Insert Sample Admin (password: admin123)
INSERT INTO `Admins` (`adminName`, `adminPassword`) VALUES
('admin', 'admin123');

-- Sample data complete!
-- Remember to update passwords to hashed values in production

