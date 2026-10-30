# EPISODE 002: The Book of Jubilees — "The Little Genesis" and its 364-day calendar.
# Each entry: (kind, text, visual)
#   kind: "vo" narration | "quote" narration read over an on-screen quote card | "title" | "chapter" | "end"
#   visual: image key (see assets.py) or None to keep the previous one
# Quotes: R. H. Charles, The Book of Jubilees or the Little Genesis (SPCK, 1917; public domain).

S = [
 # ---------------------------------------------------------------- COLD OPEN
 ("vo", "There is a book that claims it was dictated by an angel, to Moses, on the top of Mount Sinai.", "rs_89"),
 ("vo", "It says that Adam and Eve lived in the Garden of Eden for exactly seven years.", "dore_019"),
 ("vo", "That until the day they left, the animals could speak.", "dore_023"),
 ("vo", "And that God's year has three hundred and sixty-four days. Not one more, not one less.", "rs_113"),
 ("vo", "Among the Dead Sea Scrolls, it turned up in more copies than most books of the Bible.", "rd_204"),
 ("vo", "And yet, the only complete copies on earth survived in Ethiopia.", "ms_dill_1"),
 ("vo", "This is the Book of Jubilees.", None),
 ("title", "THE BOOK OF JUBILEES|The Little Genesis and Its Lost Calendar", "rs_95"),

 # ---------------------------------------------------------------- I
 ("chapter", "I|Forty Days on the Mountain", "rs_89"),
 ("vo", "In the Book of Exodus, Moses climbs Mount Sinai, and stays there forty days and forty nights.", "film_climb"),
 ("vo", "Exodus says he came down with the tablets of the law. The Book of Jubilees claims he was given something more.", "film_tablets"),
 ("quote", "This is the history of the division of the days... as the Lord spake to Moses on Mount Sinai.|Jubilees, Prologue (R. H. Charles, 1917)", "rs_86"),
 ("vo", "In the book, God turns to an angel, the angel of the presence, and gives an order.", "rs_74"),
 ("quote", "Write for Moses from the beginning of creation till My sanctuary has been built among them for all eternity.|Jubilees 1:27 (R. H. Charles, 1917)", "rs_86"),
 ("vo", "What follows is Genesis, and the first part of Exodus, told again. From the creation of the world to the escape from Egypt, with new details on almost every page.", "ms_dill_2"),
 ("vo", "Ancient Greek writers had a nickname for it. They called it the Little Genesis.", "dore_019"),

 # ---------------------------------------------------------------- II
 ("chapter", "II|History in Sevens", "ms_dill_3"),
 ("vo", "Its real name points to its big idea. In this book, history is counted in sevens.", "ms_dill_3"),
 ("vo", "Seven years make a week of years. Seven weeks of years, forty-nine years, make a jubilee.", "rs_77"),
 ("vo", "Every birth, every marriage, every journey of the patriarchs is dated by its jubilee, its week, and its year.", "dore_075"),
 ("vo", "At the very end, the angel does the arithmetic. Forty-nine jubilees have passed from Adam to the days of Moses, plus a few years. And forty more years remain in the desert.", "rs_77"),
 ("vo", "Add it up, and Israel crosses the Jordan exactly fifty jubilees after creation. Two thousand four hundred and fifty years. In this book, history runs like a clock.", "rd_195"),

 # ---------------------------------------------------------------- III
 ("chapter", "III|Seven Years in Eden", "dore_019"),
 ("vo", "With that clock in hand, the author fills the silences of Genesis.", "dore_019"),
 ("vo", "How long were Adam and Eve in the garden? Seven years, the book says. Angels taught Adam to tend it, and to work the ground.", "dore_019"),
 ("vo", "Then, in the second month, on the seventeenth day, the serpent came.", "dore_023"),
 ("vo", "And on the day they were sent out, something else came to an end.", "dore_023"),
 ("quote", "On that day was closed the mouth of all beasts... so that they could no longer speak: for they had all spoken one with another.|Jubilees 3:28 (R. H. Charles, 1917)", "rs_77"),
 ("vo", "Genesis has a talking serpent. Jubilees has an explanation: in Eden, every creature could talk.", "dore_023"),

 # ---------------------------------------------------------------- IV
 ("chapter", "IV|Cain, Enoch and the Watchers", "dore_027"),
 ("vo", "The details keep coming. Adam and Eve have a daughter named Awan, and Cain takes her as his wife.", "dore_027"),
 ("vo", "Genesis never says how Cain died. Jubilees does. His house fell on him. He had killed Abel with a stone, the book says, and by a stone he was killed, in righteous judgment.", "dore_027"),
 ("vo", "Then comes Enoch, the man from our last film. Jubilees calls him the first human being to learn writing, and to write down the signs of heaven in a book.", "ms_dill_4"),
 ("vo", "The author clearly knew the Book of Enoch. Here too, the angels called Watchers come down to earth, and the world is corrupted before the Flood.", "dore_031"),

 # ---------------------------------------------------------------- V
 ("chapter", "V|The Prince Mastema", "dore_035"),
 ("vo", "After the Flood, the ark comes to rest on a mountain the book calls Lubar, one of the mountains of Ararat.", "dore_031"),
 ("vo", "But evil outlives the water. Unclean spirits begin to lead Noah's grandchildren astray. Noah prays, and God orders the angels to bind them all.", "dore_035"),
 ("vo", "Then their chief steps forward. The book calls him Mastema.", "rd_213"),
 ("quote", "Lord, Creator, let some of them remain before me, and let them hearken to my voice.|Jubilees 10:8 (R. H. Charles, 1917)", "rd_213"),
 ("vo", "And God agrees. Nine parts of the spirits are bound. One tenth are left free, until the judgment.", "dore_035"),
 ("vo", "So the angels teach Noah the medicines of the earth, how to heal with herbs. Noah writes it all in a book, and gives it to his son Shem.", "ms_dill_2"),
 ("vo", "In Jubilees, Mastema is the accuser and the tester. The book itself ties him to the figure later readers would simply call Satan.", "dore_039"),

 # ---------------------------------------------------------------- VI
 ("chapter", "VI|Abram and the Ravens", "rd_219"),
 ("vo", "Genesis tells us almost nothing about Abraham as a boy. Jubilees tells his childhood.", "rd_219"),
 ("vo", "Mastema sends ravens to steal the seed from the fields, and the land goes hungry.", "rd_195"),
 ("vo", "Abram is fourteen when a cloud of ravens comes down. He runs to meet them and cries out: go back to the place you came from. And they turn back. Seventy times that day.", "rd_219"),
 ("vo", "The boy also sees that the idols his family serves cannot help anyone.", "dore_039"),
 ("vo", "At sixty, he rises in the night and sets fire to the house of the idols. His brother Haran rushes in to save the gods, and dies in the flames.", "dore_039"),
 ("vo", "It is one of the earliest written versions of a story still told today: Abraham, the breaker of idols.", "dore_043"),

 # ---------------------------------------------------------------- VII
 ("chapter", "VII|The 364-Day Year", "rs_113"),
 ("vo", "But the heart of Jubilees is not a story. It is a calendar.", "rs_113"),
 ("vo", "In the angel's words to Moses, the year is ruled by the sun, not the moon.", "rs_77"),
 ("quote", "Observe the years according to this reckoning, three hundred and sixty-four days, and these will constitute a complete year.|Jubilees 6:32 (R. H. Charles, 1917)", "ms_ch17p"),
 ("vo", "Three hundred and sixty-four days is exactly fifty-two weeks. So in this calendar, every date falls on the same day of the week, every single year. A festival can never collide with the Sabbath.", "rs_95"),
 ("vo", "For the author, this was not a technicality. Anyone who follows the moon, the book warns, will keep the holy days on the wrong days, and mix the holy with the unclean.", "ms_dill_3"),
 ("vo", "The same three hundred and sixty-four day year appears in the astronomical part of the Book of Enoch, and again in the Dead Sea Scrolls.", "rd_204"),

 # ---------------------------------------------------------------- VIII
 ("chapter", "VIII|The Law Before Moses", "dore_043"),
 ("vo", "Jubilees has one more bold idea. The laws given to Moses were not new. They were written on heavenly tablets from the beginning.", "film_tablets"),
 ("vo", "So the patriarchs keep them, long before Sinai. Noah celebrates the Feast of Weeks. Abraham celebrates the Feast of Tabernacles. Even the highest angels keep the Sabbath in heaven.", "dore_043"),
 ("vo", "And Levi, the son of Jacob, is chosen for the priesthood.", "dore_071"),
 ("vo", "That is one reason scholars think the author was a priest. Most date the book to the second century before Christ, around the time of the Maccabean revolt, when Jewish identity itself was under pressure.", "rs_74"),

 # ---------------------------------------------------------------- IX
 ("chapter", "IX|The Road to Ethiopia", "ms_dill_1"),
 ("vo", "Jubilees was written in Hebrew. It was translated into Greek, and from Greek into Latin, and into Ge'ez, the classical language of Ethiopia.", "ms_dill_1"),
 ("vo", "Early Christian writers quoted the Greek version. But over the centuries, most churches stopped copying it, and the Greek and Hebrew texts were lost.", "dore_063"),
 ("vo", "In Ethiopia, it never went away. The Ethiopian Orthodox Tewahedo Church counts it as scripture, under the name Kufale, the Book of Divisions.", "ms_dill_4"),
 ("vo", "European scholars rediscovered it in the nineteenth century. In 1859, August Dillmann printed the Ethiopic text.", "ms_dill_2"),
 ("vo", "Two years later, in Milan, Antonio Ceriani published part of a Latin version, from a palimpsest. A fifth-century copy, scraped clean around the eighth century so the parchment could be reused, but still faintly legible underneath.", "rs_95"),
 ("vo", "And in 1902, R. H. Charles published the English translation you have seen on screen.", "ms_ch17"),

 # ---------------------------------------------------------------- X
 ("chapter", "X|The Caves", "rd_204"),
 ("vo", "Then, beginning in 1947, the caves near Qumran, by the Dead Sea, began to give up their scrolls.", "rd_204"),
 ("vo", "Among them, scholars identified about fifteen copies of Jubilees, in Hebrew, from five different caves.", "rd_213"),
 ("vo", "Only a handful of biblical books are better represented. Psalms. Deuteronomy. Isaiah. Exodus. Genesis.", "rd_207"),
 ("vo", "One of the community's own texts, the Damascus Document, even refers to the book by its full title: the division of the times into their jubilees and their weeks.", "rd_195"),
 ("vo", "The lost Hebrew original was real. And the copy that had survived in Ethiopia, through two translations, had carried it across two thousand years.", "ms_dill_3"),

 # ---------------------------------------------------------------- CLOSE
 ("chapter", "|Scripture or Story?", "rs_74"),
 ("vo", "So what is the Book of Jubilees? A retelling? A commentary? Or scripture?", "rs_74"),
 ("vo", "At Qumran, it seems to have carried real authority. In Ethiopia, it is part of the Bible. For most other traditions, it remained an ancient retelling, outside the canon.", "ms_dill_1"),
 ("vo", "Either way, it shows how carefully ancient readers read Genesis. They asked questions of every silence, and they tried to answer them.", "dore_071"),
 ("vo", "And it holds on to one dream: a perfect year, in step with heaven, where every holy day falls exactly where it should.", "rs_113"),
 ("vo", "There are other lost books. The Gospel of Thomas. The Apocalypse of Abraham. The Book of Giants.", "rs_95"),
 ("vo", "If you want to hear their stories, subscribe, and tell us in the comments which one we should open next.", "rs_95"),
 ("end", "THE LOST SCRIPTURES", "rs_95"),
]
