Blog Yönetim Sistemi (Node.js & MongoDB)
Bu proje, kullanıcıların kayıt olabildiği, giriş yapabildiği ve admin yetkisiyle blog içerikleri oluşturup yönetebildiği (CRUD) dinamik bir web uygulamasıdır.

 Özellikler
Kullanıcı Sistemi: Passport.js ve Bcrypt kullanılarak güvenli kayıt ve giriş mekanizması.

Blog Yönetimi (CRUD): * Blog yazılarını görüntüleme.

Yeni yazı ekleme (Başlık, İçerik, Kategori).

Mevcut yazıları silme ve düzenleme.

Veritabanı: MongoDB Atlas entegrasyonu ile verilerin bulutta saklanması.

Oturum Yönetimi: express-session ve connect-mongo ile kalıcı oturum desteği.

Frontend: EJS (Embedded JavaScript) motoru ile dinamik sayfa yapısı.

🛠 Kullanılan Teknolojiler
Backend: Node.js, Express.js

Veritabanı: MongoDB (Mongoose ODM)

Güvenlik: Passport.js (Local Strategy), Bcrypt

Template Engine: EJS

Stil: CSS / Bootstrap

 Kurulum ve Çalıştırma
Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

Depoyu Klonlayın veya İndirin:

Bash
git clone [repo-url]
cd blog-projesi
Bağımlılıkları Yükleyin:

Bash
npm install
Çevresel Değişkenleri (.env) Ayarlayın:
Ana dizinde bir .env dosyası oluşturun ve MongoDB bağlantı adresinizi ekleyin:

Kod snippet'i
MONGODB_URI=mongodb+srv://kullaniciadiniz:sifreniz@cluster.mongodb.net/BlogDB
Uygulamayı Başlatın:

Bash
npm start
Uygulama varsayılan olarak http://localhost:3000 adresinde çalışacaktır.

 Proje Yapısı
app.js: Uygulamanın ana giriş noktası ve konfigürasyonlar.

models/: Mongoose şemaları (User, Blog).

routes/: Sayfa yönlendirmeleri ve API rotaları.

views/: EJS arayüz dosyaları.

public/: CSS, resimler ve statik dosyalar.
