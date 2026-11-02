# EPISODE 005: The Testament of Solomon — the ring from heaven, the demons who built the Temple, and the king who lost it all.
# Each entry: (kind, text, visual)
#   kind: "vo" narration | "quote" narration read over an on-screen quote card | "title" | "chapter" | "end"
#   visual: image key (see assets.py) or None to keep the previous one
# Quotes (public domain only): F. C. Conybeare, "The Testament of Solomon", Jewish Quarterly Review 11 (October 1898), translated
# from Fleck's Greek text (1837); Josephus, Antiquities 8.2.5, tr. William Whiston (1737). Bible verses cited from the KJV.
# Modern translations (Duling 1983 and later) are not quoted.

S = [
 # ---------------------------------------------------------------- COLD OPEN
 ("vo", "The Bible says King Solomon built the Temple in Jerusalem, and that no hammer or axe was heard while it was being built.", "dore_036"),
 ("vo", "An ancient book, written in Greek, tells a different story. An archangel gives Solomon a ring. And with that ring, the king forces demons to cut the stones.", "dore_096"),
 ("vo", "One of them carries the cornerstone up the steps of the Temple, while trapped inside a leather flask.", "rj_71"),
 ("vo", "And in 2025, two scholars published ten ancient rings, made in the third century, with a short Greek inscription: Solomon says, watch out.", "mc_t"),
 ("vo", "This is the Testament of Solomon.", None),
 ("title", "THE TESTAMENT OF SOLOMON|The Ring, the Demons and the Temple", "rj_101"),

 # ---------------------------------------------------------------- I
 ("chapter", "I|The Thief in the Temple", "dore_038"),
 ("vo", "The book is told by Solomon himself. It begins on the building site. The Temple is rising, and the workmen are paid every evening.", "dore_038"),
 ("vo", "Among them is a young boy from the master builder's household. The king loves him, and gives him double wages and double food. But the boy grows thinner every day.", "dore_038"),
 ("vo", "Solomon asks him why. And the boy explains. Every night after sunset, a demon comes. It takes half his pay and half his food. Then it takes hold of his right hand, and sucks his thumb.", "rj_113"),
 ("vo", "The demon's name, we learn soon, is Ornias.", "rj_113"),

 # ---------------------------------------------------------------- II
 ("chapter", "II|The Ring From Heaven", "dore_096"),
 ("vo", "Solomon goes into the Temple and prays, night and day, for power over the demon. And the archangel Michael comes down, and brings him a small ring with an engraved stone.", "dore_096"),
 ("quote", "Take, Solomon, king, son of David, the gift which the Lord God has sent thee. With it thou shalt lock up all the demons of the earth, male and female; and with their help thou shalt build up Jerusalem.|Testament of Solomon 5 (F. C. Conybeare, 1898)", "dore_041"),
 ("vo", "The seal on the ring, the text says, is a pentalpha. Its translator, F. C. Conybeare, explained it as five letters A interlaced: a five pointed star.", "cony_16"),
 ("vo", "Solomon gives the ring to the boy. When the demon comes, throw it at his chest, he says, and tell him: King Solomon calls you.", "cony_16"),
 ("vo", "It works. The demon begs the boy to take the ring off. He offers him all the gold and silver of the earth. The boy refuses. And Ornias is led, trembling, to the king, and set to work cutting stones.", "rj_92"),

 # ---------------------------------------------------------------- III
 ("chapter", "III|The Prince of Demons", "dore_036"),
 ("vo", "Then Solomon sends Ornias with the ring to fetch the prince of all demons, Beelzeboul. And Beelzeboul agrees to bring the others before the king, one by one.", "dore_036"),
 ("vo", "What follows is the heart of the book: a long interview. Solomon asks every spirit three things. What is your name? What do you do? And by which angel are you defeated?", "dore_037"),
 ("vo", "Some of the answers come straight from the Bible. Asmodeus, the demon of the Book of Tobit, says he is put to flight by the archangel Raphael, and by the liver and gall of a fish, smoked over a fire.", "dore_056"),
 ("vo", "Others come from the Greek world. Conybeare saw in one female spirit, all head and no body, the Medusa of Greek legend.", "dore_056"),
 ("vo", "Then come thirty six spirits, the rulers of the darkness. Each one causes a sickness: deafness, fevers, shivering fits. And each one names the words that drive it away. Scholars link them to the thirty six decans, the star divisions of Egyptian astrology.", "mc_g"),

 # ---------------------------------------------------------------- IV
 ("chapter", "IV|What the Demons Know", "rj_77"),
 ("vo", "One of the strangest scenes is a trial. An old man complains that his son beats him, and asks the king to punish the boy. The son denies it. Solomon is about to pass sentence, when he sees Ornias, laughing.", "dore_037"),
 ("vo", "Why are you laughing, the king demands. Because, says the demon, in three days the boy will die anyway.", "dore_037"),
 ("vo", "Solomon sends them home, reconciled. Days later the old man returns, in mourning. His son is dead. The demon told the truth.", "rj_77"),
 ("vo", "So how do demons know the future? Ornias explains. They fly up to the sky, among the stars, and overhear the sentences passed on human souls. But they have nowhere to rest up there.", "rj_77"),
 ("quote", "We lose strength and fall off like leaves from trees. And men seeing us imagine that the stars are falling from heaven.|Testament of Solomon 114 (F. C. Conybeare, 1898)", "dore_008"),

 # ---------------------------------------------------------------- V
 ("chapter", "V|The Wind of Arabia", "rs_77"),
 ("vo", "Then a letter arrives from Adares, king of Arabia. In his land, every dawn, a wind begins to blow until the third hour. It kills men and animals. No one can stand against it. Please, he writes, send someone who can catch it.", "rs_77"),
 ("vo", "Solomon gives a servant a camel, a leather flask and the ring. At dawn the young man sets the flask on the ground, with the ring over its mouth. The wind blows in through the ring and fills the flask. He ties it shut, and seals it.", "dore_064"),
 ("vo", "Back in Jerusalem, the flask is laid in the Temple. And the next morning, when Solomon walks in, the flask stands up, walks seven steps, falls on its mouth, and bows to the king.", "rj_71"),
 ("vo", "The spirit inside gives its name: Ephippas. I can move mountains, he boasts. I can wither trees and make their leaves fall.", "rj_71"),

 # ---------------------------------------------------------------- VI
 ("chapter", "VI|The Stone the Builders Rejected", "rj_92"),
 ("vo", "Solomon has a problem. A huge cornerstone lies on the ground, chosen for the top corner of the Temple. All the workmen, and all the demons together, cannot move it.", "rj_92"),
 ("vo", "So the flask goes under the stone. It lifts it, climbs the steps of the Temple, and sets it in place. And Solomon quotes the Psalm: the stone which the builders rejected has become the head of the corner.", "rj_92"),
 ("vo", "That verse, Psalm one eighteen, is the one the New Testament applies to Christ, and Christian readers would have heard the echo.", "dore_065"),
 ("vo", "Ephippas then brings up a second spirit from the bottom of the Red Sea, Abezethibod. He says he hardened Pharaoh's heart against Moses, and was trapped under the sea when the waters closed over the Egyptians.", "film_redsea"),
 ("vo", "Together the two spirits lift a huge column out of the sea, and hold it up in the air. Solomon seals them, and gives them one word: watch. They swear to hold it up until the end of the world.", "film_redsea"),

 # ---------------------------------------------------------------- VII
 ("chapter", "VII|The Fall of the King", "dore_051"),
 ("vo", "Now the book turns dark. The Bible says that Solomon loved many foreign women, and that in his old age his wives turned away his heart after other gods.", "dore_036"),
 ("vo", "The Testament tells its own version. Solomon falls in love with a Jebusite girl. Her priests demand that he worship their gods, Moloch and Raphan. He refuses.", "dore_051"),
 ("vo", "Then he is asked for something smaller. Take five locusts, and crush them in the name of Moloch. He does it. And at once, he says, the Spirit of God left him.", "dore_051"),
 ("vo", "He builds temples to idols. The king who commanded demons becomes, in his own words, the plaything of idols and demons.", "dore_008"),
 ("quote", "Wherefore I wrote out this Testament, that ye who get possession of it may pray, and attend to the last things, and not to the first.|Testament of Solomon 130 (F. C. Conybeare, 1898)", "dore_051"),

 # ---------------------------------------------------------------- VIII
 ("chapter", "VIII|Who Wrote It?", "mc_t"),
 ("vo", "The idea of Solomon as master of demons is old. Writing in the first century, the Jewish historian Josephus says that Solomon composed incantations to drive demons away. And he adds something he saw himself.", "dore_065"),
 ("quote", "I have seen a certain man of my own country, whose name was Eleazar, releasing people that were demoniacal in the presence of Vespasian, and his sons, and his captains.|Josephus, Antiquities 8.2.5 (W. Whiston, 1737)", "dore_065"),
 ("vo", "Eleazar, Josephus says, used a ring, and named Solomon. But the Testament itself is later. It is written in Greek, and it speaks of a savior born of a virgin and crucified.", "cony_1"),
 ("vo", "In 1922 Chester McCown, at the University of Chicago, published the first critical edition. He dated the book to the early third century, built on Jewish stories that may go back to the first.", "mc_t"),
 ("vo", "The manuscripts are late, most copied in the fifteenth and sixteenth centuries, and they disagree with one another. The first printed edition came out in 1837, and the first English translation, by Conybeare, in 1898.", "mc_g"),
 ("vo", "Then came the rings. In their 2025 study, Ittai Gradel and Nils Arne Pedersen argue that the inscription, Solomon says, watch out, only makes sense in the light of this story. If they are right, the book was already known by the second century.", "mc_t"),

 # ---------------------------------------------------------------- CLOSE
 ("chapter", "|The Wisdom and the Ring", "rj_101"),
 ("vo", "So what is the Testament of Solomon? A folk tale about a thumb sucking demon. A list of spirits and their cures. A story about a cornerstone. And a confession.", "rj_101"),
 ("vo", "Its Solomon has every power, and loses it for five locusts. The book ends not with the ring, but with a warning.", "dore_036"),
 ("vo", "Was it a Jewish legend that Christians rewrote, or a Christian book built from Jewish stories? Scholars still disagree.", "rj_65"),
 ("vo", "There are other lost books. The Book of Giants. The Gospel of Judas. The Book of Jasher, which the Bible itself cites.", "rj_65"),
 ("vo", "If you want to hear their stories, subscribe, and tell us in the comments which one we should open next.", "rj_65"),
 ("end", "THE LOST SCRIPTURES", "rj_65"),
]
