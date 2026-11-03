# EPISODE 006: The Book of Giants — the Watchers' sons, their dreams of the Flood, and a lost book found twice:
# in the ruins of a Silk Road city (Turfan, Manichaean fragments, Henning 1943) and in the caves of Qumran (Milik 1976).
# Each entry: (kind, text, visual)
#   kind: "vo" narration | "quote" narration read over an on-screen quote card | "title" | "chapter" | "end"
#   visual: image key (see assets.py) or None to keep the previous one
# Quotes (public domain only): KJV (Genesis 6:4, Daniel 7:10, Baruch 3:26-28); R. H. Charles, The Book of Enoch (SPCK, 1917), 1 Enoch 15:8;
# M. R. James, The Lost Apocrypha of the Old Testament (SPCK, 1920), pp. xiii and 40 (his English of the Gelasian Decree entry).
# The Book of Giants itself is known only from modern editions (Milik 1976, Stuckenbruck 1997, Davila 2013, Henning 1943):
# its scenes are summarised in our own words, never quoted.

S = [
 # ---------------------------------------------------------------- COLD OPEN
 ("vo", "Among the Dead Sea Scrolls is a book that is not in any Bible. It was copied there more often than many books that are.", "rd_204"),
 ("vo", "It tells the story of the giants who lived before the Flood. And one of those giants has a famous name: Gilgamesh.", "dore_004"),
 ("vo", "The same book turned up a second time, far away, in the ruins of a city on the Silk Road, in fragments written in Persian and Turkic.", "ch_296"),
 ("vo", "In 1920, a Cambridge scholar knew it only as a title on an ancient list. How we should like to have that book, he wrote. Within half a century, both halves of it had been found.", "jm_og"),
 ("vo", "This is the Book of Giants.", None),
 ("title", "THE BOOK OF GIANTS|The Watchers' Sons and the Coming Flood", "dore_004"),

 # ---------------------------------------------------------------- I
 ("chapter", "I|Giants in the Earth", "dore_006"),
 ("vo", "The Bible gives the story only four verses, just before the Flood. The sons of God see that the daughters of men are beautiful, and take them as wives.", "dore_006"),
 ("quote", "There were giants in the earth in those days; and also after that, when the sons of God came in unto the daughters of men, and they bare children to them, the same became mighty men which were of old, men of renown.|Genesis 6:4 (King James Version)", "dore_100"),
 ("vo", "Who were these giants? The Hebrew word is Nephilim, and Genesis says no more.", "dore_006"),
 ("vo", "The Book of Enoch says much more. Two hundred angels, the Watchers, come down on Mount Hermon. Their children are giants who devour the earth, and God answers with the Flood. We told that story in our very first episode.", "rh_161"),
 ("vo", "The Book of Giants picks up where Enoch leaves off. It is told from the other side: from the point of view of the giants themselves.", "rh_161"),

 # ---------------------------------------------------------------- II
 ("chapter", "II|A Title on a List", "jm_gel"),
 ("vo", "For centuries, all that survived was a single line. A Latin list of books, traditionally credited to Pope Gelasius, sorts the writings that circulated in the churches. Many are marked as apocryphal, to be kept apart from Scripture.", "jm_gel"),
 ("vo", "One entry is unlike any other.", "jm_gel"),
 ("quote", "The book concerning the giant named Ogias, who is stated by the heretics to have fought with a dragon after the Flood.|The Gelasian Decree, tr. M. R. James (1920)", "dore_040"),
 ("vo", "Montague Rhodes James, the Cambridge scholar best known today for his ghost stories, collected every such lost title in 1920. Of this one he wrote: how we should like to have the book in which such stirring incidents were related.", "jm_og"),
 ("vo", "Who were the heretics? James made a guess. A Byzantine list of Manichaean books, he noted, includes a treatise of the giants. Perhaps the Book of Og was a Manichaean book. He was right.", "jm_og"),

 # ---------------------------------------------------------------- III
 ("chapter", "III|The Ruins of Kocho", "ch_296"),
 ("vo", "Mani was a prophet born in Mesopotamia in the third century. He founded a religion that spread from Roman North Africa, where the young Augustine followed it for nine years, all the way to China.", "ch_32"),
 ("vo", "Mani wrote his own scriptures, and he wanted them copied with care, often on fine paper, with painted pictures. One of his books, according to Manichaean sources and Arabic book lists, was called the Book of Giants.", "ch_44"),
 ("vo", "Between 1902 and 1914, four German expeditions dug in the Turfan oasis, in what is now western China. At the ruined city of Kocho, Albert von Le Coq found the remains of Manichaean buildings, wall paintings, and thousands of manuscript fragments.", "ch_296"),
 ("vo", "Many were Manichaean, in Middle Persian, Sogdian and Old Turkic. In the eighth century, the Uyghur rulers of this region had made Manichaeism their state religion.", "ch_45"),
 ("vo", "In 1943, Walter Bruno Henning, a German scholar of Iranian languages, gathered the scattered pieces that mention the giants, and published them under one title: The Book of the Giants. The book on the Gelasian list was no longer just a title.", "ch_40"),

 # ---------------------------------------------------------------- IV
 ("chapter", "IV|The Caves by the Dead Sea", "rg_213"),
 ("vo", "Then came the second discovery. In 1947, near the Dead Sea, Bedouin shepherds found the first scrolls in a cave above Qumran. In 1952, the richest cave of all, Cave Four, gave up about fifteen thousand fragments.", "rg_213"),
 ("vo", "Among them, the Polish priest and scholar Jozef Milik recognised something. Scraps in Aramaic, with names he had already seen in the fragments from Turfan.", "rd_204"),
 ("vo", "Milik announced the match in 1971, and published the fragments in 1976. Mani had not invented this book. He had taken an older Jewish book about the giants, and made it his own.", "rg_213"),
 ("vo", "Scholars now count the remains of about ten copies from Qumran, from Caves One, Two, Four and Six. Most date the original to the third or second century before Christ.", "rg_213"),
 ("vo", "The pieces are small, and their order is debated. But read side by side with the Manichaean fragments, they let us follow the story.", "rd_204"),

 # ---------------------------------------------------------------- V
 ("chapter", "V|Two Dreams", "dore_017"),
 ("vo", "The giants rule the earth. They kill, they enslave, and they eat. Among the giants named in the scrolls are two sons of Shemihazah, the leader of the Watchers. Their names are Ohyah and Hahyah.", "dore_040"),
 ("vo", "One night, both brothers have dreams. Hahyah dreams of a garden. Gardeners water it, and great trees grow, with many shoots. Then a flood of water and fire comes, and the garden is destroyed.", "dore_008"),
 ("vo", "In another dream, a tablet with writing on it is thrown into the water, and the writing is washed away.", "dore_004"),
 ("vo", "A medieval Hebrew retelling of the story keeps a version of these dreams. In it, every tree in the garden is cut down except one, with three branches: Noah and his three sons.", "dore_005"),
 ("vo", "The giants gather and talk the dreams over. No one among them can explain them. But they know who can: Enoch, the scribe, who lives apart from men.", "dore_017"),

 # ---------------------------------------------------------------- VI
 ("chapter", "VI|The Flight of Mahaway", "rh_161"),
 ("vo", "They send a messenger, a giant named Mahaway, the son of another Watcher. And Mahaway flies.", "rh_161"),
 ("vo", "In the Aramaic fragments, he crosses the great desert until Enoch sees him and calls out to him. In a Manichaean fragment, he flies at sunrise, and a voice warns him to come down, before the sun sets his wings on fire.", "rt_155"),
 ("vo", "Enoch's answer comes on two tablets. Part of the second one survives. It is a letter from Enoch the scribe, to Shemihazah and all his companions.", "dore_054"),
 ("vo", "The letter says that their deeds are known in heaven, and that the archangel Raphael has seen them. Destruction is coming. Set free the ones you hold, it says, and pray.", "dore_054"),

 # ---------------------------------------------------------------- VII
 ("chapter", "VII|Gilgamesh Among the Giants", "dore_045"),
 ("vo", "Now the strangest names in the book appear. Two of the giants are called Gilgamesh and Hobabish.", "dore_045"),
 ("vo", "Gilgamesh is the king of Uruk, the hero of the oldest epic in the world. Hobabish echoes Humbaba, the monster of the cedar forest whom Gilgamesh kills in that same epic. Here both of them are giants, on the wrong side of the story.", "dore_006"),
 ("vo", "Why are they here? Some scholars read it as a Jewish answer to Babylonian myth: your famous heroes were the giants God destroyed. Others are more cautious. The fragments are too small to be sure.", "dore_006"),
 ("vo", "In one broken passage a giant admits that he cannot win a war against heaven. And Ohyah has a second dream. The Ruler of heaven comes down to the earth. Thrones are set up. The great judge sits. And books are opened.", "dore_049"),
 ("vo", "Readers of the Bible know that scene, from the seventh chapter of Daniel.", "dore_049"),
 ("quote", "The judgment was set, and the books were opened.|Daniel 7:10 (King James Version)", "dore_096"),
 ("vo", "Did one book borrow from the other? Some scholars think the giants' version is even older than Daniel's. The debate is still open.", "dore_049"),

 # ---------------------------------------------------------------- VIII
 ("chapter", "VIII|The End of the Giants", "dore_096"),
 ("vo", "The Aramaic ending is lost. The Manichaean fragments tell the battle. Four archangels come down. The Watchers try to hide among human beings, and are separated out, and bound.", "dore_096"),
 ("vo", "Ohyah fights Leviathan, the monster of the sea. Then he fights the archangel Raphael. And there, perhaps, is the Gelasian Decree's lost line: a giant who fought a dragon.", "dore_045"),
 ("vo", "The rest is the Flood.", "film_wave"),
 ("vo", "But the Enoch tradition says the giants did not entirely disappear. Their bodies died. Their spirits did not.", "film_city"),
 ("quote", "And now, the giants, who are produced from the spirits and flesh, shall be called evil spirits upon the earth, and on the earth shall be their dwelling.|1 Enoch 15:8 (R. H. Charles, 1917)", "dore_100"),
 ("vo", "In this tradition, the evil spirits of later stories are the ghosts of the giants. And a book found in Catholic and Orthodox Bibles remembers the giants too.", "dore_046"),
 ("quote", "There were the giants famous from the beginning, that were of so great stature, and so expert in war... But they were destroyed, because they had no wisdom, and perished through their own foolishness.|Baruch 3:26, 28 (King James Version, Apocrypha)", "dore_046"),

 # ---------------------------------------------------------------- CLOSE
 ("chapter", "|What the Giants Dreamed", "rd_204"),
 ("vo", "So what is the Book of Giants? A Jewish story that fills the silence of four verses in Genesis. A book that the followers of Mani carried across Asia. And a book that we still only have in pieces.", "rd_204"),
 ("vo", "Its giants are not just monsters. They dream, they argue, they are afraid. They send a messenger to ask what their future holds, and they do not like the answer.", "dore_017"),
 ("vo", "Was the book a warning to its readers, or an answer to the myths of Babylon? Or both? Scholars still disagree.", "ch_44"),
 ("vo", "There are other lost books. The Gospel of Judas. The Book of Jasher, which the Bible itself cites. And the Ethiopian Bible, with eighty one books.", "rt_155"),
 ("vo", "If you want to hear their stories, subscribe, and tell us in the comments which one we should open next.", "rt_155"),
 ("end", "THE LOST SCRIPTURES", "rt_155"),
]
