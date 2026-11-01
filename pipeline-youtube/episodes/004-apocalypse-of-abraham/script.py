# EPISODE 004: The Apocalypse of Abraham — the idol-maker's son, the angel Yahoel and the heavenly journey.
# Each entry: (kind, text, visual)
#   kind: "vo" narration | "quote" narration read over an on-screen quote card | "title" | "chapter" | "end"
#   visual: image key (see assets.py) or None to keep the previous one
# Quotes (public domain only): G. H. Box with J. I. Landsman, The Apocalypse of Abraham, translated from the Slavonic (SPCK, 1918).
# Genesis is cited from the King James Version. Modern translations (Rubinkiewicz 1983, Kulik 2004) are not quoted.

S = [
 # ---------------------------------------------------------------- COLD OPEN
 ("vo", "Genesis tells us almost nothing about Abraham's life before God called him.", "dore_011"),
 ("vo", "But an ancient Jewish book fills that silence. In it, young Abraham works in his father's idol shop. And he watches a wooden god burn in the kitchen fire.", "dore_055"),
 ("vo", "Then an angel carries him up into heaven, on the wing of a bird, to the throne of God.", "dore_041"),
 ("vo", "The book was probably written in Hebrew, almost two thousand years ago. Not one Hebrew copy is known. It survived only in Old Church Slavonic, in the monasteries of medieval Russia.", "tikh_l"),
 ("vo", "This is the Apocalypse of Abraham.", None),
 ("title", "THE APOCALYPSE OF ABRAHAM|The Idol-Maker's Son and the Journey to the Throne", "rs_101"),

 # ---------------------------------------------------------------- I
 ("chapter", "I|The Idol-Maker's Son", "dore_006"),
 ("vo", "The book opens in Abraham's own voice. His father, Terah, makes gods for a living. Gods of wood and stone, of gold and silver, of brass and iron.", "dore_006"),
 ("vo", "One day Abraham goes into the temple and finds the stone god Merumath fallen forward, at the feet of an iron god. It is too heavy to lift alone, so he fetches his father.", "dore_055"),
 ("vo", "Together they heave it upright. And the head falls off in Abraham's hands.", "dore_055"),
 ("vo", "Terah does not pray. He asks for an axe. He carves a new body from another stone, sets the old head on it, and smashes what is left.", "box_35"),
 ("vo", "Then he makes five more gods, and sends his son to sell them in the street.", "rs_77"),

 # ---------------------------------------------------------------- II
 ("chapter", "II|A God in the Fire", "rs_77"),
 ("vo", "On the road, Abraham meets merchants from Syria, leading camels down to Egypt. One camel groans. The donkey takes fright, bolts, and throws the gods to the ground. Three of them shatter.", "rs_77"),
 ("vo", "The merchants buy the two that survived, and pay for the broken ones too. Abraham throws the pieces into a river, and they sink. And on the way home he keeps thinking. These gods could not save themselves. How can they save anyone?", "rs_89"),
 ("vo", "Back home, Terah tells him to gather wood shavings and cook lunch. Under the chips Abraham finds a small wooden god. On its forehead is written its name: Barisat.", "dore_050"),
 ("vo", "He sets Barisat by the fire, and tells it to keep the flames going while he steps out. When he comes back, Barisat has fallen backwards into the fire, and is burning. Abraham bursts out laughing.", "dore_050"),
 ("vo", "At the meal he tells his father: do not thank Merumath, thank Barisat. He loved you so much, he threw himself into the fire to cook your food. And Terah answers:", "dore_050"),
 ("quote", "Great is the power of Barisat! I will make another to-day, and to-morrow he will prepare my food.|Apocalypse of Abraham 5 (G. H. Box, 1918)", "box_35"),

 # ---------------------------------------------------------------- III
 ("chapter", "III|The Voice From Heaven", "dore_044"),
 ("vo", "Now Abraham reasons it out, out loud. Fire is more worthy of honor than idols, because it burns them. But water puts out fire. The earth swallows water. The sun dries the earth. And night and clouds hide the sun, and the moon, and the stars.", "dore_044"),
 ("vo", "So none of them is God. God must be the one who made them all. And he says: may God reveal Himself to us.", "dore_001"),
 ("vo", "At that moment, a voice comes down from heaven, in a burst of fire.", "dore_041"),
 ("quote", "Thou art seeking in the understanding of thine heart the God of Gods and the Creator; I am He.|Apocalypse of Abraham 8 (G. H. Box, 1918)", "dore_041"),
 ("vo", "Leave your father's house, the voice says. Abraham walks out. Before he reaches the door of the courtyard, thunder falls, and burns the house of Terah to the ground.", "dore_050"),
 ("vo", "The editor, G. H. Box, noted a play on words behind the scene. Genesis says God brought Abraham out of Ur of the Chaldees. In Hebrew, ur can mean fire.", "box_t"),

 # ---------------------------------------------------------------- IV
 ("chapter", "IV|The Angel Yahoel", "film_climb"),
 ("vo", "The second half of the book begins where Genesis chapter fifteen begins. God asks Abraham for a sacrifice: a heifer, a she goat and a ram, each three years old, a turtledove and a pigeon.", "dore_007"),
 ("vo", "But first Abraham hears a voice so mighty that he falls to the ground like a stone. God sends an angel to raise him, an angel named Yahoel.", "dore_007"),
 ("vo", "The name joins the two Hebrew names of God, Yah and El. And the angel says that the ineffable Name itself dwells in him.", "box_44"),
 ("quote", "The appearance of his body was like sapphire, and the look of his countenance like chrysolite, and the hair of his head like snow.|Apocalypse of Abraham 11 (G. H. Box, 1918)", "dore_041"),
 ("vo", "Together they walk forty days and forty nights to the mountain of God, Horeb. Abraham eats no bread and drinks no water. His food, the text says, was to see the angel, and his speech was his drink.", "film_climb"),
 ("vo", "It is the same mountain where, in Exodus, Moses receives the Law, and where Elijah walks for forty days to hear the still small voice.", "rs_80"),

 # ---------------------------------------------------------------- V
 ("chapter", "V|The Unclean Bird", "rs_92"),
 ("vo", "On the mountain, Abraham prepares the sacrifice. In Genesis, birds of prey come down on the carcasses, and Abraham drives them away. Here, one bird comes down. And it speaks.", "rs_92"),
 ("vo", "What are you doing on the holy heights, it asks, where no one eats or drinks? Leave this man, and run, or they will burn you up.", "rs_86"),
 ("vo", "The angel tells Abraham who the bird is. Azazel.", "dore_002"),
 ("vo", "Azazel is an old name. In Leviticus, on the Day of Atonement, one goat is sent into the wilderness, for Azazel. The King James Bible calls it the scapegoat.", "dore_002"),
 ("vo", "In the Book of Enoch, Azazel is a leader of the fallen angels. In this book he is the tempter himself. And Yahoel tells him: the heavenly garment that was once yours is now kept for this man.", "dore_002"),

 # ---------------------------------------------------------------- VI
 ("chapter", "VI|On the Wings of a Dove", "dore_041"),
 ("vo", "At sunset, smoke rises like a furnace. The angel sets Abraham on the right wing of the pigeon, takes the left wing of the turtledove himself, and they rise into a fire, and into a light the book says no one can describe.", "dore_041"),
 ("vo", "A voice comes like the sound of many waters. Abraham and the angel bow down, and they sing a song of praise.", "rs_86"),
 ("vo", "Then Abraham sees a throne of fire. Under it, four fiery living creatures, each with four faces: a lion, a man, an ox and an eagle. Each with six wings.", "dore_041"),
 ("vo", "Readers of Ezekiel will know these creatures. But this book adds a strange detail. When they finish singing, they threaten one another. And part of Yahoel's job is to calm them.", "dore_044"),

 # ---------------------------------------------------------------- VII
 ("chapter", "VII|The Picture of the World", "dore_001"),
 ("vo", "From above, God tells Abraham to look down. He sees the heavens below him, and the stars, and he is asked to count them. He cannot. As the stars, God says, so will your descendants be.", "dore_001"),
 ("vo", "Then he sees the whole world, like a picture. On one side is the Garden of Eden. A man and a woman stand under a tree, and its fruit is like a bunch of grapes.", "dore_001"),
 ("quote", "Behind the tree was standing as it were a serpent in form, having hands and feet like a man's, and wings on its shoulders, six on the right side and six on the left.|Apocalypse of Abraham 23 (G. H. Box, 1918)", "dore_002"),
 ("vo", "It is Azazel again. The serpent of Genesis has become the fallen angel himself.", "dore_002"),

 # ---------------------------------------------------------------- VIII
 ("chapter", "VIII|A Temple in Flames", "dore_038"),
 ("vo", "Then the picture moves. Abraham sees the Temple of his descendants in Jerusalem, and a people from the left side rushes in through four entrances, and burns it.", "dore_056"),
 ("vo", "That vision is the main clue to the date. Roman soldiers burned the Temple in the year seventy. Most scholars think the book was written soon after, between about seventy and one hundred and fifty.", "dore_038"),
 ("vo", "Seen that way, it is a book about catastrophe. Why did God allow it? Its answer begins with Abraham, the first man to walk away from idols.", "dore_100"),

 # ---------------------------------------------------------------- IX
 ("chapter", "IX|The Road to Russia", "tikh_r"),
 ("vo", "So how did a Jewish book end up in Slavonic? The usual view is that it was translated first into Greek, then from Greek into Slavonic.", "tikh_r"),
 ("vo", "The oldest copy is the Codex Sylvester, a parchment book of saints' lives from the first half of the fourteenth century. The Apocalypse fills leaves one sixty four to one eighty two.", "tikh_l"),
 ("vo", "Other copies are hidden inside the Palaea, a medieval retelling of Old Testament history. There, Abraham's own I became he, a story told about him.", "tikh_r"),
 ("vo", "Nikolai Tikhonravov printed the text in Moscow in 1863. A German edition followed in 1897. The first English translation appeared in 1898, in a Latter day Saint magazine. And G. H. Box published his in London in 1918.", "bon_t"),
 ("vo", "Scholars still debate how the text was changed on the way. One passage, about a man who is insulted and beaten, and then worshipped, is widely seen as a later Christian addition. Some also suspect edits by the Bogomils, a medieval movement in the Balkans.", "box_44"),

 # ---------------------------------------------------------------- CLOSE
 ("chapter", "|The Friend of God", "rs_101"),
 ("vo", "So what is the Apocalypse of Abraham? A folk tale about an idol shop. A journey to the throne of God. And a book written by someone who had watched the Temple burn.", "rs_101"),
 ("vo", "It was lost in its own language, and saved in a language its author never knew.", "tikh_l"),
 ("vo", "And it all begins with a boy who laughed at a wooden god in the kitchen fire, and started asking who made the fire.", "dore_011"),
 ("vo", "There are other lost books. The Book of Giants. The Gospel of Judas. The Testament of Solomon.", "rs_80"),
 ("vo", "If you want to hear their stories, subscribe, and tell us in the comments which one we should open next.", "rs_80"),
 ("end", "THE LOST SCRIPTURES", "rs_80"),
]
