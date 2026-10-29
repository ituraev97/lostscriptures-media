# CASE: The Book of Enoch — pilot for "The Lost Scriptures".
# Each entry: (kind, text, visual)
#   kind: "vo" narration | "quote" narration read over an on-screen quote card | "title" | "chapter" | "pause"
#   visual: image key (see assets.py) or None to keep the previous one
# Quotes: KJV (public domain in the US) and R. H. Charles, The Book of Enoch (1917, public domain).

S = [
 # ---------------------------------------------------------------- COLD OPEN
 ("vo", "There is a book that the Bible itself quotes.", "dore_159"),
 ("vo", "The Epistle of Jude names its author, and repeats his words, almost line for line.", None),
 ("vo", "And yet, open almost any Bible today, and you will not find it.", "ms_geez_1"),
 ("vo", "It tells of two hundred angels who swore an oath on a mountaintop.", "dore_043"),
 ("vo", "Of giants who devoured the earth.", "dore_147"),
 ("vo", "And of the one man who was taken up to heaven, and came back with a warning.", "dore_019"),
 ("vo", "For more than a thousand years, the Western world lost it. It survived in only one place on earth.", "ms_geez_2"),
 ("vo", "This is the Book of Enoch.", None),
 ("title", "THE BOOK OF ENOCH|The Lost Book Quoted in the Bible", "roberts_a"),

 # ---------------------------------------------------------------- I. THE MAN WHO DID NOT DIE
 ("chapter", "I|The Man Who Did Not Die", "dore_191"),
 ("vo", "His story in Genesis takes up only a few lines.", "dore_191"),
 ("vo", "Enoch is the seventh generation from Adam. He becomes the father of Methuselah, the oldest man in the Bible.", "dore_023"),
 ("vo", "And then Genesis says something it says about no one else.", "roberts_b"),
 ("quote", "And Enoch walked with God: and he was not; for God took him.|Genesis 5:24 (KJV)", "dore_151"),
 ("vo", "No death. No burial. Three hundred and sixty-five years... and then, he was simply gone.", "roberts_c"),
 ("vo", "That single, strange sentence raised a question ancient readers could not leave alone. Where did Enoch go? And what did he see?", "dore_227"),

 # ---------------------------------------------------------------- II. THE WATCHERS
 ("chapter", "II|The Watchers", "dore_043"),
 ("vo", "A few verses later, Genesis tells an even stranger story.", "dore_027"),
 ("vo", "The sons of God saw that the daughters of men were beautiful, and took them as wives. Their children became the Nephilim.", "dore_043"),
 ("quote", "The same became mighty men which were of old, men of renown.|Genesis 6:4 (KJV)", "roberts_d"),
 ("vo", "Then the text simply moves on. Who were these sons of God? What were the Nephilim? Genesis does not say.", "roberts_d"),
 ("vo", "The Book of Enoch does.", "ms_geez_1"),
 ("vo", "In Enoch's account, the sons of God are angels, a class of heavenly beings it calls the Watchers.", "dore_175"),
 ("vo", "And in the days of Enoch's father, Jared, two hundred of them made a choice.", "dore_179"),
 ("vo", "Their leader, Semjaza, was afraid. He told the others he feared that he alone would pay the penalty for a great sin. So they bound themselves together with an oath.", "dore_195"),
 ("quote", "And they were in all two hundred; who descended in the days of Jared on the summit of Mount Hermon.|1 Enoch 6:6 (R. H. Charles, 1917)", "roberts_e"),
 ("vo", "Mount Hermon is a real mountain, the highest peak on the northern edge of ancient Israel. And the book plays on its name. In Hebrew it echoes the word herem: something banned, something under a curse.", "roberts_e"),

 # ---------------------------------------------------------------- III. FORBIDDEN KNOWLEDGE
 ("chapter", "III|Forbidden Knowledge", "dore_239"),
 ("vo", "The Watchers did not come empty-handed. They taught humanity secrets it was never meant to have.", "dore_239"),
 ("quote", "And Azazel taught men to make swords, and knives, and shields, and breastplates.|1 Enoch 8:1 (R. H. Charles, 1917)", "dore_147"),
 ("vo", "He revealed the metals of the earth and the art of working them. Bracelets, ornaments, and the beautifying of the eyes.", "roberts_f"),
 ("vo", "Others taught enchantments and the cutting of roots. Baraqijal taught astrology. Others taught the signs of the earth, the course of the sun, and the moon.", "roberts_g"),
 ("vo", "In the Book of Enoch, the origin of war and corruption is not only human. It is a stolen gift, from fallen angels.", "dore_183"),

 # ---------------------------------------------------------------- IV. THE GIANTS
 ("chapter", "IV|The Giants", "dore_031"),
 ("vo", "Then came their children. The book describes great giants. In the Ethiopic text, three thousand ells tall.", "dore_027"),
 ("vo", "They consumed everything that people had produced. And when there was nothing left...", "roberts_h"),
 ("quote", "The giants turned against them and devoured mankind... Then the earth laid accusation against the lawless ones.|1 Enoch 7:4-6 (R. H. Charles, 1917)", "dore_271"),
 ("vo", "The cry of the earth, the book says, rose up to heaven.", "dore_151"),

 # ---------------------------------------------------------------- V. JUDGMENT
 ("chapter", "V|Judgment", "dore_195"),
 ("vo", "Heaven answered. The archangels Michael, Uriel, Raphael, and Gabriel bring the cry of the earth before God. And the sentence is severe.", "dore_175"),
 ("quote", "Bind Azazel hand and foot, and cast him into the darkness... and place upon him rough and jagged rocks.|1 Enoch 10:4-5 (R. H. Charles, 1917)", "roberts_i"),
 ("vo", "Raphael is to bury him in a desert place called Dudael, until the day of the great judgment.", "roberts_i"),
 ("vo", "Michael is sent to bind Semjaza and his companions in the valleys of the earth, for seventy generations.", "dore_239"),
 ("vo", "And a messenger is sent to Noah, to warn him: a deluge is coming upon the whole earth.", "film_ark"),
 ("vo", "In the Book of Enoch, the Flood is not only punishment for human sin. It is the cleansing of a world the Watchers corrupted.", "dore_031"),

 # ---------------------------------------------------------------- VI. THE JOURNEY TO HEAVEN
 ("chapter", "VI|The Journey to Heaven", "dore_019"),
 ("vo", "And where is Enoch in all of this? He becomes the go-between.", "dore_159"),
 ("vo", "The fallen Watchers, desperate, ask Enoch to write a petition for their forgiveness, and carry it to heaven.", "ms_geez_2"),
 ("vo", "In a vision, he is taken up, through a wall built of crystals and surrounded by tongues of fire, into a great house, before the throne of God.", "dore_151"),
 ("vo", "The answer for the Watchers is no.", "dore_019"),
 ("quote", "Say to them therefore: You have no peace.|1 Enoch 16:4 (R. H. Charles, 1917)", "dore_179"),
 ("vo", "Then the angels lead him on a journey to the ends of the earth. To the prisons of the fallen. To mountains of fire. To the storehouses of the winds, and the paths of the stars.", "roberts_j"),

 # ---------------------------------------------------------------- VII. FIVE BOOKS IN ONE
 ("chapter", "VII|Five Books in One", "ms_geez_3"),
 ("vo", "What we call the Book of Enoch is really a collection of five books, written over several centuries.", "ms_geez_3"),
 ("vo", "The Book of the Watchers.", "dore_043"),
 ("vo", "The Book of Parables, which speaks of a mysterious heavenly figure called the Son of Man.", "dore_151"),
 ("vo", "The Astronomical Book, which describes a year of three hundred and sixty-four days.", "roberts_k"),
 ("vo", "The Dream Visions, which retell the history of Israel as a story of animals.", "roberts_l"),
 ("vo", "And the Epistle of Enoch.", "dore_159"),
 ("vo", "Scholars date its oldest parts to the third century before Christ.", "ms_geez_1"),

 # ---------------------------------------------------------------- VIII. QUOTED, THEN LOST
 ("chapter", "VIII|Quoted, Then Lost", "roberts_m"),
 ("vo", "In the time of Jesus, this book was widely read. And the first Christians knew it well.", "roberts_m"),
 ("vo", "The Epistle of Jude, in the New Testament, quotes it directly.", "dore_159"),
 ("quote", "Behold, the Lord cometh with ten thousands of his saints, to execute judgment upon all.|Jude 1:14-15 (KJV)", "dore_411"),
 ("vo", "Now compare that with the very first chapter of Enoch.", None),
 ("quote", "And behold! He cometh with ten thousands of His holy ones, to execute judgement upon all.|1 Enoch 1:9 (R. H. Charles, 1917)", "ms_geez_2"),
 ("vo", "The Second Letter of Peter speaks of angels who sinned, and were cast down into chains of darkness. Early Christian writers like Tertullian defended Enoch as scripture.", "dore_195"),
 ("vo", "But others had doubts. How could a book from before the Flood have survived it? Augustine, among others, set it aside.", "dore_031"),
 ("vo", "Over the centuries that followed, most churches simply stopped copying it. In the West, the Book of Enoch faded away.", "roberts_n"),

 # ---------------------------------------------------------------- IX. THE LAST COPIES
 ("chapter", "IX|The Last Copies", "ms_geez_3"),
 ("vo", "But it did not vanish everywhere.", "roberts_o"),
 ("vo", "In the highlands of Ethiopia, monks kept copying it, in Ge'ez, the ancient language of the Ethiopian church.", "ms_geez_1"),
 ("vo", "To this day, the Ethiopian Orthodox Tewahedo Church counts the Book of Enoch as part of its Bible.", "ms_geez_2"),
 ("vo", "In 1773, a Scottish explorer named James Bruce returned to Europe from Abyssinia, carrying three copies of the lost book.", "roberts_p"),
 ("vo", "In 1821, Richard Laurence published the first English translation. And in the early twentieth century, the Oxford scholar R. H. Charles produced the edition still quoted today. The words you have seen on screen.", "ms_charles"),

 # ---------------------------------------------------------------- X. THE DESERT ANSWERS
 ("chapter", "X|The Desert Answers", "roberts_q"),
 ("vo", "Still, many wondered. Was this truly an ancient book? Or a later invention?", "roberts_q"),
 ("vo", "The answer came from the desert. Beginning in 1947, near the ruins of Qumran by the Dead Sea, caves began to give up the Dead Sea Scrolls.", "roberts_r"),
 ("vo", "And in Cave Four, scholars found fragments of the Book of Enoch. In Aramaic. From around eleven different manuscripts.", "roberts_s"),
 ("vo", "Some of them were copied around two hundred years before the birth of Jesus.", "roberts_q"),
 ("vo", "Every part of the book was there, except one: the Book of Parables. When that section was written is still debated.", "ms_geez_3"),
 ("vo", "The lost book was real. And it was old.", "roberts_r"),

 # ---------------------------------------------------------------- CLOSE
 ("chapter", "|Why Was It Left Out?", "dore_227"),
 ("vo", "So why is it missing from most Bibles today?", "dore_227"),
 ("vo", "For some, it was never inspired scripture. For others, it was a treasured book that history left behind. And one ancient church never let it go.", "ms_geez_2"),
 ("vo", "Whatever you believe, the Book of Enoch is a window into how ancient people wrestled with the hardest questions. Where does evil come from? Why does the world suffer? And will justice ever come?", "dore_171"),
 ("vo", "Enoch walked with God, and he was not. But his book, against all odds, survived.", "dore_019"),
 ("vo", "There are other lost books. The Book of Jubilees. The Gospel of Thomas. The Apocalypse of Abraham.", "roberts_a"),
 ("vo", "If you want to hear their stories, subscribe, and tell us in the comments which one we should open next.", "roberts_a"),
 ("end", "THE LOST SCRIPTURES", "roberts_a"),
]
