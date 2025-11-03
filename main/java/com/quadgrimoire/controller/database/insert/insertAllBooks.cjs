require('dotenv').config();
const mysql = require('mysql2/promise');

async function insertAllBooks() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // book information to be added
        const books = [
            // we can add more books.
            // if there is no promotion price, we can leave the proPrice "null".

            // categoryID: Spell
            {
                bookID: 101,
                bookName: 'The Art of Wand Movements',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Precision is key to powerful magic. This guide explores the intricate techniques of wand movements, teaching aspiring spellcasters how to refine their control, enhance spell effectiveness, and unlock the true potential of their magic.',
                price: 85.00,
                proPrice: 70.00
            },
            {
                bookID: 102,
                bookName: 'Defensive Magical Theory',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'A deep dive into the principles of magical defense, covering shield charms, counterspells, and protective enchantments. This essential guide helps wizards and witches understand the theory behind defending against magical threats.',
                price: 90.00,
                proPrice: 67.00
            },
            {
                bookID: 103,
                bookName: 'The Seven Schools of Spellcraft',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Magic is vast, but all spells fall into seven fundamental schools. This book explores each discipline, from charms to transfiguration, revealing their history, unique properties, and how they shape the practice of spellcasting.',
                price: 88.00,
                proPrice: 79.00
            },
            {
                bookID: 104,
                bookName: 'Unbreakable: The Theory of Shield Charms',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Not all shields are created equal. This book uncovers the magical science behind protective spells, exploring how wizards craft unbreakable defenses and fortify themselves against even the most powerful attacks.',
                price: 91.00,
                proPrice: 61.00
            },
            {
                bookID: 105,
                bookName: 'Hexes, Jinxes, and Curses: A Practical Guide',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Dark magic lurks everywhere, but knowledge is power. This hands-on guide teaches how to identify, cast, and counter hexes, jinxes, and curses, ensuring that every spellcaster is prepared for magical duels and dangers.',
                price: 140.00,
                proPrice: 123.00
            },
            {
                bookID: 106,
                bookName: 'The Laws of Levitation: A Guide to Aerial Spells',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'From simple floating charms to advanced flight magic, this book uncovers the mechanics behind levitation spells. Learn the laws that govern aerial magic and master the art of defying gravity.',
                price: 43.00,
                proPrice: 34.00
            },
            {
                bookID: 107,
                bookName: 'Curious Curses and How to Reverse Them',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Some curses are common, others are bizarre. This fascinating guide explores rare and unusual curses, their effects, and the precise counter-charms needed to break them—perfect for those who seek mastery over dark enchantments.',
                price: 39.00,
                proPrice: 34.00
            },
            {
                bookID: 108,
                bookName: 'Magical Symbology in Spellcasting',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Symbols hold immense magical power. This book delves into the hidden meanings behind enchanted sigils, runes, and glyphs, revealing how they influence spellcasting and strengthen magical incantations.',
                price: 103.00,
                proPrice: 82.00
            },
            {
                bookID: 109,
                bookName: 'Runes and Their Resonance: An Introduction to Ancient Magic',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Runes are more than mere markings—they resonate with deep magical energy. This introduction to ancient magic explores the power of runes, their historical significance, and their role in enhancing spells and enchantments.',
                price: 89.00,
                proPrice: 82.00
            },
            {
                bookID: 110,
                bookName: 'Lost Spells and Forbidden Rituals',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Step into the realm of ancient, forgotten magic. This book reveals long-lost spells and hidden rituals, exploring their mysterious origins, dangerous potential, and the wizards who once dared to wield them.',
                price: 97.00,
                proPrice: 83.00
            },
            {
                bookID: 111,
                bookName: 'Illusions and Glamours: The Art of Deceptive Magic',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Unravels the psychological principles behind misdirection and visual trickery in stage magic. From classic parlor tricks to grand illusions, discover how master magicians manipulate perception to create seemingly impossible wonders.',
                price: 148.00,
                proPrice: 134.00
            },
            {
                bookID: 112,
                bookName: 'Philosophies of Spellcasting: A Theoretical Approach',
                categoryID: '1',
                categoryName: 'Spell',
                bookDescription: 'Explore the deeper principles behind spellcasting in this thought-provoking book. Delving into magical philosophies, it examines the theoretical foundations of magic, how intent shapes spells, and the ethical dilemmas faced by powerful wizards.',
                price: 168.00,
                proPrice: 153.00
            },
            
            // categoryID: Education
            {
                bookID: 201,
                bookName: 'The Elementary Spell',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'The introduction to the world of magic, this book teaches the fundamentals of illusion, sleight of hand, and stagecraft. Whether you are a beginner or looking to refine your skills, this guide provides step-by-step instructions on classic tricks and performance techniques',
                price: 70.00,
                proPrice: 45.00
            },
            {
                bookID: 202,
                bookName: 'A Beginner\'s Guide to Transfiguration',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Transformation magic with this beginner-friendly guide. Learn how to make objects change shape, vanish, or appear in new forms using sleight of hand, misdirection, and clever techniques. Perfect for aspiring magicians looking to master visual illusions.',
                price: 75.00,
                proPrice: 45.00
            },
            {
                bookID: 203,
                bookName: 'Magical Drafts and Potions',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'The mystical art of potion-making and magical chemistry. This book explores the secrets behind enchanting elixirs, smoke illusions, and bubbling brews used in magical performances. Perfect for those who want to add an alchemical twist to their magic acts.',
                price: 90.00,
                proPrice: 82.00
            },
            {
                bookID: 204,
                bookName: 'Numerology and Grammatica',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Delves into the intricate relationship between mathematical patterns and magical theory, exploring how ancient practitioners used numerical sequences to enhance their mystical practices. A sophisticated analysis of the mathematical foundations behind classical enchantments.',
                price: 70.00,
                proPrice: 60.00
            },
            {
                bookID: 205,
                bookName: 'Alchemy, Ancient Art and Science',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Mysteries of alchemy, where magic and science intertwine. This book explores ancient practices, from transforming metals to crafting mystical elixirs, revealing the secrets behind legendary alchemists and how their knowledge influences modern illusions and magical performances. ',
                price: 125.00,
                proPrice: 75.00
            },
            {
                bookID: 206,
                bookName: 'A Handbook of Magical Ethics and Laws',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Explore the principles that govern the world of magic, from ethical performance practices to the unspoken rules of illusion. This guide covers the history, responsibilities, and moral dilemmas of magicians, ensuring that magic is performed with integrity, respect, and wonder.',
                price: 85.00,
                proPrice: 70.00
            },
            {
                bookID: 207,
                bookName: 'Theory and Practice of Advanced Spellcasting',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Intricacies of advanced spellcasting with Professor Blackwood\'s comprehensive guide. From energy manipulation to complex wand techniques, this volume bridges theoretical concepts with practical applications, perfect for serious practitioners ready to elevate their magical abilities.',
                price: 95.00,
                proPrice: 69.00
            },
            {
                bookID: 208,
                bookName: 'Silent Spells: The Power of Wandless Magic',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Discover the ancient art of wandless magic in this revolutionary guide. Learn to channel your inner power through meditation, gesture, and force of will alone. Perfect for advanced practitioners seeking to break free from traditional casting methods.',
                price: 110.00,
                proPrice: 99.00
            },
            {
                bookID: 209,
                bookName: 'Arithmantic Equations and Their Magical Effects',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Unlock the mathematical secrets behind successful spellcasting in this essential guide to magical numerology. Explore how numbers influence spell power, timing, and effectiveness through clear formulas and practical applications. Essential for precision-minded practitioners.',
                price: 80.00,
                proPrice: 70.00
            },
            {
                bookID: 210,
                bookName: 'The Perfect Patronus: Mastering Defensive Magic',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Master the art of protective magic with this comprehensive guide to the Patronus charm. Learn to harness positive energy, develop mental fortitude, and create powerful magical shields. Essential reading for wizards focused on defensive spell work.',
                price: 65.00,
                proPrice: 45.00
            },
            {
                bookID: 211,
                bookName: 'The Celestial Connection: Astrology and Spellcasting',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Enhance your spellcasting by harnessing the power of celestial bodies. This illuminating guide reveals how planetary alignments, lunar phases, and zodiacal influences can amplify your magic. Perfect for those seeking to sync their spells with cosmic forces.',
                price: 140.00,
                proPrice: 120.00
            },
            {
                bookID: 212,
                bookName: 'The Language of Spells: Linguistic Roots in Magic',
                categoryID: '2',
                categoryName: 'Education',
                bookDescription: 'Discover the power of words in the art of magic. This book explores the origins of incantations, ancient symbols, and the linguistic roots of spells across cultures, revealing how language shapes magical traditions and influences the art of illusion.',
                price: 90.00,
                proPrice: 50.00
            },

            // categoryID: History
            {
                bookID: 301,
                bookName: 'The Origins of Magic',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Explore the origins of magic, from ancient times to the practices that still influence the world today. Discover the rituals and spells that have shaped cultures and history for centuries.',
                price: 120.00,
                proPrice: 86.00
            },
            {
                bookID: 302,
                bookName: 'Forbidden Spells: The Dark Legacy of Magic',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'This book uncovers the hidden history of forbidden spells and dark magic. It traces their origins, the ancient texts that held them, and the sorcerers who used these powerful, dangerous arts. Discover the dark legacy that has shaped magic through the ages',
                price: 165.00,
                proPrice: 135.00
            },
            {
                bookID: 303,
                bookName: 'Quidditch Through the Ages',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Journey through the thrilling evolution of the world\'s most beloved magical sport. From ancient broomstick games to modern championship matches, this definitive chronicle reveals fascinating Quidditch traditions, legendary teams, and revolutionary flying techniques throughout history.',
                price: 131.00,
                proPrice: 123.00
            },
            {
                bookID: 304,
                bookName: 'Great Wizards of the Twentieth Century',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'A fascinating exploration of the most powerful and influential wizards of the 20th century. This book highlights their magical achievements, their impact on the magical world, and the legacies they left behind for future generations of wizards.',
                price: 141.00,
                proPrice: 117.00
            },
            {
                bookID: 305,
                bookName: 'A Chronicle of Magical Catastrophes',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Chronicles the world’s most devastating magical events, from the fall of ancient magical kingdoms to catastrophes caused by uncontrollable spells. It uncovers the hidden dangers of magic and the disasters they left in their wake.',
                price: 172.00,
                proPrice: 145.00
            },
            {
                bookID: 306,
                bookName: 'The Bloodlines of Power: Ancestry of the Great Houses',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Explore the legendary families who wielded power across the magical realms. This book traces the bloodlines of the great wizarding houses, uncovering their secrets, legacies, and influence throughout history.',
                price: 139.00,
                proPrice: 111.00
            },
            {
                bookID: 307,
                bookName: 'Myths and Truths of the Founders of Hogwarts',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Delve into the legends and truths behind the four founders of Hogwarts. This book reveals the real stories of Rowena Ravenclaw, Salazar Slytherin, Helga Hufflepuff, and Godric Gryffindor, beyond the myths and legends.',
                price: 71.00,
                proPrice: 61.00
            },
            {
                bookID: 308,
                bookName: 'A Time Before Hogwarts: The Early Schools of Magic',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Before Hogwarts, there were other schools. This fascinating history explores the earliest magical institutions, their founders, and the practices that laid the foundation for modern magical education.',
                price: 148.00,
                proPrice: 132.00
            },
            {
                bookID: 309,
                bookName: 'Mages and Monarchs: The Role of Wizards in Muggle History',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Uncover the secret history of wizards influencing the muggle world. From royal courts to hidden battles, this book explores how magical beings have shaped the course of human history behind the scenes.',
                price: 61.00,
                proPrice: 39.00
            },
            {
                bookID: 310,
                bookName: 'A History of Magical Architecture: Castles, Towers, and Hidden Lairs',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Journey through the centuries of magical construction. This detailed history examines iconic magical architecture, from enchanted castles to secret towers, and the wizards who created them.',
                price: 161.00,
                proPrice: 140.00
            },
            {
                bookID: 311,
                bookName: 'Enchanted Wars: The Conflicts of the Wizarding World',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'A deep dive into the great magical conflicts that shaped wizarding history. This book chronicles enchanted wars, from rivalries to full-scale magical battles, and the heroes and villains who fought in them.',
                price: 108.00,
                proPrice: 79.00
            },
            {
                bookID: 312,
                bookName: 'Magical Revolutions: The Rise of Wizarding Societies',
                categoryID: '3',
                categoryName: 'History',
                bookDescription: 'Discover how wizarding societies rose to prominence through revolution. This book tells the stories of magical uprisings, the fall of oppressive regimes, and the birth of new magical orders.',
                price: 128.00,
                proPrice: 107.00
            },

            // categoryID: Literature
            {
                bookID: 401,
                bookName: 'Men Who Love Dragons Too Much',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'The story of a old wizard who falls in forbidden love with a dragon. Their passionate, illicit relationship defies the laws of nature and society, forcing them to fight both internal and external battles to protect a love that seems impossible in a world full of opposition and conflict.',
                price: 104.00,
                proPrice: 91.00
            },
            {
                bookID: 402,
                bookName: 'Voyages with Vampires',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Embark on a thrilling journey through shadowed seas and ancient lands, where vampires lurk in the night. This gripping tale weaves mystery, adventure, and dark enchantment as a traveler uncovers the chilling secrets of the undead.',
                price: 66.00,
                proPrice: 61.00
            },
            {
                bookID: 403,
                bookName: 'Year with the Yeti',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'An unforgettable journey into the unknown! Follow a daring explorer who spends a year uncovering the secrets of the elusive Yeti. Blending adventure, mystery, and wonder, this tale takes readers deep into the heart of legend.',
                price: 155.00,
                proPrice: 143.00
            },
            {
                bookID: 404,
                bookName: 'Holidays with Werewolves',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'A holiday like no other! When a traveler stumbles into a world of werewolves, their vacation turns into a thrilling adventure filled with mystery, danger, and moonlit secrets. A gripping tale of supernatural surprises and unexpected friendships.',
                price: 178.00,
                proPrice: 96.00
            },
            {
                bookID: 405,
                bookName: 'Travels with Trolls',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Journey into the world of trolls! This thrilling adventure follows a traveler who encounters these legendary creatures, navigating their tricks, tempers, and unexpected wisdom. A tale of discovery, danger, and the magic hidden in the wild.',
                price: 89.00,
                proPrice: 81.00
            },
            {
                bookID: 406,
                bookName: 'Tales from the Enchanted Forest',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Step into a realm where magic is alive, and every tree holds a secret. Follow brave adventurers through an enchanted forest, uncovering mystical creatures, ancient mysteries, and hidden wonders in this captivating collection of tales.',
                price: 99.00,
                proPrice: 92.00
            },
            {
                bookID: 407,
                bookName: 'The Enchanted Quill: Famous Wizarding Poets',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Discover the magic of words with history’s most legendary wizarding poets. This captivating collection celebrates enchanted verses, spellbinding sonnets, and the mystical power of poetry in the wizarding world.',
                price: 154.00,
                proPrice: 130.00
            },
            {
                bookID: 408,
                bookName: 'Legends of the Lost Sorcerers',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Unravel the mysteries of history’s most powerful and forgotten sorcerers. This spellbinding collection weaves together tales of magic, betrayal, and destiny, bringing to life the legends of those whose powers shaped the world—and then vanished.',
                price: 147.00,
                proPrice: 129.00
            },
            {
                bookID: 409,
                bookName: 'Sorcery and Sonatas: The Musical Tales of Wizardry',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Where magic meets melody. This enchanting collection of stories blends the power of sorcery with the soul of music, weaving magical tales that bring music to life in ways you\'ve never imagined.',
                price: 146.00,
                proPrice: 124.00
            },
            {
                bookID: 410,
                bookName: 'A Poet\'s Grimoire: Verses of Magic and Mystery',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Unlock the world of magical poetry. This book brings together haunting verses and spellbinding rhymes that explore the mystical and mysterious side of wizardry through the art of poetic expression.',
                price: 141.00,
                proPrice: 126.00
            },
            {
                bookID: 411,
                bookName: 'The Wandering Bard',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Follow the journey of a traveling bard whose songs echo with ancient magic. This story combines adventure, folklore, and captivating melodies that carry a hidden power, unlocking secrets along the way.',
                price: 162.00,
                proPrice: 107.00
            },
            {
                bookID: 412,
                bookName: 'Magical Misadventures: A Collection of Hilarious Tales',
                categoryID: '4',
                categoryName: 'Literature',
                bookDescription: 'Get ready for a laugh-out-loud adventure through the magical world. This collection of whimsical tales features magical mishaps, comical characters, and humorous situations that turn spellcasting into pure fun.',
                price: 112.00,
                proPrice: 93.00
            },

            // categoryID: General
            {
                bookID: 501,
                bookName: 'One Thousand Magical Herbs and Fungi ',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Dive into the world of enchanted plants! This comprehensive guide explores the magical properties, uses, and dangers of herbs and fungi, offering an essential resource for potion makers and spellcasters alike.',
                price: 175.00,
                proPrice: 144.00
            },
            {
                bookID: 502,
                bookName: 'Fantastic Beasts and Where to Find Them',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Journey into the wild and wondrous world of magical creatures. This fascinating book catalogs rare and exotic beasts, detailing their habitats, characteristics, and the magic they bring to the wizarding world.',
                price: 81.00,
                proPrice: 66.00
            },
            {
                bookID: 503,
                bookName: 'Foul or Fair? A Study of Quidditch Rules',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Whether you\'re a seasoned player or a new fan, this book unpacks the complexities of Quidditch. Learn the origins, evolution, and sometimes controversial rules of the world\'s favorite magical sport.',
                price: 177.00,
                proPrice: 153.00
            },
            {
                bookID: 504,
                bookName: 'Enchantment in Baking',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Delight in the sweet magic of baking! This book reveals the enchanting spells, charms, and techniques that turn simple baking into an art form, combining culinary skill with magical wonder.',
                price: 103.00,
                proPrice: 96.00
            },
            {
                bookID: 505,
                bookName: 'The Wandlore Compendium: Woods, Cores, and Legends',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Every wand has a story. This compendium offers an in-depth exploration of wandlore, uncovering the unique woods, cores, and the legends behind the most powerful magical instruments.',
                price: 126.00,
                proPrice: 119.00
            },
            {
                bookID: 506,
                bookName: 'A Magizoologist\'s Guide to Rare Creatures',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Venture into the world of magical creatures with this essential guide. Packed with fascinating details on rare and mythical beings, it offers insights into their care, behavior, and magical significance.',
                price: 150.00,
                proPrice: 128.00
            },
            {
                bookID: 507,
                bookName: 'The Everyday Wizard: Spells for Daily Life',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Simplify the complexities of wizarding life with spells designed for everyday use. From cleaning charms to cooking incantations, this guide provides practical magic for the modern wizard.',
                price: 157.00,
                proPrice: 137.00
            },
            {
                bookID: 508,
                bookName: 'Magical Cartography: Mapping the Hidden World',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Uncover the hidden corners of the magical world with this detailed guide to enchanted maps. Learn how magical cartographers chart uncharted lands, secret places, and places unknown to most wizards.',
                price: 60.00,
                proPrice: 55.00
            },
            {
                bookID: 509,
                bookName: 'Alchemy and the Philosopher’s Stone: The Secrets of Transformation',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Delve into the mysteries of alchemy and the ancient quest for the Philosopher’s Stone. This book unveils the secrets of transformation, from base metals to gold, and the mystical truths of alchemical practices.',
                price: 74.00,
                proPrice: 61.00
            },
            {
                bookID: 510,
                bookName: 'A Guide to Enchanted Artifacts and Their Uses',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Discover the power behind enchanted artifacts. This comprehensive guide delves into magical objects, their uses, and how they enhance the wizarding world, from ancient relics to modern wonders.',
                price: 65.00,
                proPrice: 29.00
            },
            {
                bookID: 511,
                bookName: 'Magical Recipes for Every Occasion',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Bring magic into your kitchen! This collection of delightful magical recipes transforms ordinary meals into enchanted feasts, with spells and ingredients designed for every occasion and celebration.',
                price: 130.00,
                proPrice: 113.00
            },
            {
                bookID: 512,
                bookName: 'A Guide to Wizarding Customs and Traditions',
                categoryID: '5',
                categoryName: 'General',
                bookDescription: 'Explore the rich cultural tapestry of wizarding life. This guide unveils the customs, ceremonies, and traditions that define magical communities, offering insight into the history and rituals of witches and wizards.',
                price: 83.00,
                proPrice: 77.00
            }
        ];

        // adding individual books to the database
        for (const book of books) {
            await connection.query(
                `INSERT INTO Books (bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [book.bookID, book.bookName, book.categoryID, book.categoryName, book.bookDescription, book.price, book.proPrice]
            );
            console.log(`Added book: ${book.bookName}`);
        }

        await connection.end();
        console.log('All books added successfully');

    } catch (error) {
        console.error('Error inserting books:', error);
    }
}

insertAllBooks();