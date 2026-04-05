# ⛸️Skating Platformasında SQL Injection Analizi və Təhlükəsizlik Hesabatı

**Tələbə:** Idris Xıdırov
**Qrup:** 693.24

---

### 1. Layihə Haqqında Qısa Məlumat
Mənim hazırladığım bu layihə "Skating Hub" adlanır və skeyterlərin öz profillərinə daxil olması üçün nəzərdə tutulmuş bir platformadır.
Saytın əsas hissəsi Login (Giriş) səhifəsidir.
İstifadə etdiyim texnologiyalar:
* Görünüş (Frontend): HTML, CSS və JavaScript.
* Server hissəsi: Node.js və Express freymvorku.
* Məlumat bazası: İstifadəçi məlumatlarını saxlamaq üçün SQLite.
  <img width="692" height="714" alt="Screenshot 2026-04-05 112043" src="https://github.com/user-attachments/assets/f7bf0fb7-8afe-4748-8938-cd4663e4d904" />



**Saytın işləmə prinsipi:**
Saytda qeydiyyat hissəsi yoxdur, çünki istifadəçilər sistemə öncədən (admin tərəfindən) əlavə edilib.
İstifadəçi sadəcə öz email və şifrəsini yazaraq daxil olmalıdır. Bütün yoxlanışlar server tərəfində, skating.db faylı vasitəsilə aparılır.
<img width="501" height="155" alt="Screenshot 2026-04-05 112942" src="https://github.com/user-attachments/assets/358b172c-384a-4138-8c98-3df9146c27c4" />
<img width="845" height="198" alt="Screenshot 2026-04-05 113106" src="https://github.com/user-attachments/assets/68a581b9-c7ad-4758-90e9-7b78d64410b1" />


---

### 2. SQL Injection Zəifliyinin Analizi
Layihənin server hissəsində (server.js) istifadəçi girişini yoxlamaq üçün müasir JavaScript-in Template Literals xüsusiyyətindən istifadə edilmişdir.
Lakin bu metoddan düzgün istifadə edilməməsi sistemdə ciddi təhlükəsizlik boşluğu yaratmışdır.
<img width="883" height="29" alt="Screenshot 2026-04-05 115200" src="https://github.com/user-attachments/assets/df4d886f-2083-4099-8640-9d8186ccbce6" />


**Niyə bu kod zəifdir?**
Bu halda, SQL sorğusunun daxilində ${email} və ${password} dəyişənləri var. Sistem bu dəyişənlərdəki məlumatları yoxlamadan olduğu kimi qəbul edir.
Bu, hücumçuya SQL sorğusunun məntiqi strukturunu pozmaq üçün tək dırnaq (') kimi xüsusi simvollardan istifadə etməyə imkan verir.

---

### 3. Hücum Ssenarisi (Login Bypass)
Hücumçu şifrəni bilmədən hesaba daxil olmaq üçün xüsusi bir kod istifadə edir.

**Hücum Addımları:**
1. Email xanasına hər hansı bir email yazılır (Məsələn: skate_bro@gmail.com).
2. Şifrə xanasına bu kod yazılır: `' OR 1=1 --`
<img width="555" height="175" alt="Screenshot 2026-04-05 122437" src="https://github.com/user-attachments/assets/ddb610ec-65f9-4b8d-8b4c-237023728662" />

Göründüyü kimi uğurla giriş etdik.

**Hücumun Məntiqi:**
Daxil edilən payload SQL sorğusunu bu hala salır:
`SELECT * FROM users WHERE email = 'skate_bro@gmail.com' AND password = ' ' OR 1=1 -- '`
Burada '1'='1' şərti həmişə doğru olduğu üçün, verilənlər bazası şifrənin yanlış olmasına baxmayaraq istifadəçini içəri buraxır.

---

### 4. SQL Injection Hücumundan Müdafiə
SQL-də də məlumatı əmrdən ayırmaq üçün Parameterized Queries (Parametrləşdirilmiş Sorğular) istifadə etməliyik.

**Həll Üsulu:**
Template Literals (${}) yerinə, SQLite-ın təhlükəsiz placeholderlarından (?) istifadə edilir.
Bu zaman baza daxil edilən simvolları (dırnaq, bərabərlik) kod kimi deyil, sadəcə mətn kimi qəbul edir.

**Düzəldilmiş Kod Nümunəsi:**
<img width="708" height="61" alt="Screenshot 2026-04-05 140206" src="https://github.com/user-attachments/assets/ebff1754-a479-4b74-99f0-8f29beb3ee31" />

Bu hissədə biz SQL əmrini yazırıq, amma email və şifrə gələcək yerləri boş saxlayırıq.
Sual işarəsi (?) nədir? Bu, "yer tutucu"dur (placeholder).
SQLite-a deyirik ki: "Bura bir məlumat gələcək, amma o gələn şeyə əsla bir kod (əmr) kimi baxma. Onu sadəcə bir yazı kimi qəbul et."

`db.get(sql, [email, password], ...)` - Buradan bazadaki melumatlar ile daxil edilen məlumatlara uyğun gələn ilk sətri tapmaq üçün istifade olunur.
Əgər məlumatları sql dəyişəninin içində (Template Literals ilə) yapışdırıb, `db.get(sql, [])` şəklində boş mötərizə ilə göndərsək, baza bunu birbaşa əmr kimi qəbul edir.

**Nəticə:**
Artıq hücumçu `' OR 1=1` yazsa da, sistem bazada həmin mətnə uyğun bir şifrə axtaracaq amma tapa bilməyəcəyi üçün girişi rədd edəcək.
