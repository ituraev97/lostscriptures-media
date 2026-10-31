# EPISODE 003: The Gospel of Thomas — 114 sayings, two discoveries fifty years apart.
# Each entry: (kind, text, visual)
#   kind: "vo" narration | "quote" narration read over an on-screen quote card | "title" | "chapter" | "end"
#   visual: image key (see assets.py) or None to keep the previous one
# Quotes (public domain only): B. P. Grenfell & A. S. Hunt, Logia Iesou: Sayings of Our Lord (1897) and
# New Sayings of Jesus (1904). Modern translations of the Coptic text are copyrighted and are only summarised.

S = [
 # ---------------------------------------------------------------- COLD OPEN
 ("vo", "In December 1945, a farmer digging for fertilizer under a cliff in Upper Egypt struck a large clay jar.", "re_168"),
 ("vo", "Inside were thirteen old books, bound in leather.", "re_224"),
 ("vo", "One of them held a gospel that had not been read in full for well over a thousand years.", "copt_1"),
 ("vo", "It has no manger, no miracles, and no crucifixion. Only sayings of Jesus. One hundred and fourteen of them.", "dore_063"),
 ("vo", "And the strangest part: scholars had already been reading pieces of it, in Greek, for almost fifty years, without knowing what it was.", "pox1_v"),
 ("vo", "This is the Gospel of Thomas.", None),
 ("title", "THE GOSPEL OF THOMAS|114 Sayings from a Jar in the Desert", "re_208"),

 # ---------------------------------------------------------------- I
 ("chapter", "I|The Rubbish Heaps", "re_36"),
 ("vo", "Our story starts half a century earlier, in the winter of 1896 to 1897, on the edge of the desert, about a hundred and twenty miles south of Cairo.", "re_36"),
 ("vo", "Two young Oxford scholars, Bernard Grenfell and Arthur Hunt, were digging at a village called Behnesa. In Roman times it had been a busy city: Oxyrhynchus.", "re_92"),
 ("vo", "They were not looking for temples or tombs. They were looking for paper. And in the town's ancient rubbish heaps they found it, in enormous quantities. Letters, contracts, tax lists, and books, mostly in Greek.", "re_96"),
 ("vo", "At the very beginning of their work on the town, they picked up a single leaf from a papyrus book. Less than six inches tall.", "pox1_v"),
 ("vo", "The handwriting, they judged, was probably not much later than the year two hundred.", "pox1_r"),

 # ---------------------------------------------------------------- II
 ("chapter", "II|Jesus Saith", "pox1_t"),
 ("vo", "The leaf was a list. Saying after saying, each one opening with the same two words: Jesus saith.", "pox1_v"),
 ("vo", "Some were familiar. A prophet is not acceptable in his own country. But then it went on: neither doth a physician work cures upon them that know him.", "dore_066"),
 ("quote", "A city built upon the top of a high hill, and stablished, can neither fall nor be hid.|Oxyrhynchus Papyrus 1 (Grenfell & Hunt, 1897)", "dore_063"),
 ("vo", "Others were completely new. And one of them puzzled readers more than all the rest.", "pox1_r"),
 ("quote", "Raise the stone and there thou shalt find me, cleave the wood and there am I.|Oxyrhynchus Papyrus 1 (Grenfell & Hunt, 1897)", "re_224"),
 ("vo", "Grenfell and Hunt published the leaf within months, as Sayings of Our Lord. And it set off years of debate. Where had these sayings come from?", "pox1_t"),

 # ---------------------------------------------------------------- III
 ("chapter", "III|A Name in the Prologue", "pox654"),
 ("vo", "In 1903 the two men returned to Oxyrhynchus. And, as they put it, by a curious stroke of good fortune, it happened again.", "re_92"),
 ("vo", "This time the sayings were copied on the back of an old land survey list. And this fragment had something the first one lacked. The beginning.", "pox654"),
 ("quote", "These are the... words which Jesus the living (Lord) spake to... and Thomas.|Oxyrhynchus Papyrus 654 (Grenfell & Hunt, 1904)", "pox654"),
 ("vo", "The first saying followed. Every one that hearkens to these words shall never taste of death.", "ns_t"),
 ("quote", "Let not him who seeks... cease until he finds, and when he finds he shall be astonished.|Oxyrhynchus Papyrus 654 (Grenfell & Hunt, 1904)", "dore_092"),
 ("vo", "A name, Thomas, right in the opening line. Grenfell and Hunt knew of a Gospel of Thomas. But all anyone knew of it was a book of childhood stories, and one odd quotation in a church writer named Hippolytus.", "dore_061"),
 ("vo", "So they weighed the idea, and set it aside. The Gospel of Thomas, they concluded, was not a suitable source. They were wrong. But no one could know it yet.", "ns_t"),

 # ---------------------------------------------------------------- IV
 ("chapter", "IV|The Jar at the Foot of the Cliff", "re_168"),
 ("vo", "Now, back to December 1945, near the town of Nag Hammadi. Here the Nile bends below a long cliff called the Jabal al-Tarif, honeycombed with more than a hundred and fifty caves.", "re_168"),
 ("vo", "A man named Muhammad Ali al-Samman and his brothers were digging for sabakh, a soft soil used as fertilizer. By a large boulder, they hit a red clay jar, almost a meter high.", "re_224"),
 ("vo", "He later said he was afraid to open it. A jinn might be inside. Then he thought it might hold gold, and he smashed it.", "re_208"),
 ("vo", "No gold. Just papyrus books in leather covers. He carried them home, and his mother, by her own account, burned some of the pages in the oven.", "re_194"),
 ("vo", "Caught up in a family blood feud, he feared the police would search his house, so he left books with a local priest. From there, they began to drift toward the antiquities dealers of Cairo.", "re_32"),
 ("vo", "Most were taken in by the Egyptian government, and today they are in the Coptic Museum in Cairo. One codex left the country and was bought for the Jung Institute in Zurich, before it too came back.", "re_198"),
 ("vo", "Al-Samman told this story decades later, and some scholars question parts of it. But the books are real.", "re_168"),

 # ---------------------------------------------------------------- V
 ("chapter", "V|Didymus Judas Thomas", "copt_2"),
 ("vo", "The books are written in Coptic, the last stage of the Egyptian language, written with Greek letters. They were copied in the fourth century, most likely around the middle of it.", "copt_2"),
 ("vo", "They hold more than fifty texts. Most had been lost for centuries. The second text in the book now called Codex Two is the Gospel of Thomas.", "copt_1"),
 ("vo", "Its opening line says that these are the words of the living Jesus, written down by Didymus Judas Thomas.", "dore_082"),
 ("vo", "Thomas means twin, in Aramaic. Didymus means twin, in Greek. The Gospel of John calls him Thomas, which is called Didymus. The disciple remembered for saying he would not believe until he saw.", "dore_082"),
 ("vo", "Later tradition sent Thomas east, to Syria, and to India. And many scholars link this gospel to early Christians in Syria, where he was known as Judas Thomas.", "dore_092"),

 # ---------------------------------------------------------------- VI
 ("chapter", "VI|The Pieces Fall Into Place", "pox1_v"),
 ("vo", "Once scholars read the Coptic text in the 1950s, the old Greek fragments lit up.", "pox1_v"),
 ("vo", "The second Oxyrhynchus fragment was the prologue and the first sayings of Thomas. The 1897 leaf held sayings from the middle. A third scrap, published in 1904, held a few more, including one about the lilies, which grow but spin not.", "pox654"),
 ("vo", "Even the stone and the wood were there. In the Coptic version, those words close a saying in which Jesus says he is the light that is over all things.", "re_224"),
 ("vo", "But the Greek and the Coptic are not identical. Some sayings are worded differently, and some sit in a different order. The text was still changing as it was copied.", "copt_2"),
 ("vo", "Three Greek copies from one town tell us this gospel was being read in Egypt by the third century, a hundred years before the jar was buried.", "re_96"),
 ("vo", "The Coptic text was published in photographs in 1956. The first English translation followed in 1959.", "copt_1"),

 # ---------------------------------------------------------------- VII
 ("chapter", "VII|No Story, Only Sayings", "dore_063"),
 ("vo", "So what is inside? No birth, no healings, no trial, no empty tomb. Just short sayings, parables and dialogues, one after another.", "dore_063"),
 ("vo", "Close to two thirds of them have parallels in Matthew, Mark and Luke. The sower. The mustard seed. The blind leading the blind. The prophet without honor at home.", "dore_067"),
 ("vo", "Others have no parallel at all. Again and again, the gospel turns inward. The kingdom, it says, is not in the sky or in the sea, but inside you, and all around you, and people do not see it.", "dore_078"),
 ("vo", "Knowing yourself matters. Seeking matters. And the first saying makes a promise: whoever finds the meaning of these words will not taste death.", "dore_092"),

 # ---------------------------------------------------------------- VIII
 ("chapter", "VIII|Early or Late?", "pox1_r"),
 ("vo", "And that raises the biggest question. When was it written?", "pox1_r"),
 ("vo", "One group of scholars argues that its core goes back to the first century. Its sayings are short, with no story around them, and some look independent of the four gospels.", "dore_066"),
 ("vo", "Another group dates it to the second century, and sees it drawing on Matthew, Mark and Luke. Encyclopaedia Britannica places it in the middle of the second century.", "dore_062"),
 ("vo", "In 1993, the Jesus Seminar printed it alongside the four gospels, in a book called The Five Gospels. Many other scholars disagreed, sharply.", "ns_t"),
 ("vo", "Most agree on one thing: the text we have grew in layers, over time. The debate is about how early the first layer is.", "copt_2"),

 # ---------------------------------------------------------------- IX
 ("chapter", "IX|The Other Thomas", "dore_061"),
 ("vo", "Do not confuse it with the Infancy Gospel of Thomas. That is a different book, full of stories about Jesus as a boy, like the clay sparrows that fly away.", "dore_061"),
 ("vo", "In 2024, papyrologists in Hamburg identified a small Greek fragment of that childhood gospel, among the oldest copies known. It made headlines. But it is not this book.", "dore_059"),
 ("vo", "Early church writers knew of a gospel under Thomas's name. Hippolytus says a group called the Naassenes quoted it. Origen and Eusebius name it among books the church did not accept.", "re_198"),
 ("vo", "And why was it buried in a jar? No one knows. Some scholars suggest monks from a monastery nearby. Others suggest a private reader. The jar does not tell us.", "re_168"),

 # ---------------------------------------------------------------- CLOSE
 ("chapter", "|The Living Jesus", "re_208"),
 ("vo", "So what is the Gospel of Thomas? A window onto some of the earliest sayings of Jesus? Or a second century reading of them?", "re_208"),
 ("vo", "Either way, it is the only complete gospel from antiquity made of nothing but his sayings. Found twice. First in pieces, in a rubbish heap. Then whole, in a jar.", "pox1_v"),
 ("vo", "And it has been asking its readers the same thing for eighteen centuries. Keep seeking, until you find.", "dore_092"),
 ("vo", "There are other lost books. The Apocalypse of Abraham. The Book of Giants. The Gospel of Judas.", "re_96"),
 ("vo", "If you want to hear their stories, subscribe, and tell us in the comments which one we should open next.", "re_96"),
 ("end", "THE LOST SCRIPTURES", "re_96"),
]
