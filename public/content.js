// Shared lesson content and lesson-spec logic. Imported by the app (app.js) and the Cloudflare functions.
const UNITS=[
{t:"The Big Picture",ref:"Gen 1 → Rev 22",sub:"What the Bible is and how it fits together.",lessons:[
 {t:"What the Bible is",cards:[
  {h:"A library, not a single book",b:["The word Bible comes from the Greek <i>biblia</i>, meaning \"books.\" Protestant Bibles contain 66 books. Catholic Bibles have 73 and Orthodox Bibles a few more, because they include extra books from the Greek Old Testament.","They were written over roughly 1,500 years by around 40 authors: kings, shepherds, fishermen, a doctor, a tax collector."]},
  {h:"Three languages",b:["The Old Testament is mostly Hebrew, with some Aramaic. The New Testament is Greek, the common language of the Roman world.","Every English Bible is a translation. That is why versions like the KJV, NIV, and ESV read differently."]},
  {h:"Two testaments",b:["The Old Testament (39 books) covers creation and the story of Israel. It is the Hebrew Bible that Judaism also reads, arranged differently.","The New Testament (27 books) covers Jesus and the first Christians. \"Testament\" means covenant, a binding agreement."]}],
 q:[["How many books are in a Protestant Bible?",["39","66","73","100"],1,"39 Old Testament + 27 New Testament = 66."],
    ["What language was the New Testament written in?",["Hebrew","Latin","Greek","Aramaic"],2,"Greek was the shared language across the Roman Empire."],
    ["What does \"testament\" mean here?",["A will","A covenant or agreement","A book","A prophecy"],1,"The two testaments are the old and new covenants."]]},
 {t:"How it's organized",cards:[
  {h:"Old Testament sections",b:["<b>Law (5):</b> Genesis to Deuteronomy. Jews call it the Torah.","<b>History (12):</b> Joshua to Esther.","<b>Wisdom and Poetry (5):</b> Job, Psalms, Proverbs, Ecclesiastes, Song of Songs.","<b>Prophets (17):</b> 5 \"major\" (long) and 12 \"minor\" (short)."]},
  {h:"New Testament sections",b:["<b>Gospels (4):</b> Matthew, Mark, Luke, John. Four accounts of Jesus.","<b>Acts (1):</b> how the church started.","<b>Letters (21):</b> 13 traditionally credited to Paul, plus 8 others.","<b>Revelation (1):</b> visions of the end."]},
  {h:"Reading a reference",b:["<span class=\"card-ref\">John 3:16</span> means the book of John, chapter 3, verse 16.","Chapter and verse numbers were added more than a thousand years after the books were written, to make finding passages easier."]}],
 q:[["What are the first five books called in Judaism?",["The Gospels","The Torah","The Psalms","The Prophets"],1,"Torah means instruction or law."],
    ["In \"Luke 15:11\", what is 15?",["The verse","The chapter","The book number","The page"],1,"Book, then chapter, then verse."],
    ["What makes a prophet \"minor\"?",["Less important","Shorter book","Younger age","Fewer followers"],1,"It is about length, not importance."]]},
 {t:"The storyline",cards:[
  {h:"One big story",b:["Read as a whole, the Bible tells a story in movements: <b>Creation</b>, <b>Fall</b>, <b>Israel</b>, <b>Jesus</b>, <b>Church</b>, <b>New Creation</b>.","Most individual stories you know slot into one of these."]},
  {h:"Old Testament arc",b:["God makes a good world. Humans rebel. God picks one family (Abraham's) to bless the world through. That family becomes Israel, gets rescued from Egypt, gets a land and kings, then loses it all in exile.","It ends with prophets promising a future king and restoration."]},
  {h:"New Testament arc",b:["Christians read Jesus as that promised king. The Gospels tell his life, death, and resurrection. Acts and the letters show his followers spreading the message. Revelation pictures the world finally made new."]}],
 q:[["Which comes first in the storyline?",["Israel","The Fall","Jesus","Church"],1,"Creation, then the Fall, then Israel."],
    ["Whose family did God choose to bless the world through?",["Noah's","Moses'","Abraham's","David's"],2,"Abraham's family became the nation of Israel."],
    ["How does the Old Testament end?",["With Jesus' birth","With prophets promising restoration","With creation","With the Exodus"],1,"Malachi, the last book, looks forward to a coming messenger."]]}]},
{t:"Beginnings",ref:"Genesis",sub:"Creation, the fall, and the first families.",lessons:[
 {t:"Creation",cards:[
  {h:"In the beginning",b:["Genesis 1 describes God creating in six days: light, sky, land and plants, sun and moon, sea creatures and birds, then land animals and humans. On the seventh day God rests.","That rest is the root of the Sabbath."]},
  {h:"The image of God",b:["Humans are made \"in the image of God,\" male and female. Many read this as humans representing God and caring for the world.","Christians and Jews differ widely on whether the six days are literal or poetic."],ref:"Gen 1:27"},
  {h:"The garden",b:["Genesis 2 zooms in: God forms Adam from dust, plants the garden of Eden, and makes Eve from Adam's side.","Two trees stand out: the tree of life and the tree of the knowledge of good and evil."]}],
 q:[["What happens on the seventh day?",["Humans are made","God rests","The flood","Light is made"],1,"The seventh day is the day of rest."],
    ["What is the name of the garden?",["Gethsemane","Eden","Canaan","Babel"],1,"Gethsemane is where Jesus prays much later."],
    ["Humans are made in whose image?",["The angels'","God's","Adam's","The animals'"],1,"Genesis 1:27."]]},
 {t:"The fall and the flood",cards:[
  {h:"The serpent",b:["A serpent persuades Eve to eat from the forbidden tree. Adam eats too. They feel shame, hide, and are sent out of Eden.","This is called \"the Fall\" and explains, in the Bible's telling, why the world is broken."]},
  {h:"Cain and Abel",b:["Their sons Cain and Abel bring offerings. Cain, jealous, kills Abel. It is the first murder in the Bible. Cain asks, \"Am I my brother's keeper?\""],ref:"Gen 4"},
  {h:"Noah and Babel",b:["Violence spreads, so God sends a flood. Noah builds an ark and saves his family and the animals. Afterward God promises never to flood the earth again, with a rainbow as the sign.","Later, people build the tower of Babel to make a name for themselves, and God scatters them with different languages."]}],
 q:[["Who killed Abel?",["Seth","Noah","Cain","Adam"],2,"Cain, his older brother."],
    ["What was the sign of God's promise after the flood?",["A dove","A rainbow","A star","An olive tree"],1,"The rainbow covenant in Genesis 9."],
    ["What happened at Babel?",["A flood","Languages were scattered","Abraham was born","The ark landed"],1,"God confused their language and scattered them."]]},
 {t:"Abraham to Joseph",cards:[
  {h:"Abraham's call",b:["God tells Abram to leave home for a new land and promises him a great nation, a land, and that all nations will be blessed through him. God later renames him Abraham.","He and Sarah wait decades and finally have Isaac in old age."],ref:"Gen 12"},
  {h:"Jacob becomes Israel",b:["Isaac's son Jacob tricks his twin Esau out of his birthright and blessing. Later he wrestles with God through the night and is renamed Israel.","Jacob's 12 sons become the 12 tribes of Israel."]},
  {h:"Joseph",b:["Jacob's favorite son Joseph gets a special coat and big dreams. His jealous brothers sell him into slavery in Egypt.","He rises to second in command of Egypt, saves the region from famine, and forgives his brothers. That is how Israel's family ends up in Egypt."]}],
 q:[["Who was Abraham's promised son?",["Ishmael","Isaac","Jacob","Joseph"],1,"Isaac, born to Sarah in old age."],
    ["Jacob was renamed what?",["Abraham","Israel","Judah","Moses"],1,"After wrestling through the night."],
    ["How did Joseph end up in Egypt?",["He fled a famine","His brothers sold him","He was a merchant","Pharaoh invited him"],1,"Sold as a slave, then rose to power."]]}]},
{t:"Out of Egypt",ref:"Exodus to Ruth",sub:"Slavery, rescue, the law, and the promised land.",lessons:[
 {t:"Moses and the plagues",cards:[
  {h:"Slaves in Egypt",b:["Generations after Joseph, a new Pharaoh enslaves the Israelites and orders their baby boys killed. Moses' mother hides him in a basket on the Nile, and Pharaoh's daughter adopts him."]},
  {h:"The burning bush",b:["As an adult, Moses flees Egypt. God speaks to him from a bush that burns but is not consumed and sends him back to tell Pharaoh, \"Let my people go.\"","God gives his name as \"I am who I am.\""],ref:"Exod 3"},
  {h:"Ten plagues and Passover",b:["Pharaoh refuses, so ten plagues hit Egypt: blood, frogs, gnats, flies, livestock, boils, hail, locusts, darkness, and death of the firstborn.","Israelites mark doorframes with lamb's blood so death \"passes over\" them. Jews still celebrate Passover. Then God parts the Red Sea and Israel walks through."]}],
 q:[["Where did God first speak to Moses?",["Mount Sinai","A burning bush","The Red Sea","A dream"],1,"The bush that was not consumed."],
    ["What was the final plague?",["Darkness","Locusts","Death of the firstborn","Hail"],2,"It led to Passover."],
    ["What does Passover remember?",["Creation","Death passing over Israel's homes","Entering the land","The temple"],1,"Blood on the doorframes."]]},
 {t:"Sinai and the wilderness",cards:[
  {h:"The Ten Commandments",b:["At Mount Sinai, God gives Moses the Ten Commandments on stone tablets: worship God alone, no idols, don't misuse God's name, keep the Sabbath, honor parents, don't murder, commit adultery, steal, lie, or covet."],ref:"Exod 20"},
  {h:"The golden calf",b:["While Moses is on the mountain, the people make a golden calf and worship it. Moses smashes the tablets. God renews the covenant, and Israel builds the tabernacle, a portable tent for worship."]},
  {h:"40 years",b:["When Israel reaches the edge of the land, spies report giants and the people refuse to go in. As a result, that generation wanders 40 years in the wilderness. Moses dies looking over the land from a mountain."]}],
 q:[["Where were the Ten Commandments given?",["Mount Sinai","Jerusalem","Egypt","Jericho"],0,"Exodus 20."],
    ["What did the people make while Moses was away?",["A temple","A golden calf","An ark","A tower"],1,"They worshiped it, breaking the covenant right away."],
    ["How long did Israel wander?",["7 years","12 years","40 years","70 years"],2,"40 years in the wilderness."]]},
 {t:"Joshua, Judges, Ruth",cards:[
  {h:"Jericho",b:["Joshua leads Israel into Canaan. At Jericho they march around the city for seven days, blow trumpets and shout, and the walls fall."],ref:"Josh 6"},
  {h:"The judges",b:["Israel falls into a cycle: they turn from God, get oppressed, cry out, and God raises a \"judge\" to rescue them.","Famous judges: Deborah, a prophetess and leader; Gideon, with his 300 men; Samson, whose strength was tied to his uncut hair."]},
  {h:"Ruth",b:["In those dark times, Ruth, a widow from Moab, refuses to leave her mother-in-law Naomi: \"Where you go, I will go.\" She marries Boaz and becomes King David's great-grandmother."]}],
 q:[["Which city's walls fell after a march?",["Babylon","Jericho","Nineveh","Jerusalem"],1,"Joshua 6."],
    ["Samson's strength was tied to his...",["Sword","Hair","Faith in Egypt","Armor"],1,"Delilah had it cut."],
    ["Ruth became the great-grandmother of...",["Moses","Solomon","David","Samuel"],2,"Ruth, Obed, Jesse, David."]]}]},
{t:"Kings and Prophets",ref:"1 Samuel to Malachi",sub:"Israel's kings, its collapse, and the voices that warned it.",lessons:[
 {t:"Saul, David, Solomon",cards:[
  {h:"The first king",b:["Israel demands a king like other nations. The prophet Samuel anoints Saul, who starts well but disobeys God and is rejected."]},
  {h:"David",b:["God picks David, the youngest son of Jesse and a shepherd. As a teenager he kills the giant Goliath with a sling and a stone.","As king he makes Jerusalem the capital and writes many Psalms. He also commits adultery with Bathsheba and has her husband killed. The Bible does not hide its heroes' failures."],ref:"1 Sam 17"},
  {h:"Solomon",b:["David's son Solomon asks God for wisdom and gets it, plus wealth. He builds the first temple in Jerusalem. Proverbs is largely credited to him. Late in life, his many foreign wives turn his heart to other gods."]}],
 q:[["Who was Israel's first king?",["David","Saul","Solomon","Samuel"],1,"Anointed by Samuel."],
    ["What did David use to defeat Goliath?",["A spear","A sling and stone","A sword","His bare hands"],1,"1 Samuel 17."],
    ["Who built the first temple?",["David","Moses","Solomon","Ezra"],2,"Solomon, in Jerusalem."]]},
 {t:"Split and exile",cards:[
  {h:"Two kingdoms",b:["After Solomon, around 930 BC, the kingdom splits. <b>Israel</b> (10 tribes) in the north, <b>Judah</b> (with Jerusalem) in the south. Most of their kings lead the people into idolatry."]},
  {h:"Assyria and Babylon",b:["In 722 BC, Assyria destroys the northern kingdom. In 586 BC, Babylon destroys Jerusalem and the temple and carries Judah into exile.","This is the biggest crisis in the Old Testament. Lamentations is a poem of grief over it."]},
  {h:"The return",b:["About 50 years later, Persia conquers Babylon and King Cyrus lets the Jews go home. Ezra and Nehemiah lead the rebuilding of the temple and Jerusalem's walls."]}],
 q:[["Which empire destroyed Jerusalem in 586 BC?",["Egypt","Assyria","Babylon","Rome"],2,"The Babylonian exile."],
    ["What was the southern kingdom called?",["Israel","Judah","Samaria","Canaan"],1,"Judah, with Jerusalem as capital."],
    ["Who led the rebuilding of Jerusalem's walls?",["Nehemiah","Elijah","Daniel","Jonah"],0,"The book of Nehemiah."]]},
 {t:"The prophets",cards:[
  {h:"What a prophet was",b:["Prophets were less about predicting the future and more about calling Israel back to God and to justice for the poor. They warned of judgment and promised hope beyond it."]},
  {h:"Famous stories",b:["<b>Elijah</b> faces 450 prophets of Baal on Mount Carmel, and fire falls from heaven.","<b>Jonah</b> runs from God, gets swallowed by a great fish, then preaches to Nineveh, which repents.","<b>Daniel</b>, an exile in Babylon, keeps praying and is thrown to the lions, but survives."]},
  {h:"The hope",b:["Isaiah and others describe a coming king from David's line and a suffering servant. Christians read these as pointing to Jesus. Jewish readers interpret them differently."],ref:"Isa 53"}],
 q:[["Who was swallowed by a great fish?",["Elijah","Daniel","Jonah","Isaiah"],2,"Then he went to Nineveh."],
    ["What was a prophet's main job?",["Fortune telling","Calling people back to God and justice","Leading armies","Running the temple"],1,"Prediction was a small part."],
    ["Daniel was thrown into...",["A furnace","A lions' den","A well","The sea"],1,"His friends got the furnace."]]}]},
{t:"The Gospels",ref:"Matthew to John",sub:"The life, death, and resurrection of Jesus.",lessons:[
 {t:"Four Gospels",cards:[
  {h:"Four angles",b:["Gospel means \"good news.\" There are four: Matthew, Mark, Luke, and John. Each tells the story of Jesus for a different audience."]},
  {h:"Similar and different",b:["Matthew, Mark, and Luke share many of the same stories in similar order. Scholars call them the <b>Synoptic</b> Gospels (\"seen together\"). Most think Mark was written first.","John is different: fewer parables, long speeches, and seven \"I am\" sayings like \"I am the bread of life.\""]},
  {h:"Their focus",b:["<b>Matthew:</b> Jesus as the promised Jewish Messiah.","<b>Mark:</b> short and fast. Jesus in action.","<b>Luke:</b> outsiders, women, and the poor.","<b>John:</b> who Jesus is."]}],
 q:[["What does \"gospel\" mean?",["Holy book","Good news","Teaching","Life story"],1,"From the Old English for good news."],
    ["Which Gospel is NOT one of the Synoptics?",["Matthew","Mark","Luke","John"],3,"John tells the story differently."],
    ["Which Gospel do most scholars think came first?",["Matthew","Mark","Luke","John"],1,"Mark, around AD 65 to 70."]]},
 {t:"Jesus' life and teaching",cards:[
  {h:"Early life",b:["Jesus is born in Bethlehem and grows up in Nazareth in Galilee. Around age 30 he is baptized by John the Baptist in the Jordan River and begins teaching."]},
  {h:"Disciples and miracles",b:["He calls 12 disciples, including fishermen Peter, Andrew, James, and John, and Matthew the tax collector.","The Gospels record healings, walking on water, feeding 5,000 people with five loaves and two fish, and raising Lazarus."]},
  {h:"Parables",b:["Jesus often taught in parables, short stories with a twist. The Good Samaritan: a despised outsider is the real neighbor. The Prodigal Son: a father runs to welcome back a son who wasted everything.","His most famous teaching is the Sermon on the Mount, including the Beatitudes and the Lord's Prayer."],ref:"Matt 5 to 7"}],
 q:[["Who baptized Jesus?",["Peter","John the Baptist","Moses","Paul"],1,"In the Jordan River."],
    ["How many disciples did Jesus call?",["7","10","12","40"],2,"Matching the 12 tribes."],
    ["Where is the Lord's Prayer taught?",["Sermon on the Mount","The Last Supper","The temple","Gethsemane"],0,"Matthew 6."]]},
 {t:"Death and resurrection",cards:[
  {h:"The last week",b:["Jesus rides into Jerusalem on a donkey to crowds waving palm branches (Palm Sunday). He drives money changers out of the temple. At the Last Supper, during Passover, he shares bread and wine with his disciples. Christians still remember this in communion."]},
  {h:"The cross",b:["Judas betrays him for 30 pieces of silver. He is arrested in the garden of Gethsemane, Peter denies knowing him three times, and the Roman governor Pontius Pilate sentences him to crucifixion.","Christians understand his death as a sacrifice for sin."]},
  {h:"The empty tomb",b:["On the third day, women find the tomb empty. All four Gospels say Jesus rose and appeared to his followers. Christians celebrate this on Easter.","Before ascending, he sends them to make disciples of all nations."],ref:"Matt 28"}],
 q:[["Who betrayed Jesus?",["Peter","Thomas","Judas","Pilate"],2,"For 30 pieces of silver."],
    ["How many times did Peter deny Jesus?",["Once","Twice","Three times","Seven times"],2,"Before the rooster crowed."],
    ["Who sentenced Jesus to crucifixion?",["Herod","Caesar","Pontius Pilate","Caiaphas"],2,"The Roman governor of Judea."]]}]},
{t:"Church and the End",ref:"Acts to Revelation",sub:"The first Christians, their letters, and the final vision.",lessons:[
 {t:"Acts",cards:[
  {h:"Pentecost",b:["Fifty days after Passover, at the festival of Pentecost, the Holy Spirit comes on the disciples. They speak in other languages, Peter preaches, and about 3,000 people join. Many call this the birthday of the church."],ref:"Acts 2"},
  {h:"Saul becomes Paul",b:["Saul, a Pharisee, persecutes Christians. On the road to Damascus he sees a blinding light and hears Jesus. He converts and becomes Paul, the most influential early missionary."]},
  {h:"To the ends of the earth",b:["Paul makes several missionary journeys around the Mediterranean, starting churches in places like Corinth, Ephesus, and Philippi. Acts ends with Paul under arrest in Rome, still preaching."]}],
 q:[["What happened at Pentecost?",["Jesus was born","The Holy Spirit came","Paul died","The temple fell"],1,"Acts 2."],
    ["Where was Saul going when he converted?",["Rome","Damascus","Jerusalem","Athens"],1,"The road to Damascus."],
    ["Where does Acts end?",["Jerusalem","Antioch","Rome","Corinth"],2,"Paul under house arrest in Rome."]]},
 {t:"The letters",cards:[
  {h:"Real mail",b:["The letters (also called epistles) were written to actual churches and people dealing with real problems: division, false teaching, persecution, how to live.","Many of Paul's letters are older than the Gospels, written in the AD 50s."]},
  {h:"Paul's letters",b:["Romans explains Paul's gospel most fully: people are made right with God by grace through faith. 1 Corinthians includes the famous love chapter (13). Philippians is about joy, written from prison."]},
  {h:"The others",b:["Hebrews shows Jesus as a greater high priest. James says faith without action is dead. Peter, John, and Jude wrote shorter letters about suffering, love, and staying true."]}],
 q:[["Which letter has the famous chapter on love?",["Romans","1 Corinthians","James","Hebrews"],1,"1 Corinthians 13."],
    ["Which book says faith without works is dead?",["James","Galatians","Jude","Romans"],0,"James 2."],
    ["Were Paul's letters written before or after the Gospels?",["Mostly before","Mostly after","Same time","Unknown"],0,"Most date to the AD 50s."]]},
 {t:"Revelation",cards:[
  {h:"A vision",b:["Revelation was written by a man named John while exiled on the island of Patmos. It is apocalyptic writing, a genre full of symbols: beasts, seals, trumpets, and numbers like 7 and 666."]},
  {h:"How people read it",b:["Some read it as prediction of future events. Others read it as coded encouragement to persecuted Christians under Rome. Many combine both. Interpretation varies a lot between traditions."]},
  {h:"How it ends",b:["The Bible closes the way it opened: a new heaven and new earth, a city where God lives with people, no more death or tears, and the tree of life again. Genesis' garden becomes Revelation's garden city."],ref:"Rev 21 to 22"}],
 q:[["Where was John when he wrote Revelation?",["Rome","Patmos","Jerusalem","Ephesus"],1,"An island in the Aegean Sea."],
    ["What genre is Revelation?",["History","Apocalyptic","Law","Wisdom"],1,"Highly symbolic visionary writing."],
    ["What returns at the very end that appeared in Genesis?",["The serpent","The tree of life","The flood","The tower"],1,"Revelation 22."]]}]}
];

const BOOKS=[
["Law","Genesis","Creation, the fall, and the families of Abraham, Isaac, Jacob, and Joseph."],["Law","Exodus","Moses leads Israel out of slavery in Egypt to Mount Sinai."],["Law","Leviticus","Laws for worship, sacrifice, and holy living."],["Law","Numbers","Israel's 40 years in the wilderness."],["Law","Deuteronomy","Moses' final speeches before Israel enters the land."],
["History","Joshua","Israel enters and settles Canaan."],["History","Judges","Cycles of rebellion and rescue by Deborah, Gideon, Samson."],["History","Ruth","A loyal Moabite widow becomes David's great-grandmother."],["History","1 Samuel","Samuel, King Saul, and young David."],["History","2 Samuel","David's reign, its triumphs and failures."],["History","1 Kings","Solomon, the temple, and the kingdom splitting."],["History","2 Kings","Israel falls to Assyria, Judah to Babylon."],["History","1 Chronicles","History retold from Adam to David, focused on worship."],["History","2 Chronicles","Solomon to the exile, focused on Judah."],["History","Ezra","Exiles return and rebuild the temple."],["History","Nehemiah","Rebuilding Jerusalem's walls."],["History","Esther","A Jewish queen in Persia saves her people."],
["Wisdom & Poetry","Job","A righteous man suffers and questions God."],["Wisdom & Poetry","Psalms","150 songs and prayers."],["Wisdom & Poetry","Proverbs","Short sayings on wisdom and daily life."],["Wisdom & Poetry","Ecclesiastes","A teacher wrestles with the meaning of life."],["Wisdom & Poetry","Song of Songs","Love poetry."],
["Major Prophets","Isaiah","Judgment, comfort, and a coming servant king."],["Major Prophets","Jeremiah","The weeping prophet warns Judah before Babylon."],["Major Prophets","Lamentations","Poems of grief over Jerusalem's fall."],["Major Prophets","Ezekiel","Visions of God's glory and the valley of dry bones."],["Major Prophets","Daniel","Faithful exiles in Babylon and visions of kingdoms."],
["Minor Prophets","Hosea","A prophet's marriage pictures God's faithful love."],["Minor Prophets","Joel","A locust plague and the day of the Lord."],["Minor Prophets","Amos","A shepherd demands justice for the poor."],["Minor Prophets","Obadiah","Shortest Old Testament book; judgment on Edom."],["Minor Prophets","Jonah","A reluctant prophet, a great fish, mercy for Nineveh."],["Minor Prophets","Micah","Do justice, love mercy, walk humbly."],["Minor Prophets","Nahum","The fall of Nineveh."],["Minor Prophets","Habakkuk","Why does evil go unpunished?"],["Minor Prophets","Zephaniah","Judgment and a restored remnant."],["Minor Prophets","Haggai","Finish rebuilding the temple."],["Minor Prophets","Zechariah","Visions of restoration and a humble king."],["Minor Prophets","Malachi","Last Old Testament prophet; a messenger is coming."],
["Gospels","Matthew","Jesus as the promised Messiah; the Sermon on the Mount."],["Gospels","Mark","The shortest, fastest-paced Gospel."],["Gospels","Luke","Careful account focused on outsiders and the poor."],["Gospels","John","Who Jesus is, through signs and \"I am\" sayings."],
["History","Acts","The church spreads from Jerusalem to Rome."],
["Paul's Letters","Romans","Paul's fullest explanation of the gospel."],["Paul's Letters","1 Corinthians","Fixing a divided church; the love chapter."],["Paul's Letters","2 Corinthians","Strength in weakness."],["Paul's Letters","Galatians","Freedom in Christ versus the law."],["Paul's Letters","Ephesians","The church as one body."],["Paul's Letters","Philippians","Joy, written from prison."],["Paul's Letters","Colossians","Christ above everything."],["Paul's Letters","1 Thessalonians","Encouragement about Jesus' return."],["Paul's Letters","2 Thessalonians","Clearing up confusion about the end."],["Paul's Letters","1 Timothy","Guidance for leading a church."],["Paul's Letters","2 Timothy","Paul's last letter."],["Paul's Letters","Titus","Organizing churches on Crete."],["Paul's Letters","Philemon","A plea for a runaway slave, Onesimus."],
["General Letters","Hebrews","Jesus as the greater high priest."],["General Letters","James","Faith shown through action."],["General Letters","1 Peter","Hope in suffering."],["General Letters","2 Peter","Warnings about false teachers."],["General Letters","1 John","God is love."],["General Letters","2 John","Walk in truth and love."],["General Letters","3 John","Hospitality to traveling teachers."],["General Letters","Jude","Hold on to the faith."],
["Prophecy","Revelation","Visions of the end and a new creation."]];

const VERSES=[["Gen 1:1","In the beginning God created the heavens and the earth."],["Ps 23:1","The Lord is my shepherd; I shall not want."],["Mic 6:8","Do justly, love mercy, and walk humbly with your God."],["Matt 5:9","Blessed are the peacemakers, for they shall be called children of God."],["John 1:1","In the beginning was the Word, and the Word was with God, and the Word was God."],["Prov 3:5","Trust in the Lord with all your heart, and lean not on your own understanding."],["1 Cor 13:13","And now abide faith, hope, love, these three; but the greatest of these is love."]];

const CHAPS=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const CH=[];CHAPS.forEach((n,b)=>{for(let c=1;c<=n;c++)CH.push([b,c])});
const TOTAL_CH=CH.length;

const STORIES=[
["In the Beginning","Creation","Genesis 1-2"],["In the Beginning","The Fall","Genesis 3"],["In the Beginning","Cain and Abel","Genesis 4"],["In the Beginning","Noah's Ark","Genesis 6-9"],["In the Beginning","The Tower of Babel","Genesis 11"],
["The Patriarchs","The Call of Abraham","Genesis 12"],["The Patriarchs","Sodom and Gomorrah","Genesis 18-19"],["The Patriarchs","The Binding of Isaac","Genesis 22"],["The Patriarchs","Jacob and Esau","Genesis 25-27"],["The Patriarchs","Jacob's Ladder","Genesis 28"],["The Patriarchs","Jacob Wrestles God","Genesis 32"],["The Patriarchs","Joseph and His Brothers","Genesis 37-45"],
["Exodus and Wilderness","Baby Moses","Exodus 2"],["Exodus and Wilderness","The Burning Bush","Exodus 3"],["Exodus and Wilderness","The Ten Plagues","Exodus 7-12"],["Exodus and Wilderness","Crossing the Red Sea","Exodus 14"],["Exodus and Wilderness","Manna from Heaven","Exodus 16"],["Exodus and Wilderness","The Ten Commandments","Exodus 20"],["Exodus and Wilderness","The Golden Calf","Exodus 32"],["Exodus and Wilderness","The Twelve Spies","Numbers 13-14"],["Exodus and Wilderness","Balaam's Donkey","Numbers 22"],
["Land and Judges","The Walls of Jericho","Joshua 6"],["Land and Judges","Gideon's 300","Judges 6-7"],["Land and Judges","Samson and Delilah","Judges 16"],["Land and Judges","Ruth and Naomi","Ruth 1-4"],
["Kings","Samuel Hears God","1 Samuel 3"],["Kings","David and Goliath","1 Samuel 17"],["Kings","David and Jonathan","1 Samuel 18-20"],["Kings","David and Bathsheba","2 Samuel 11-12"],["Kings","The Wisdom of Solomon","1 Kings 3"],["Kings","Elijah on Mount Carmel","1 Kings 18"],["Kings","Elijah Taken to Heaven","2 Kings 2"],["Kings","Naaman Is Healed","2 Kings 5"],
["Exile and Prophets","Isaiah's Vision","Isaiah 6"],["Exile and Prophets","The Valley of Dry Bones","Ezekiel 37"],["Exile and Prophets","The Fiery Furnace","Daniel 3"],["Exile and Prophets","The Writing on the Wall","Daniel 5"],["Exile and Prophets","Daniel in the Lions' Den","Daniel 6"],["Exile and Prophets","Esther Saves Her People","Esther 4-7"],["Exile and Prophets","Jonah and the Great Fish","Jonah 1-4"],["Exile and Prophets","Job's Suffering","Job 1-2"],
["Life of Jesus","The Birth of Jesus","Luke 2"],["Life of Jesus","The Wise Men","Matthew 2"],["Life of Jesus","Baptism and Temptation","Matthew 3-4"],["Life of Jesus","The Wedding at Cana","John 2"],["Life of Jesus","Nicodemus at Night","John 3"],["Life of Jesus","The Woman at the Well","John 4"],["Life of Jesus","The Sermon on the Mount","Matthew 5-7"],["Life of Jesus","Feeding the 5,000","John 6"],["Life of Jesus","Walking on Water","Matthew 14"],["Life of Jesus","The Transfiguration","Matthew 17"],["Life of Jesus","Raising Lazarus","John 11"],["Life of Jesus","Zacchaeus","Luke 19"],
["Parables","The Good Samaritan","Luke 10"],["Parables","The Prodigal Son","Luke 15"],["Parables","The Sower","Matthew 13"],["Parables","The Lost Sheep","Luke 15"],["Parables","The Talents","Matthew 25"],
["The Last Week","The Triumphal Entry","Matthew 21"],["The Last Week","The Last Supper","Luke 22"],["The Last Week","Gethsemane","Mark 14"],["The Last Week","The Crucifixion","Matthew 27"],["The Last Week","The Resurrection","John 20"],["The Last Week","The Road to Emmaus","Luke 24"],
["The Early Church","Pentecost","Acts 2"],["The Early Church","The Stoning of Stephen","Acts 7"],["The Early Church","The Road to Damascus","Acts 9"],["The Early Church","Peter's Vision","Acts 10"],["The Early Church","Paul and Silas in Prison","Acts 16"],["The Early Church","Paul in Athens","Acts 17"],["The Early Church","Shipwreck","Acts 27"],["The Early Church","The New Jerusalem","Revelation 21-22"]];

const PEOPLE=[
["Beginnings","Adam and Eve"],["Beginnings","Noah"],["Beginnings","Abraham"],["Beginnings","Sarah"],["Beginnings","Isaac"],["Beginnings","Jacob"],["Beginnings","Joseph"],
["Exodus and Conquest","Moses"],["Exodus and Conquest","Aaron"],["Exodus and Conquest","Miriam"],["Exodus and Conquest","Joshua"],["Exodus and Conquest","Rahab"],["Exodus and Conquest","Deborah"],["Exodus and Conquest","Gideon"],["Exodus and Conquest","Samson"],["Exodus and Conquest","Ruth"],
["Kings and Prophets","Samuel"],["Kings and Prophets","Saul"],["Kings and Prophets","David"],["Kings and Prophets","Jonathan"],["Kings and Prophets","Bathsheba"],["Kings and Prophets","Solomon"],["Kings and Prophets","Elijah"],["Kings and Prophets","Elisha"],["Kings and Prophets","Jezebel"],["Kings and Prophets","Hezekiah"],["Kings and Prophets","Josiah"],["Kings and Prophets","Isaiah"],["Kings and Prophets","Jeremiah"],["Kings and Prophets","Ezekiel"],["Kings and Prophets","Daniel"],["Kings and Prophets","Esther"],["Kings and Prophets","Nehemiah"],["Kings and Prophets","Job"],["Kings and Prophets","Jonah"],
["The Gospels","Mary, mother of Jesus"],["The Gospels","Joseph, husband of Mary"],["The Gospels","John the Baptist"],["The Gospels","Jesus"],["The Gospels","Peter"],["The Gospels","Andrew"],["The Gospels","James and John, sons of Zebedee"],["The Gospels","Matthew"],["The Gospels","Thomas"],["The Gospels","Judas Iscariot"],["The Gospels","Mary Magdalene"],["The Gospels","Martha and Mary of Bethany"],["The Gospels","Lazarus"],["The Gospels","Nicodemus"],["The Gospels","Pontius Pilate"],["The Gospels","Herod the Great"],
["The Early Church","Stephen"],["The Early Church","Paul"],["The Early Church","Barnabas"],["The Early Church","Timothy"],["The Early Church","Lydia"],["The Early Church","Priscilla and Aquila"],["The Early Church","James, brother of Jesus"]];

const IDEAS=[
["Foundations","God in the Bible"],["Foundations","Creation"],["Foundations","Sin"],["Foundations","Covenant"],["Foundations","The Law"],["Foundations","Holiness"],
["Worship","Sacrifice"],["Worship","The Temple"],["Worship","The Sabbath"],["Worship","Prayer"],["Worship","Angels and Satan"],
["Israel's Hope","Exile and Return"],["Israel's Hope","Prophecy"],["Israel's Hope","The Messiah"],["Israel's Hope","Justice and the Poor"],
["Jesus and After","The Kingdom of God"],["Jesus and After","Grace"],["Jesus and After","Faith"],["Jesus and After","Repentance and Forgiveness"],["Jesus and After","Love"],["Jesus and After","The Cross"],["Jesus and After","Resurrection"],["Jesus and After","The Holy Spirit"],["Jesus and After","The Trinity"],["Jesus and After","The Church"],["Jesus and After","Heaven, Hell, and the End"],
["Reading Well","How the Bible Was Put Together"],["Reading Well","Translations Explained"],["Reading Well","How Jews, Catholics, Orthodox, and Protestants Read It"],["Reading Well","Reading Hard Passages"]];

const ALL_BS=[];UNITS.forEach((u,ui)=>u.lessons.forEach((l,li)=>ALL_BS.push("bs-"+ui+"-"+li)));
const clean=s=>String(s).replace(/\s*\u2014\s*/g,", ");
const chName=b=>BOOKS[b][1]==="Psalms"?"Psalm":BOOKS[b][1];
/* lesson specs */
function spec(id){
  const p=id.split("-"),k=p[0],a=+p[1],b=+p[2];
  if(k==="bs"){const l=UNITS[a].lessons[b];return{id,title:l.t,group:UNITS[a].t,fixed:l}}
  if(k==="bk"){const B=BOOKS[a];return{id,title:B[1],group:"Book overview",ref:B[1]+" 1",ask:`An overview of the book of ${B[1]} (${CHAPS[a]} chapters, in the ${B[0]} section of the ${a<39?"Old":"New"} Testament). Cover who wrote it and when (the traditional view, and the scholarly view if it differs), what it covers from start to finish, its main sections, its key people, and why it matters in the Bible's bigger story.`}}
  if(k==="ch"){const B=BOOKS[a];return{id,title:chName(a)+" "+b,group:B[1]+", chapter "+b+" of "+CHAPS[a],ref:B[1]+" "+b,ask:`${B[1]} chapter ${b} (chapter ${b} of ${CHAPS[a]} in the book). Walk through what happens or what is said in this chapter in order, who is involved, how it connects to the chapters just before and after it and to the book as a whole, and why it matters. Keep every card about this specific chapter.`}}
  if(k==="st"){const s=STORIES[a];return{id,title:s[1],group:s[0],ref:s[2],ask:`The Bible story "${s[1]}" (${s[2]}). Tell the story clearly in order, explain the background a beginner needs, what it meant to its first readers, and how it is commonly understood today.`}}
  if(k==="pp"){const s=PEOPLE[a];return{id,title:s[1],group:s[0],ask:`The biblical figure: ${s[1]}. Who they were, when they lived in the Bible's timeline, the main events of their story with references, their strengths and failures, and why they matter.`}}
  if(k==="id"){const s=IDEAS[a];return{id,title:s[1],group:s[0],ask:`The Bible topic: ${s[1]}. Explain what it means, trace it through the Old and New Testaments with key references, and explain where Jewish, Catholic, Orthodox, Protestant, or academic readers meaningfully differ.`}}
}
function nextId(id){
  const p=id.split("-"),k=p[0],a=+p[1],b=+p[2];
  if(k==="bs"){const i=ALL_BS.indexOf(id);return ALL_BS[i+1]||null}
  if(k==="bk")return a<65?"bk-"+(a+1):null;
  if(k==="ch"){if(b<CHAPS[a])return"ch-"+a+"-"+(b+1);return a<65?"ch-"+(a+1)+"-1":null}
  const len={st:STORIES.length,pp:PEOPLE.length,id:IDEAS.length}[k];return a+1<len?k+"-"+(a+1):null;
}
function buildPrompt(s){return `You are writing one lesson for "Scroll", a Duolingo-style app that teaches the Bible to a curious adult who knows almost nothing about it. Be accurate, plain-spoken, and neutral: explain what the text says and how it is understood, noting where Jewish, Catholic, Orthodox, Protestant, or academic readers meaningfully differ, without telling the reader what to believe.

Lesson topic: ${s.ask}

Reply with only JSON in exactly this shape:
{"cards":[{"h":"short heading","b":["paragraph","paragraph"],"ref":"Book 1:1-5"}],"q":[{"q":"question","options":["a","b","c","d"],"answer":0,"why":"one sentence explanation"}]}

Rules: exactly 4 cards; each card has 2 or 3 paragraphs of at most 55 words each, simple vocabulary, and a real chapter and verse reference in "ref" (or "" if none fits). If you quote scripture, use only the King James Version and keep it under 25 words. Then exactly 4 multiple-choice questions with 4 options each, answerable from the cards, with plausible wrong options; vary which option index is correct. Plain text only: no markdown, no HTML, no em dashes.`}
function norm(r){
  if(!r||!Array.isArray(r.cards)||!Array.isArray(r.q))return null;
  const cards=r.cards.filter(c=>c&&typeof c.h==="string"&&Array.isArray(c.b)).map(c=>({h:clean(c.h),b:c.b.map(x=>clean(x)),ref:typeof c.ref==="string"?c.ref:""}));
  const q=r.q.map(x=>Array.isArray(x)?{q:x[0],options:x[1],answer:x[2],why:x[3]}:x).filter(x=>x&&typeof x.q==="string"&&Array.isArray(x.options)&&x.options.length>=2&&Number.isInteger(x.answer)&&x.answer>=0&&x.answer<x.options.length).map(x=>[clean(x.q),x.options.map(o=>clean(o)),x.answer,clean(x.why||"")]);
  if(cards.length<2||q.length<2)return null;
  return{cards,q,ai:true};
}

export{UNITS,BOOKS,VERSES,CHAPS,CH,TOTAL_CH,STORIES,PEOPLE,IDEAS,ALL_BS,clean,chName,spec,nextId,buildPrompt,norm};
