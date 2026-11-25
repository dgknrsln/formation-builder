/**
 * Football Manager tarzı taktik rolleri ve görev (duty) açıklamaları veritabanı.
 * Tamamen Türkçe, anlaşılır ve saha içi davranış odaklı.
 */

export const DUTIES = {
  defend: {
    id: 'defend',
    label: 'Savunma',
    short: 'SAV',
    color: '#2563EB', // Blue
    bg: '#EFF6FF',
    border: '#BFDBFE',
    generalDesc: 'Oyuncu önceliğini pozisyonunu korumaya ve savunma güvenliğine verir. Riskli ileri koşulardan kaçınır, top kaybında hızla geriye döner.'
  },
  support: {
    id: 'support',
    label: 'Destek',
    short: 'DES',
    color: '#16A34A', // Emerald
    bg: '#F0FDF4',
    border: '#BBF7D0',
    generalDesc: 'Oyuncu savunma ve hücum arasında köprü kurar. Pas bağlantısı sağlar, gerektiğinde ileri çıkar ama pozisyon disiplinini tamamen terk etmez.'
  },
  attack: {
    id: 'attack',
    label: 'Hücum',
    short: 'HÜC',
    color: '#EA580C', // Orange-Red
    bg: '#FFF7ED',
    border: '#FED7AA',
    generalDesc: 'Oyuncu doğrudan rakip kaleyi veya son üçüncü bölgeyi hedefler. Savunma arkasına koşular atar ve hücumda maksimum risk alır.'
  },
  auto: {
    id: 'auto',
    label: 'Otomatik',
    short: 'OTO',
    color: '#7C3AED', // Violet
    bg: '#F5F3FF',
    border: '#DDD6FE',
    generalDesc: 'Oyuncu takımın genel oyun anlayışına ve maç içi duruma göre savunma, destek veya hücum arasında otomatik denge kurar.'
  }
};

export const ROLE_CATEGORIES = {
  GK: 'Kaleci',
  DEF: 'Savunma',
  MID: 'Orta Saha',
  WING: 'Kanat & On Numara',
  FWD: 'Forvet'
};

export const ROLES = [
  // ==================== KALECİ ====================
  {
    id: 'gk',
    name: 'Kaleci',
    shortName: 'KL',
    category: 'GK',
    duties: ['defend'],
    summary: 'Klasik kale çizgisi kalecisi. Önceliği şutları kurtarmak, yan topları kontrol etmek ve topu en risksiz şekilde savunma oyuncularına veya ileriye aktarmaktır.',
    dutyDetails: {
      defend: 'Kalesini terk etmez, pas oyununda ekstra risk almaz ve savunma arkasına atılan toplarda ceza sahası içinde kalmayı tercih eder.'
    },
    onBall: 'Baskı altında uzun vuruş yapar; boşsa en yakın stopere veya beke kısa pas verir.',
    offBall: 'Kale çizgisi ve altıpas hakimiyetine odaklanır.',
    attributes: ['Refleks', 'Bire Bir', 'Pozisyon Alma', 'Hava Topları']
  },
  {
    id: 'sk',
    name: 'Libero Kaleci',
    shortName: 'LKL',
    category: 'GK',
    duties: ['defend', 'support', 'attack'],
    summary: 'Önde kurulan savunma hattının arkasını süpüren modern kaleci. Topa sahipken stoperlerle birlikte oyun kurulumuna aktif olarak katılır.',
    dutyDetails: {
      defend: 'Savunma arkasına atılan topları süpürür ancak hücumda sadece güvenli kısa paslar atar.',
      support: 'Ceza sahası dışına kadar çıkıp ekstra pas istasyonu olur, orta mesafe dikine paslarla oyunu başlatır.',
      attack: 'Rakip baskısını kırmak için kalesinden oldukça uzaklaşır, hızlı kontra atak başlatan uzun ve keskin paslar dener.'
    },
    onBall: 'Baskı altında bile pasla oyun kurar, iki ayağını kullanarak boş beki veya ön liberoyu bulur.',
    offBall: 'Yüksek savunma çizgisinin arkasındaki boşluğu sürekli kontrol eder.',
    attributes: ['Ani Çıkış', 'Pas', 'İlk Kontrol', 'Soğukkanlılık', 'Refleks']
  },

  // ==================== SAVUNMA ====================
  {
    id: 'cd',
    name: 'Standart Stoper',
    shortName: 'STP',
    category: 'DEF',
    duties: ['defend', 'stopper', 'cover'].filter(d => DUTIES[d]).length ? ['defend'] : ['defend'],
    summary: 'Temel görevi rakip forvetleri durdurmak, hava toplarını kazanmak ve tehlikeyi uzaklaştırmaktır. Pas oyununda basit ve güvenli oynar.',
    dutyDetails: {
      defend: 'Savunma hattındaki yerini korur, riskli dripling veya uzun çapraz paslardan kaçınarak topu orta sahaya aktarır.'
    },
    onBall: 'Topu kazandıktan sonra en yakınındaki serbest oyuncuya basit pas verir.',
    offBall: 'Ceza sahası merkezini kapatır, rakip santraforla fiziksel temas kurar.',
    attributes: ['Markaj', 'Top Kapma', 'Kafa Vuruşu', 'Pozisyon Alma', 'Güç']
  },
  {
    id: 'bpd',
    name: 'Pasör Stoper',
    shortName: 'PSTP',
    category: 'DEF',
    duties: ['defend', 'support'],
    summary: 'Sadece savunma yapmakla kalmaz, geriden oyun kurar. Baskı altında driplingle mesafe kat edebilir veya hat kıran dikine paslar atabilir.',
    dutyDetails: {
      defend: 'Savunma pozisyonunu bozmaz ama top ayağındayken orta saha ve kanatlara yaratıcı dikine paslar dener.',
      support: 'Takım topa sahipken orta sahaya doğru bir adım öne çıkarak ekstra pas açısı yaratır ve oyunu yönlendirir.'
    },
    onBall: 'Rakip ilk baskı hattını pasla veya driplingle kırar, kanatlara diyagonal uzun toplar atar.',
    offBall: 'Standart stoper gibi alan ve adam savunması yapar.',
    attributes: ['Pas', 'Vizyon', 'Soğukkanlılık', 'Top Kapma', 'İlk Kontrol']
  },
  {
    id: 'wcb',
    name: 'Geniş Stoper',
    shortName: 'GSTP',
    category: 'DEF',
    duties: ['defend', 'support', 'attack'],
    summary: 'Üçlü savunmanın sağında veya solunda oynayan stoper. Topa sahipken kanada doğru açılarak bek gibi hücuma destek verir.',
    dutyDetails: {
      defend: 'Üçlü savunmanın kenarını kapatır, rakip kanat oyuncularını karşılar ve hücumda geride emniyet sağlar.',
      support: 'Topla birlikte yarı alandan (half-space) ileri çıkar, kanat bek ile pas üçgenleri kurar.',
      attack: 'Kanat oyuncusu içe kat ettiğinde çizgiye kadar bindirme yapar ve orta açar.'
    },
    onBall: 'Çizgiye yakın genişler, kanat oyuncularına pas desteği veya bindirme sağlar.',
    offBall: 'Merkez stoper ile kanat arasındaki koridoru savunur.',
    attributes: ['Dayanıklılık', 'Pas', 'Top Kapma', 'Dripling', 'Hız']
  },
  {
    id: 'fb',
    name: 'Bek (Standart Bek)',
    shortName: 'BEK',
    category: 'DEF',
    duties: ['defend', 'support', 'attack', 'auto'],
    summary: 'Kanat savunmasından sorumlu klasik bek. Kendi kanadını kapatırken hücumda da dengeli bir şekilde pas ve orta desteği verir.',
    dutyDetails: {
      defend: 'Hücuma çok nadir katılır, önceliği kendi kanadındaki rakip açık oyuncusunu kilitlemektir.',
      support: 'Orta sahaya ve kanat oyuncusuna geriden pas desteği verir, uygun anlarda orta bölgesinden servis yapar.',
      attack: 'Sürekli ileri bindirme yapar, son çizgiye inip ceza sahasına orta keser.',
      auto: 'Takımın taktik anlayışına göre savunma veya hücum ağırlığını kendi ayarlar.'
    },
    onBall: 'Kanat koridorunu kullanarak oyunu genişletir.',
    offBall: 'Bek-stoper arası koridoru kapatır ve arka direği savunur.',
    attributes: ['Top Kapma', 'Pozisyon Alma', 'Dayanıklılık', 'Orta Yapma', 'Hız']
  },
  {
    id: 'wb',
    name: 'Kanat Bek',
    shortName: 'KBEK',
    category: 'DEF',
    duties: ['defend', 'support', 'attack', 'auto'],
    summary: 'Tüm kanadı tek başına kullanabilen yüksek enerjili bek. Hücumda açık oyuncusu gibi son çizgiye iner, savunmada hızla geri döner.',
    dutyDetails: {
      defend: 'Daha temkinli bindirmeler yapar, önceliği kanat savunmasını sağlam tutmaktır.',
      support: 'Hücumda orta saha hizasına çıkarak kanattan sürekli tehdit ve orta opsiyonu oluşturur.',
      attack: 'Neredeyse bir kanat forvet gibi en ileri uca kadar çıkar, rakip beki sürekli bire birde zorlar.',
      auto: 'Maç temposuna göre bindirme sıklığını otomatik ayarlar.'
    },
    onBall: 'Genişlik sağlar, driplingle adam eksiltir ve erken/derin ortalar yapar.',
    offBall: 'Top kaybında hızla savunma dörtlüsüne/beşlisine geri döner.',
    attributes: ['Çalışkanlık', 'Dayanıklılık', 'Hızlanma', 'Orta Yapma', 'Dripling']
  },
  {
    id: 'iwb',
    name: 'Ters Ayaklı Bek (İçe Katan Bek)',
    shortName: 'TAB',
    category: 'DEF',
    duties: ['defend', 'support', 'attack', 'auto'],
    summary: 'Topa sahipken çizgide kalmak yerine orta sahanın merkezine (6 veya 8 numara bölgesine) kat eden modern bek. Merkezde sayısal üstünlük sağlar.',
    dutyDetails: {
      defend: 'Topa sahipken ön libero bölgesine geçerek kontra ataklara karşı merkezi kilitler.',
      support: 'Orta saha ikilisine/üçlüsüne katılarak pas trafiğini yönetir ve yarı alandan şut/pas arar.',
      attack: 'Rakip ceza sahası yayına kadar merkezden sızar, sürpriz gol koşuları ve ara paslar dener.',
      auto: 'Takımın topa sahip olma ihtiyacına göre içe kat etme derinliğini ayarlar.'
    },
    onBall: 'Merkeze geçer, kanat oyuncusuna bire bir alan bırakır ve orta sahada pas istasyonu olur.',
    offBall: 'Top rakipteyken klasik bek pozisyonuna döner.',
    attributes: ['Pas', 'Karar Alma', 'Pozisyon Alma', 'İlk Kontrol', 'Çalışkanlık']
  },
  {
    id: 'ifb',
    name: 'İçe Katan Bek (Stoperleşen Bek)',
    shortName: 'İKB',
    category: 'DEF',
    duties: ['defend'],
    summary: 'Topa sahipken kanat çizgisinden merkeze kayıp üçüncü stoper gibi konumlanan modern bek. Ters kanattaki bekin rahatça hücuma çıkmasını sağlar.',
    dutyDetails: {
      defend: 'Topa sahipken savunma üçlüsünün kenar stoperi olur; hücuma katılmaz, kontra ataklara karşı geride emniyet sağlar.'
    },
    onBall: 'Üçlü oyun kurulumunun sağ veya sol kenarından güvenli paslarla oyunu başlatır.',
    offBall: 'Top rakipteyken klasik dörtlü savunmanın bek pozisyonuna döner.',
    attributes: ['Pozisyon Alma', 'Top Kapma', 'Markaj', 'Pas', 'Soğukkanlılık']
  },
  {
    id: 'cwb',
    name: 'Komple Kanat Bek',
    shortName: 'KKB',
    category: 'DEF',
    duties: ['support', 'attack'],
    summary: 'Kanat bekin en özgür ve yaratıcı hali. Sadece çizgiye inmekle kalmaz, gerektiğinde içe kat edip oyun kurulumuna ve gol pozisyonlarına da girer.',
    dutyDetails: {
      support: 'Kanat koridorunu tek başına domine eder; hem orta açar hem yarı alana kat edip verkaçlar yapar.',
      attack: 'Rakip yarı sahada tamamen bir açık oyuncusu gibi oynar, sürekli adam eksiltir ve ceza sahasına sızar.'
    },
    onBall: 'Dripling, bire bir çalım, erken orta ve içe kat etme seçeneklerinin hepsini kullanır.',
    offBall: 'Yüksek temposuyla hücumdan savunmaya dönüşleri üstlenir.',
    attributes: ['Dayanıklılık', 'Çalışkanlık', 'Dripling', 'Orta Yapma', 'Hızlanma']
  },
  {
    id: 'ncb',
    name: 'Çakılı Stoper (Sert Savunmacı)',
    shortName: 'ÇSTP',
    category: 'DEF',
    duties: ['defend'],
    summary: 'Pas oyunuyla hiç uğraşmayan, tek amacı topu ve rakip forveti ceza sahasından uzaklaştırmak olan saf kesici stoper.',
    dutyDetails: {
      defend: 'Risk sıfırdır; baskı gördüğünde topu düşünmeden uzaklaştırır veya en yakınındaki güvenli oyuncuya verir.'
    },
    onBall: 'Topu ayağında tutmaz, hemen uzaklaştırır.',
    offBall: 'Fiziksel temas, kafa topu ve sert müdahalelerle alanı temizler.',
    attributes: ['Markaj', 'Kafa Vuruşu', 'Top Kapma', 'Cesaret', 'Güç']
  },
  {
    id: 'libero',
    name: 'Libero',
    shortName: 'LİB',
    category: 'DEF',
    duties: ['support', 'attack'],
    summary: 'Üçlü savunmanın ortasından topa sahipken orta sahaya (ön liberoya) doğru öne çıkan, hem süpürücü hem oyun kurucu rol.',
    dutyDetails: {
      support: 'Topa sahipken orta sahaya çıkarak sayısal üstünlük sağlar ve geriden pas dağıtır.',
      attack: 'Orta sahanın da ötesine geçip ceza sahası yayına kadar sürpriz koşular ve uzun şutlar dener.'
    },
    onBall: 'Savunmadan topla çıkar, oyunu yönlendirir ve dikine paslar atar.',
    offBall: 'Top rakipteyken savunma hattının arkasına sızan topları süpürür.',
    attributes: ['Pas', 'Vizyon', 'Pozisyon Alma', 'Soğukkanlılık', 'Top Kapma']
  },

  // ==================== ORTA SAHA ====================
  {
    id: 'dm',
    name: 'Ön Libero',
    shortName: 'ÖL',
    category: 'MID',
    duties: ['defend', 'support'],
    summary: 'Savunma hattının önündeki kalkan. Rakibin merkez hücumlarını bozar, topu kazanır ve basit paslarla yaratıcı oyunculara aktarır.',
    dutyDetails: {
      defend: 'Kesinlikle ileri çıkmaz, stoperlerin önünde kalarak kontra atakları keser ve pas açılarını kapatır.',
      support: 'Savunma güvenliğini korurken topa sahip olunduğunda orta sahaya daha yakın durup pas dolaşımına katılır.'
    },
    onBall: 'Basit, güvenli ve hızlı paslarla oyunu yana veya ileri taşır.',
    offBall: 'Rakip 10 numaranın alanını daraltır ve stoperlerin önünü süpürür.',
    attributes: ['Top Kapma', 'Pozisyon Alma', 'Konsantrasyon', 'Çalışkanlık', 'Güç']
  },
  {
    id: 'anchor',
    name: 'Çapa (Sabit Ön Libero)',
    shortName: 'ÇAPA',
    category: 'MID',
    duties: ['defend'],
    summary: 'Savunmanın hemen önünde adeta demir atan saf kesici. Neredeyse hiç pozisyonunu terk etmez, beklerin ve diğer orta sahaların ileri çıkmasını güvence altına alır.',
    dutyDetails: {
      defend: 'Sadece stoperlerin önündeki alanı savunur. Dripling yapmaz, uzun pas zorlamaz; topu alıp en yakın oyun kurucuya verir.'
    },
    onBall: 'En kısa ve en risksiz pası oynar.',
    offBall: 'Merkezdeki boşlukları kapatır, rakip kontra ataklarını ilk karşılayan isimdir.',
    attributes: ['Pozisyon Alma', 'Konsantrasyon', 'Karar Alma', 'Top Kapma', 'Önsezi']
  },
  {
    id: 'dlp',
    name: 'Derin Oyun Kurucu',
    shortName: 'DOK',
    category: 'MID',
    duties: ['defend', 'support'],
    summary: 'Geriden oyunu yöneten beyin. Savunma önünden attığı uzun, keskin ve yön değiştiren paslarla takımın hücum temposunu belirler.',
    dutyDetails: {
      defend: 'Pozisyonunu derinlerde tutar, savunmaya yardım eder ve hücumları geriden attığı paslarla başlatır.',
      support: 'Topla biraz daha ileri çıkarak orta saha ile hücum hattı arasındaki pas bağlantısını yaratıcı şekilde kurar.'
    },
    onBall: 'Oyunun yönünü değiştirir, savunma arkasına veya kanatlara öldürücü paslar atar.',
    offBall: 'Çok agresif pres yapmaz, pas kanallarını kapatarak pozisyon alır.',
    attributes: ['Pas', 'Vizyon', 'Teknik', 'İlk Kontrol', 'Soğukkanlılık']
  },
  {
    id: 'b2b',
    name: 'İki Yönlü Orta Saha (Box-to-Box)',
    shortName: 'İYO',
    category: 'MID',
    duties: ['support'],
    summary: 'Kendi ceza sahasından rakip ceza sahasına kadar durmadan çalışan dinamik orta saha. Hem savunmada top kapar hem de ceza sahasına geç koşular atar.',
    dutyDetails: {
      support: 'Top rakipteyken savunmaya yardıma gelir, takım hücuma çıktığında ise ikinci dalga olarak ceza sahasına koşu yapar.'
    },
    onBall: 'Topu ileri taşır, verkaçlarla ceza sahası çevresinde şut ve pas arar.',
    offBall: 'Yüksek enerjisiyle her iki ceza sahası arasında sürekli mekik dokur.',
    attributes: ['Dayanıklılık', 'Çalışkanlık', 'Top Kapma', 'Pas', 'Bitiricilik']
  },
  {
    id: 'bwm',
    name: 'Savaşçı Orta Saha',
    shortName: 'SOS',
    category: 'MID',
    duties: ['defend', 'support'],
    summary: 'Rakibe nefes aldırmayan, agresif pres yapan ve topu kazanmaya odaklanan orta saha. Topu kazandıktan sonra basitçe takım arkadaşlarına bırakır.',
    dutyDetails: {
      defend: 'Kendi yarı sahasında agresif baskı yapar, topu kazanır ve derinlerde kalıp pozisyonunu korur.',
      support: 'Daha önde pres yapar, rakibi hataya zorlar ve topu kazandıktan sonra hücuma kısa pas desteği verir.'
    },
    onBall: 'Risksiz paslarla topu yaratıcı oyunculara aktarır.',
    offBall: 'Pozisyonunu bozma pahasına topa sahip rakibe sert baskı uygular.',
    attributes: ['Agresiflik', 'Cesaret', 'Çalışkanlık', 'Top Kapma', 'Dayanıklılık']
  },
  {
    id: 'mez',
    name: 'Mezzala (Yarı Alan Orta Sahası)',
    shortName: 'MEZ',
    category: 'MID',
    duties: ['support', 'attack'],
    summary: 'Merkezden kanada/yarı alana (half-space) doğru açılan hücumcu orta saha. Kanat oyuncusu ve forvetle birleşip rakip bek-stoper arasını deler.',
    dutyDetails: {
      support: 'Yarı alanda pas istasyonu olur, uzak şutlar ve kanatlarla kombinasyonlar dener; savunmada merkeze döner.',
      attack: 'Rakip ceza sahasının köşelerine ve savunma arkasına sürekli koşu atar, kanat forvet gibi skor üretir.'
    },
    onBall: 'Topu yarı alana sürer, ara pas atar veya çaprazdan kaleye şut çeker.',
    offBall: 'Savunmada merkezde kalır, hücumda ise kanada doğru genişler.',
    attributes: ['Dripling', 'Pas', 'Topsuz Alan', 'Teknik', 'Uzun Şut']
  },
  {
    id: 'cm',
    name: 'Merkez Orta Saha',
    shortName: 'MO',
    category: 'MID',
    duties: ['defend', 'support', 'attack', 'auto'],
    summary: 'Takımın ihtiyacına göre şekillenen çok yönlü merkez orta saha. Seçilen göreve bağlı olarak savunma dengesi veya hücum katkısı sağlar.',
    dutyDetails: {
      defend: 'Orta sahanın gerisinde kalır, savunmayı korur ve pas dağıtımına odaklanır.',
      support: 'Merkezde dengeli kalır, topun olduğu bölgeye yaklaşıp hem savunma hem hücum desteği verir.',
      attack: 'Orta sahadan rakip ceza sahasına doğru ileri koşular yapar ve gol pozisyonuna girer.',
      auto: 'Takımın genel mentalitesine göre savunma/hücum dengesini otomatik kurar.'
    },
    onBall: 'Takımın pas temposuna uyum sağlar, dengeli oynar.',
    offBall: 'Orta saha blokunun bütünlüğünü korur.',
    attributes: ['Pas', 'Karar Alma', 'Çalışkanlık', 'İlk Kontrol', 'Pozisyon Alma']
  },
  {
    id: 'regista',
    name: 'Regista',
    shortName: 'REG',
    category: 'MID',
    duties: ['support'],
    summary: 'Derin oyun kurucunun çok daha hareketli ve agresif versiyonu. Savunma önünde sabit kalmaz, tüm orta sahayı gezerek oyunu tek başına yönlendirir.',
    dutyDetails: {
      support: 'Topa sahipken sürekli pas ister, boş alanlara hareketlenir ve rakip savunmayı açan yaratıcı uzun/kısa paslar atar.'
    },
    onBall: 'Yüksek tempoyla oyunu dikte eder, riskli ve yaratıcı paslar dener.',
    offBall: 'Orta sahada takım arkadaşlarına sürekli pas açısı sunmak için gezer.',
    attributes: ['Pas', 'Vizyon', 'Özel Yetenek', 'Teknik', 'Soğukkanlılık']
  },
  {
    id: 'hb',
    name: 'Yarım Bek (Half-Back)',
    shortName: 'YB',
    category: 'MID',
    duties: ['defend'],
    summary: 'Topa sahipken iki stoperin arasına gömülüp üçlü savunma oluşturan ön libero. Bu sayede bekler güvenle kanat forvet gibi ileri çıkabilir.',
    dutyDetails: {
      defend: 'Hücuma çıkarken stoperlerin arasına yerleşir, geriden oyunu kurar ve kontra ataklarda üçüncü stoper olur.'
    },
    onBall: 'Stoperlerin arasından basit ve temiz paslarla topu orta sahaya ve kanatlara aktarır.',
    offBall: 'Top rakipteyken ön libero pozisyonuna geri yükselir.',
    attributes: ['Pozisyon Alma', 'Konsantrasyon', 'Pas', 'Top Kapma', 'Karar Alma']
  },
  {
    id: 'sv',
    name: 'Segundo Volante',
    shortName: 'SV',
    category: 'MID',
    duties: ['support', 'attack'],
    summary: 'Çift ön libero düzeninde oynayan, savunma önünden rakip ceza sahasına kadar sürpriz ve yüksek tempolu koşular atan Brezilya ekolü orta saha.',
    dutyDetails: {
      support: 'Topu kazandıktan sonra ileri taşır, ceza sahası çevresinde şut ve pas bağlantısı sağlar.',
      attack: 'Rakip ceza sahasına doğrudan gol koşuları atar, ikinci dalga bitirici olarak skor üretir.'
    },
    onBall: 'Driplingle mesafe kat eder, uzak şutlar ve verkaçlar dener.',
    offBall: 'Savunmada ön libero görevini eksiksiz yapar, hücumda patlayıcı koşular atar.',
    attributes: ['Dayanıklılık', 'Çalışkanlık', 'Topsuz Alan', 'Uzun Şut', 'Top Kapma']
  },
  {
    id: 'car',
    name: 'Carrilero (Mekik Orta Saha)',
    shortName: 'CAR',
    category: 'MID',
    duties: ['support'],
    summary: 'Dikine değil yatayda çalışan mekik orta saha. Kendi yarı alanını (half-space) kapatır, hücuma çıkan kanat beklerin arkasını kollar.',
    dutyDetails: {
      support: 'Orta saha ile kanat arasındaki boşlukları sürekli kapatır, pas istasyonu olur ve savunma dengesini korur.'
    },
    onBall: 'Basit ve akıllı paslarla topun kanatlara veya 10 numaraya akmasını sağlar.',
    offBall: 'Bek ileri çıktığında kanat koridorunun savunma emniyetini alır.',
    attributes: ['Çalışkanlık', 'Dayanıklılık', 'Pozisyon Alma', 'Pas', 'Karar Alma']
  },
  {
    id: 'rpm',
    name: 'Gezgin Oyun Kurucu',
    shortName: 'GOK',
    category: 'MID',
    duties: ['support'],
    summary: 'Orta sahanın kalbi olarak her bölgeye gidip top isteyen, topu driplingle ileri taşıyan ve yüksek enerjisiyle hem savunma hem hücuma yetişen oyun kurucu.',
    dutyDetails: {
      support: 'Sabit bir bölgede kalmaz; geriden top alır, ileri taşır ve ceza sahası çevresinde oyunu yönlendirir.'
    },
    onBall: 'Topu ayağında taşır, verkaçlarla hızlanır ve yaratıcı paslar verir.',
    offBall: 'Sürekli hareket halindedir, top kaybında hızla geriye döner.',
    attributes: ['Dayanıklılık', 'Çalışkanlık', 'Pas', 'Vizyon', 'Dripling']
  },

  // ==================== KANAT & ON NUMARA ====================
  {
    id: 'ap',
    name: 'Ofansif Oyun Kurucu',
    shortName: 'OOK',
    category: 'WING',
    duties: ['support', 'attack'],
    summary: 'Rakip savunma ile orta saha arasındaki boşluklarda topla buluşup kilit paslar üreten takımın ana yaratıcı gücü.',
    dutyDetails: {
      support: 'Orta sahaya kadar gelip top alır, oyunu kurar ve forvetlere/kanatlara ara paslar atar.',
      attack: 'Rakip stoperlerin hemen önünde konumlanır, ceza sahasına sızar ve doğrudan gol/asist üretir.'
    },
    onBall: 'Boşluk arar, dar alanda adam eksiltir ve savunmayı açan son pası verir.',
    offBall: 'Savunma yükü azdır, geçiş hücumları için boş alanlarda pozisyon alır.',
    attributes: ['Vizyon', 'Pas', 'Teknik', 'İlk Kontrol', 'Özel Yetenek']
  },
  {
    id: 'am',
    name: 'On Numara (Ofansif Orta Saha)',
    shortName: 'OOS',
    category: 'WING',
    duties: ['support', 'attack'],
    summary: 'Forvet arkasında oynayan, hem şut tehdidi hem de pas bağlantısı sunan klasik 10 numara. Oyun kurucuya göre daha fazla gol ve ceza sahası koşusu arar.',
    dutyDetails: {
      support: 'Orta saha ile forvet arasındaki bağlantıyı sağlar, verkaç yapar ve yay üzerinden şut dener.',
      attack: 'Fırsat buldukça ceza sahasına girip ikinci forvet gibi bitiricilik rolü üstlenir.'
    },
    onBall: 'Şut, ara pas ve forvetle duvar pası kombinasyonları yapar.',
    offBall: 'Rakip ön liberoya baskı uygular.',
    attributes: ['İlk Kontrol', 'Pas', 'Uzun Şut', 'Topsuz Alan', 'Teknik']
  },
  {
    id: 'ss',
    name: 'Gizli Forvet',
    shortName: 'GF',
    category: 'WING',
    duties: ['attack'],
    summary: 'Forvet arkasında konumlanmasına rağmen ana hedefi gol atmak olan hücumcu. Santraforun açtığı boşluklara arkadan hızla sızar.',
    dutyDetails: {
      attack: 'Sürekli ceza sahasına dikine koşular atar, oyun kurmaktan çok pozisyon bitirmeye odaklanır.'
    },
    onBall: 'Topu aldığında doğrudan kaleye yönelir, tek vuruş veya driplingle gol arar.',
    offBall: 'Rakip orta sahadan kopup stoperlerin arasına sızar.',
    attributes: ['Topsuz Alan', 'Bitiricilik', 'Hızlanma', 'Soğukkanlılık', 'Önsezi']
  },
  {
    id: 'w',
    name: 'Klasik Kanat',
    shortName: 'KNT',
    category: 'WING',
    duties: ['support', 'attack'],
    summary: 'Çizgiye basarak oyunu genişleten, rakip beki hızı veya çalımlarıyla geçip ceza sahasına orta kesen kanat oyuncusu.',
    dutyDetails: {
      support: 'Kanatta genişlik sağlar, bekiyle paslaşır ve erken ortalarla ceza sahasını besler.',
      attack: 'Rakip bekin üzerine gider, son çizgiye inip sert ve alçak/yüksek ortalar keser.'
    },
    onBall: 'Dışa doğru dripling yapar, çizgiyi kullanarak orta açar.',
    offBall: 'Rakip beki kovalar, kanat savunmasına yardım eder.',
    attributes: ['Hız', 'Hızlanma', 'Orta Yapma', 'Dripling', 'Teknik']
  },
  {
    id: 'iw',
    name: 'Ters Ayaklı Kanat',
    shortName: 'TAK',
    category: 'WING',
    duties: ['support', 'attack'],
    summary: 'Topu aldıktan sonra çizgiden değil, içe doğru dripling yaparak şut veya ara pas açısı yaratan modern kanat. Beklere bindirme koridoru açar.',
    dutyDetails: {
      support: 'İçe kat ederek oyun kurulumuna katılır, ters kanada uzun paslar veya forvete ara paslar atar.',
      attack: 'Topla birlikte ceza sahası içine veya yayına süratle kat eder, kaleye şut çeker.'
    },
    onBall: 'Güçlü ayağına çekip merkezde tehlike yaratır.',
    offBall: 'Kanat savunmasında pozisyonunu alır.',
    attributes: ['Dripling', 'Pas', 'Hızlanma', 'Teknik', 'Uzun Şut']
  },
  {
    id: 'if',
    name: 'İçe Katan Forvet (Inside Forward)',
    shortName: 'İKF',
    category: 'WING',
    duties: ['support', 'attack'],
    summary: 'Kanattan başlayıp topsuz ve toplu koşularla doğrudan gol bölgesine (ceza sahasına) giren kanat forvet.',
    dutyDetails: {
      support: 'Yarı alana kat edip forvetle verkaç yapar, şut ve pas dengesini korur.',
      attack: 'Ters kanattan gelen ortalarda arka direğe koşu atar, savunma arkasına çapraz sızar ve gol arar.'
    },
    onBall: 'Doğrudan kaleye yönelir, şut odaklıdır.',
    offBall: 'Topla buluşmadan önce bile merkeze doğru çapraz koşular yapar.',
    attributes: ['Bitiricilik', 'Topsuz Alan', 'Hızlanma', 'Dripling', 'Soğukkanlılık']
  },
  {
    id: 'wp',
    name: 'Oyun Kurucu Kanat (Wide Playmaker)',
    shortName: 'OKK',
    category: 'WING',
    duties: ['support', 'attack'],
    summary: 'Kanat çizgisinden ziyade iç koridora kayarak takımın ana oyun kurucusu gibi oynayan kanat oyuncusu. Beklerin bindirmesiyle oluşan genişliği pasla besler.',
    dutyDetails: {
      support: 'Kanattan merkeze doğru sokulur, orta sahaya ekstra pas opsiyonu olur ve oyunu ince paslarla yönlendirir.',
      attack: 'Rakip savunma ile orta saha arasına sızarak öldürücü ara paslar atar ve şut açısı arar.'
    },
    onBall: 'Çizgiye inip orta açmak yerine içe dönüp kilit paslar ve yön değiştiren toplar atar.',
    offBall: 'Topa sahipken merkezi kalabalıklaştırır, savunmada kanadına döner.',
    attributes: ['Vizyon', 'Pas', 'İlk Kontrol', 'Teknik', 'Karar Alma']
  },
  {
    id: 'rmd',
    name: 'Raumdeuter (Alan Arayıcısı)',
    shortName: 'RMD',
    category: 'WING',
    duties: ['attack'],
    summary: 'Kelime anlamı "Alan Yorumcusu" (Thomas Müller rolü). Topa sahip olunduğunda savunmanın kör noktalarını koklar ve hiç beklenmedik anlarda ceza sahasında bitirir.',
    dutyDetails: {
      attack: 'Oyun kurulumuna veya çizgi oyununa pek karışmaz; tamamen topsuz koşularla boşluk bulup gol atmaya odaklanır.'
    },
    onBall: 'Az dokunuşla tek vuruş gol veya asist pası üretir.',
    offBall: 'Sürekli rakip bek ile stoper arasındaki boşluğa ve arka direğe sızar.',
    attributes: ['Topsuz Alan', 'Önsezi', 'Bitiricilik', 'Soğukkanlılık', 'Çalışkanlık']
  },
  {
    id: 'tq',
    name: 'Trequartista',
    shortName: 'TREQ',
    category: 'WING',
    duties: ['attack'],
    summary: 'Savunma görevinden neredeyse tamamen muaf tutulan, tüm hücum hattında özgürce gezerek dehasıyla maç çözen serbest yaratıcı.',
    dutyDetails: {
      attack: 'Boşluk gördüğü her yere (kanada, merkeze, forvet arkasına) gider; çalım, ara pas ve şutla tehlike yaratır.'
    },
    onBall: 'Tam yaratıcı özgürlükle oynar, savunmayı tek başına deler.',
    offBall: 'Savunmaya yardım etmez, top kazanıldığı an için boş alanlarda bekler.',
    attributes: ['Özel Yetenek', 'Vizyon', 'İlk Kontrol', 'Teknik', 'Topsuz Alan']
  },
  {
    id: 'eng',
    name: 'Enganche',
    shortName: 'ENG',
    category: 'WING',
    duties: ['support'],
    summary: 'Takımın sabit ekseni olan klasik Güney Amerika 10 numarası. Çok koşmaz veya yerini terk etmez; etrafındaki koşuculara nokta atışı paslar dağıtır.',
    dutyDetails: {
      support: 'Forvet arkasında sabit bir pivot gibi durur, topu alır almaz koşu atan kanat ve forvetleri besler.'
    },
    onBall: 'Driplingten çok tek dokunuş ve milimetrik ara paslarla oyunu açar.',
    offBall: 'Pozisyonunu korur, pas bağlantı noktası olarak sabit kalır.',
    attributes: ['Pas', 'Vizyon', 'İlk Kontrol', 'Teknik', 'Soğukkanlılık']
  },
  {
    id: 'dw',
    name: 'Defansif Kanat',
    shortName: 'DKNT',
    category: 'WING',
    duties: ['defend', 'support'],
    summary: 'Rakip beklerin oyun kurmasını bozmak için önde agresif baskı yapan, topu kazandıktan sonra hızlıca içeri servis yapan çalışkan kanat.',
    dutyDetails: {
      defend: 'Önceliği rakip beki takip etmek ve kendi kanadını savunmaktır.',
      support: 'Önde baskıyla top kapar ve beklerin arkasına sarkıp hızlı orta veya pas çıkarır.'
    },
    onBall: 'Hızlı ve direkt oynar, topu kazandıktan sonra hemen ceza sahasına yönlendirir.',
    offBall: 'Rakip beklere ve stoperlere sürekli pres uygular.',
    attributes: ['Çalışkanlık', 'Dayanıklılık', 'Agresiflik', 'Top Kapma', 'Hız']
  },
  {
    id: 'wtf',
    name: 'Geniş Hedef Adam',
    shortName: 'GHA',
    category: 'WING',
    duties: ['support', 'attack'],
    summary: 'Fizik gücü ve boy avantajını kanatta kullanan rol. Uzun topları kanatta indirir, rakip kısa bekleri hava toplarında ezer.',
    dutyDetails: {
      support: 'Kaleciden veya stoperlerden gelen uzun topları kanatta göğsüyle/kafasıyla indirip orta sahaya dağıtır.',
      attack: 'Ters kanattan gelen ortalarda arka direkte rakip bekin üzerinden kafa vuruşları yapar.'
    },
    onBall: 'Sırtı dönük top saklar ve fiziksel üstünlükle alan kazanır.',
    offBall: 'Arka direğe koşu atar ve uzun toplar için hedef olur.',
    attributes: ['Zıplama', 'Kafa Vuruşu', 'Güç', 'Denge', 'Topsuz Alan']
  },

  // ==================== FORVET ====================
  {
    id: 'af',
    name: 'Yaratıcı / Hareketli Forvet (Advanced Forward)',
    shortName: 'YF',
    category: 'FWD',
    duties: ['attack'],
    summary: 'Hücum hattının en ucunda oynayan, sürekli savunma arkasına koşu atan ve kanatlara açılarak boşluk yaratan modern golcü.',
    dutyDetails: {
      attack: 'Rakip stoperlerin omuzunda oynar, derinlemesine koşularla savunma hattını geriye iter ve golü kovalar.'
    },
    onBall: 'Hızlı hücumlarda topu taşır, bire birde kaleciyi veya stoperi geçip bitirir.',
    offBall: 'Rakip stoperlere pres yapar ve ofsayt çizgisinde sürekli koşu tehdidi oluşturur.',
    attributes: ['Bitiricilik', 'Topsuz Alan', 'Hız', 'Hızlanma', 'Soğukkanlılık']
  },
  {
    id: 'poacher',
    name: 'Fırsatçı Golcü',
    shortName: 'FG',
    category: 'FWD',
    duties: ['attack'],
    summary: 'Tek işi ceza sahası içinde doğru yerde durup tek vuruşla gol atmak olan saf golcü. Oyun kurulumuna veya kanatlara neredeyse hiç karışmaz.',
    dutyDetails: {
      attack: 'Ceza sahası çevresinde ve içinde pusuda bekler, seken topları ve ortaları gole çevirir.'
    },
    onBall: 'Minimum dokunuşla hemen kaleye şut çeker.',
    offBall: 'Stoperlerin kör noktalarına saklanır.',
    attributes: ['Bitiricilik', 'Önsezi', 'Topsuz Alan', 'Soğukkanlılık', 'İlk Kontrol']
  },
  {
    id: 'dlf',
    name: 'Sahte / Yardımcı Forvet (Deep-Lying Forward)',
    shortName: 'SFV',
    category: 'FWD',
    duties: ['support', 'attack'],
    summary: 'Orta saha ile hücumu birbirine bağlayan forvet. Derine gelip sırtı dönük top alır ve arkadan koşan kanat/10 numaralara alan açar.',
    dutyDetails: {
      support: 'Stoperleri üzerine çekip orta sahaya yaklaşır, topu saklar ve koşu atan arkadaşlarına pas indirir.',
      attack: 'Bağlantı oyununu yaptıktan sonra hemen ceza sahasına girerek gol pozisyonunu kendisi bitirir.'
    },
    onBall: 'Topu saklar, duvar pası yapar ve oyunu kanatlara açar.',
    offBall: 'Derine inerek stoperlerin pozisyonunu bozar.',
    attributes: ['İlk Kontrol', 'Pas', 'Güç', 'Vizyon', 'Bitiricilik']
  },
  {
    id: 'tf',
    name: 'Pivot Santrafor',
    shortName: 'PİV',
    category: 'FWD',
    duties: ['support', 'attack'],
    summary: 'Fiziksel gücü ve hava hakimiyetiyle uzun topları indiren, ceza sahasında rakipleri yıpratan santrafor.',
    dutyDetails: {
      support: 'Uzun topları göğsüyle veya kafasıyla indirip etrafındaki hızlı oyunculara servis yapar.',
      attack: 'Ceza sahası içinde fiziksel üstünlüğünü kullanarak kafa golleri ve yakın mesafe vuruşları arar.'
    },
    onBall: 'Sırtı dönük top tutar, faul alır ve yanındakilere pas verir.',
    offBall: 'Stoperlerle fiziksel mücadele içine girer.',
    attributes: ['Zıplama', 'Kafa Vuruşu', 'Güç', 'Denge', 'Bitiricilik']
  },
  {
    id: 'pf',
    name: 'Çalışkan Forvet (Pressing Forward)',
    shortName: 'ÇF',
    category: 'FWD',
    duties: ['defend', 'support', 'attack'],
    summary: 'Savunmayı en önden başlatan, rakip stoperlere ve kaleciye durmadan baskı yapıp hataya zorlayan yüksek enerjili forvet.',
    dutyDetails: {
      defend: 'Önceliği rakip oyun kurucuları ve stoperleri bozmaktır; çok derinlerde bile savunma kovalar.',
      support: 'Ön alan baskısı yapar, topu kazanınca arkadaşlarına oynar ve bağlantı sağlar.',
      attack: 'Agresif presin yanında savunma arkasına da sürekli koşu atarak gol arar.'
    },
    onBall: 'Basit, direkt ve hızlı şekilde kaleye inmeye çalışır.',
    offBall: 'Rakip savunmaya nefes aldırmaz, pas açılarını kapatır.',
    attributes: ['Çalışkanlık', 'Agresiflik', 'Dayanıklılık', 'Hızlanma', 'Bitiricilik']
  },
  {
    id: 'cf',
    name: 'Komple Forvet',
    shortName: 'KF',
    category: 'FWD',
    duties: ['support', 'attack'],
    summary: 'Hem pivot gibi top saklayabilen, hem yaratıcı forvet gibi savunma arkasına koşabilen, hem de oyun kurabilen eksiksiz santrafor.',
    dutyDetails: {
      support: 'Derine gelip oyun kurar, kanatlara servis yapar ve aynı zamanda ceza sahasına girer.',
      attack: 'Hücumun her aşamasında özgürce hareket eder, dripling, şut ve hava topuyla tehdit yaratır.'
    },
    onBall: 'Duruma göre dripling, duvar pası veya şut seçer.',
    offBall: 'Özgürce boşluk arar.',
    attributes: ['Bitiricilik', 'İlk Kontrol', 'Güç', 'Hızlanma', 'Vizyon']
  },
  {
    id: 'f9',
    name: 'Sahte 9 (False Nine)',
    shortName: 'S9',
    category: 'FWD',
    duties: ['support'],
    summary: 'Santrafor bölgesinden orta sahaya kadar derine inip rakip stoperleri peşinden sürükleyen yaratıcı forvet. Stoperlerin bıraktığı boşluğa kanat forvetler sızar.',
    dutyDetails: {
      support: 'Ceza sahası içinde beklemek yerine derine gelir; orta sahada sayısal üstünlük kurar ve savunma arkasına koşan kanatlara ara pas atar.'
    },
    onBall: 'Driplingle döner, ara pas atar veya uzaktan şut dener.',
    offBall: 'Stoperlerle orta saha arasındaki boşluğa geri çekilerek savunma düzenini bozar.',
    attributes: ['Vizyon', 'Pas', 'İlk Kontrol', 'Dripling', 'Karar Alma']
  }
];

export function getRoleById(id) {
  return ROLES.find(r => r.id === id) || ROLES[0];
}

export function getRolesForZone(zoneCode) {
  if (zoneCode === 'KL') return ROLES.filter(r => r.category === 'GK');
  if (['STP', 'SLB', 'SĞB', 'SLKB', 'SĞKB'].includes(zoneCode)) {
    return ROLES.filter(r => r.category === 'DEF');
  }
  if (['DOS', 'MO'].includes(zoneCode)) {
    return ROLES.filter(r => r.category === 'MID');
  }
  if (['SLM', 'SĞM', 'SLK', 'SĞK', 'OOS'].includes(zoneCode)) {
    return ROLES.filter(r => r.category === 'WING' || r.category === 'MID');
  }
  if (zoneCode === 'SF') {
    return ROLES.filter(r => r.category === 'FWD');
  }
  return ROLES;
}
